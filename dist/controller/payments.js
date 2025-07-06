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
exports.deletePayment = exports.updatePayment = exports.createPayment = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, amount, amountInWords, pendingAmount, transactionId, paymentMode, remarks, invoiceNumber, clientName, invoiceId, } = req.body;
    if (!date ||
        !amount ||
        !amountInWords ||
        !pendingAmount ||
        !transactionId ||
        !paymentMode ||
        !remarks ||
        !invoiceNumber ||
        !clientName ||
        !invoiceId) {
        res.status(400).json({
            message: "All required fields must be provided",
        });
        return;
    }
    try {
        const payment = yield prisma.payments.create({
            data: {
                date: new Date(date),
                amount: parseFloat(amount),
                amountInWords: amountInWords,
                pendingAmount: parseFloat(pendingAmount),
                transactionId,
                paymentMode,
                remarks,
                invoiceNumber,
                clientName,
                invoiceId,
            },
        });
        yield prisma.invoice.update({
            where: { id: invoiceId },
            data: {
                pendingAmount: {
                    decrement: payment.amount,
                },
            },
        });
        const client = yield prisma.client.findUnique({
            where: { name: payment.clientName },
        });
        if (!client) {
            res.status(400).json({
                message: "Client not found",
            });
            return;
        }
        yield prisma.client.update({
            where: { id: client.id },
            data: {
                outstanding: {
                    decrement: payment.amount,
                },
            },
        });
        res.status(200).json({
            message: "Payment created successfully",
        });
    }
    catch (error) {
        console.error("Create payment error:", error);
        res.status(400).json({
            message: "Failed to create payment",
        });
    }
});
exports.createPayment = createPayment;
const updatePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { date, amount, amountInWords, pendingAmount, transactionId, paymentMode, remarks, invoiceNumber, clientName, invoiceId, } = req.body;
    if (!id ||
        !date ||
        !amount ||
        !amountInWords ||
        !pendingAmount ||
        !transactionId ||
        !paymentMode ||
        !remarks ||
        !invoiceNumber ||
        !clientName ||
        !invoiceId) {
        res.status(400).json({
            message: "All required fields must be provided",
        });
        return;
    }
    try {
        const existingPayment = yield prisma.payments.findUnique({
            where: { id },
        });
        if (!existingPayment) {
            res.status(203).json({
                message: "Payment doesn't exist",
            });
            return;
        }
        const payment = yield prisma.payments.update({
            where: { id },
            data: {
                date: new Date(date),
                amount: parseFloat(amount),
                amountInWords,
                pendingAmount: parseFloat(pendingAmount),
                transactionId,
                paymentMode,
                remarks,
                invoiceNumber,
                clientName,
                invoiceId,
            },
        });
        yield prisma.invoice.update({
            where: { id: invoiceId },
            data: {
                pendingAmount: parseFloat(pendingAmount),
            },
        });
        const client = yield prisma.client.findUnique({
            where: { name: payment.clientName },
        });
        if (!client) {
            res.status(400).json({
                message: "Client not found",
            });
            return;
        }
        const oldOutstanding = client.outstanding - (existingPayment === null || existingPayment === void 0 ? void 0 : existingPayment.pendingAmount);
        yield prisma.client.update({
            where: { id: client.id },
            data: {
                outstanding: oldOutstanding + parseFloat(pendingAmount),
            },
        });
        res.status(200).json({
            message: "Payment updated successfully",
        });
    }
    catch (error) {
        console.error("Update payment error:", error);
        res.status(400).json({
            message: "Failed to update payment",
        });
    }
});
exports.updatePayment = updatePayment;
const deletePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({
            message: "Payment ID is required",
        });
        return;
    }
    try {
        // Check if payment exists
        const existingPayment = yield prisma.payments.findUnique({
            where: { id },
        });
        if (!existingPayment) {
            res.status(203).json({
                message: "Payment doesn't exist",
            });
            return;
        }
        const invoice = yield prisma.invoice.update({
            where: { id: existingPayment.invoiceId },
            data: {
                pendingAmount: {
                    increment: existingPayment.amount,
                },
            },
        });
        yield prisma.client.update({
            where: { id: invoice.clientId },
            data: {
                outstanding: {
                    increment: existingPayment.amount,
                },
            },
        });
        yield prisma.payments.delete({
            where: { id },
        });
        res.status(200).json({
            message: "Payment deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete payment error:", error);
        res.status(400).json({
            message: "Failed to delete payment",
        });
    }
});
exports.deletePayment = deletePayment;
