"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvoiceByDate = exports.sendInvoiceMail = exports.getAllInvoices = exports.deleteInvoice = exports.updateInvoice = exports.createInvoice = void 0;
const client_1 = require("@prisma/client");
const invoiceMail_1 = require("./mails/invoiceMail");
const prisma = new client_1.PrismaClient();
const createInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, dueDate, discount, total, items, Client, invoiceId } = req.body;
    if (!date || !dueDate || !total || !invoiceId || !items || !Client) {
        res.status(400).json({
            message: "All required fields must be provided",
        });
        return;
    }
    try {
        // Get next invoice sequence from Settings
        const settings = yield prisma.settings.findFirst();
        if (!settings) {
            res.status(400).json({
                message: "Settings not configured",
            });
            return;
        }
        const invoice = yield prisma.invoice.create({
            data: {
                invoiceId,
                date: new Date(date),
                dueDate: new Date(dueDate),
                discount: discount || 0,
                total: parseFloat(total),
                clientId: Client.id,
                pendingAmount: parseFloat(total),
            },
        });
        Promise.all(items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.itemInvoice.create({
                data: {
                    itemId: item.itemId,
                    invoiceId: invoice.id,
                    amount: parseFloat(item.amount),
                    quantity: parseFloat(item.quantity),
                    tax: item.tax,
                },
            });
            const items = yield prisma.item.findUnique({
                where: { id: item.itemId },
            });
            if (items && (items === null || items === void 0 ? void 0 : items.quantity) < parseFloat(item.quantity)) {
                res.status(204).json({
                    message: "Out of stock",
                });
                return;
            }
            else if (items) {
                yield prisma.item.update({
                    where: { id: item.itemId },
                    data: {
                        quantity: items.quantity - parseFloat(item.quantity),
                    },
                });
            }
        })));
        // Update invoice sequence in settings
        yield prisma.settings.update({
            where: { id: settings.id },
            data: {
                invoiceSequence: settings.invoiceSequence + 1,
            },
        });
        let updatedClient = null;
        if (Client) {
            updatedClient = yield prisma.client.update({
                where: { id: Client.id },
                data: {
                    outstanding: {
                        increment: parseFloat(total),
                    },
                },
            });
            // Check if outstanding exceeds creditLimit and create notification
            if (updatedClient.outstanding > updatedClient.creditLimit) {
                yield prisma.notification.create({
                    data: {
                        title: "Credit Limit Exceeded",
                        description: "",
                        message: `Outstanding (${updatedClient.outstanding}) has exceeded credit limit of (${updatedClient.creditLimit}) for client ${updatedClient.name}`,
                    },
                });
            }
        }
        res.status(200).json({
            message: "Invoice created successfully",
        });
    }
    catch (error) {
        console.error("Create invoice error:", error);
        res.status(400).json({
            message: "Failed to create invoice",
        });
    }
});
exports.createInvoice = createInvoice;
const updateInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, date, dueDate, discount, total, Client, items } = req.body;
    if (!id || !date || !dueDate || !total || !Client) {
        res.status(400).json({
            message: "All required fields must be provided",
        });
        return;
    }
    try {
        // Check if invoice exists
        const existingInvoice = yield prisma.invoice.findUnique({
            where: { id },
        });
        if (!existingInvoice) {
            res.status(203).json({
                message: "Invoice doesn't exist",
            });
            return;
        }
        const itemInvoice = yield prisma.itemInvoice.findMany({
            where: {
                invoiceId: id,
            },
        });
        Promise.all(itemInvoice.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.item.update({
                where: { id: item.itemId },
                data: {
                    quantity: {
                        increment: item.quantity,
                    },
                },
            });
            yield prisma.itemInvoice.delete({
                where: { itemId_invoiceId: { itemId: item.itemId, invoiceId: id } },
            });
        })));
        let oldPayments = 0;
        const payment = yield prisma.payments.findMany({
            where: { invoiceId: id },
        });
        if (payment) {
            oldPayments = payment.reduce((acc, curr) => acc + curr.amount, 0);
        }
        yield prisma.invoice.update({
            where: { id },
            data: {
                date: new Date(date),
                dueDate: new Date(dueDate),
                discount: discount || 0,
                total: parseFloat(total),
                clientId: Client.id,
                pendingAmount: parseFloat(total) - oldPayments,
            },
        });
        Promise.all(items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.itemInvoice.create({
                data: {
                    itemId: item.itemId,
                    invoiceId: id,
                    amount: parseFloat(item.amount),
                    quantity: parseFloat(item.quantity),
                    tax: item.tax,
                },
            });
            const items = yield prisma.item.findUnique({
                where: { id: item.itemId },
            });
            if (items && (items === null || items === void 0 ? void 0 : items.quantity) < parseFloat(item.quantity)) {
                res.status(204).json({
                    message: "Item not found",
                });
                return;
            }
            else if (items) {
                yield prisma.item.update({
                    where: { id: item.itemId },
                    data: {
                        quantity: items.quantity - parseFloat(item.quantity),
                    },
                });
            }
        })));
        // Subtract the old invoice total from client's outstanding and update
        if (existingInvoice.clientId && existingInvoice.clientId !== Client.id) {
            let existingTotal = existingInvoice.pendingAmount;
            const client = yield prisma.client.findUnique({
                where: { id: existingInvoice.clientId },
            });
            if (!client) {
                res.status(400).json({
                    message: "Client not found",
                });
                return;
            }
            const outstanding = client.outstanding - existingTotal;
            const updatedClient = yield prisma.client.update({
                where: { id: existingInvoice.clientId },
                data: {
                    outstanding: outstanding,
                },
            });
            const newClient = yield prisma.client.findUnique({
                where: { id: Client.id },
            });
            if (!newClient) {
                res.status(400).json({
                    message: "Client not found",
                });
                return;
            }
            const newoutstanding = newClient.outstanding + parseFloat(existingTotal.toString());
            yield prisma.client.update({
                where: { id: newClient.id },
                data: {
                    outstanding: newoutstanding,
                },
            });
            // Check if outstanding exceeds creditLimit and create notification
            if (updatedClient.outstanding > updatedClient.creditLimit) {
                yield prisma.notification.create({
                    data: {
                        title: "Credit Limit Exceeded",
                        description: "",
                        message: `Outstanding (${updatedClient.outstanding}) has exceeded credit limit of (${updatedClient.creditLimit}) for client ${updatedClient.name}`,
                    },
                });
            }
        }
        else {
            const client = yield prisma.client.findUnique({
                where: { id: Client.id },
            });
            if (!client) {
                res.status(400).json({
                    message: "Client not found",
                });
                return;
            }
            if (client.outstanding < parseFloat(total)) {
                yield prisma.notification.create({
                    data: {
                        title: "Credit Limit Exceeded",
                        description: "",
                        message: `Outstanding (${client.outstanding}) has exceeded credit limit of (${client.creditLimit}) for client ${client.name}`,
                    },
                });
            }
        }
        res.status(200).json({
            message: "Invoice updated successfully",
        });
    }
    catch (error) {
        console.error("Update invoice error:", error);
        res.status(400).json({
            message: "Failed to update invoice",
        });
    }
});
exports.updateInvoice = updateInvoice;
const deleteInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    console.log(id);
    if (!id) {
        res.status(400).json({
            message: "Invoice ID is required",
        });
        return;
    }
    try {
        // Check if invoice exists
        const existingInvoice = yield prisma.invoice.findUnique({
            where: { id },
        });
        if (!existingInvoice) {
            res.status(203).json({
                message: "Invoice doesn't exist",
            });
            return;
        }
        const invoiceItems = yield prisma.itemInvoice.findMany({
            where: {
                invoiceId: id,
            },
        });
        if (invoiceItems) {
            Promise.all(invoiceItems.map((iteminvoice) => __awaiter(void 0, void 0, void 0, function* () {
                yield prisma.item.update({
                    where: { id: iteminvoice.itemId },
                    data: {
                        quantity: {
                            increment: iteminvoice.quantity,
                        },
                    },
                });
            })));
        }
        else {
            res.status(204).json({
                message: "Invoice doesn't exist",
            });
            return;
        }
        // Delete the invoice
        yield prisma.invoice.delete({
            where: { id },
        });
        if (existingInvoice.clientId) {
            // Subtract the invoice total from client's outstanding
            yield prisma.client.update({
                where: { id: existingInvoice.clientId },
                data: {
                    outstanding: {
                        decrement: existingInvoice.pendingAmount,
                    },
                },
            });
        }
        res.status(200).json({
            message: "Invoice deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Failed to delete invoice",
        });
    }
});
exports.deleteInvoice = deleteInvoice;
const getAllInvoices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoices = yield prisma.invoice.findMany({
            include: {
                ItemInvoice: {
                    include: {
                        item: true,
                    },
                },
                Client: true,
                payments: true,
            },
            orderBy: {
                date: "desc",
            },
        });
        res.status(200).json({
            message: "Invoices retrieved successfully",
            data: invoices,
        });
    }
    catch (error) {
        console.error("Get invoices error:", error);
        res.status(400).json({
            message: "Failed to retrieve invoices",
        });
    }
});
exports.getAllInvoices = getAllInvoices;
const sendInvoiceMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const invoiceData = JSON.parse(req.body.invoiceData);
    if (!invoiceData) {
        res.status(400).json({
            message: "Invoice data is required",
        });
        return;
    }
    const subject = "Invoice details for - " + invoiceData.invoiceId;
    try {
        let attachments;
        if (req.file) {
            attachments = {
                filename: "invoice.pdf",
                content: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }
        yield (0, invoiceMail_1.sendInvoiceMailToClient)(email, subject, (0, invoiceMail_1.InvoiceMailBody)(invoiceData), attachments);
        res.status(200).json({
            message: "LR Email Sent",
        });
    }
    catch (error) {
        console.error("Send invoice mail error:", error);
        res.status(400).json({
            message: "Failed to send invoice mail",
        });
    }
});
exports.sendInvoiceMail = sendInvoiceMail;
const getInvoiceByDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to } = req.body;
    if (!from || !to) {
        res.status(400).json({
            message: "All required fields must be provided",
        });
        return;
    }
    const adjustedTo = new Date(to);
    adjustedTo.setDate(adjustedTo.getDate() + 1);
    try {
        const invoices = yield prisma.invoice.findMany({
            where: {
                date: {
                    gte: new Date(from),
                    lte: adjustedTo,
                },
            },
            include: {
                Client: true,
            },
        });
        res.status(200).json({
            message: "Invoices retrieved successfully",
            data: invoices,
        });
    }
    catch (error) {
        console.error("Get invoices error:", error);
        res.status(400).json({
            message: "Failed to retrieve invoices",
        });
    }
});
exports.getInvoiceByDate = getInvoiceByDate;
