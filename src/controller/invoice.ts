import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createInvoice = async (req: Request, res: Response) => {
    const {
        date,
        dueDate,
        customerName,
        customerAddress,
        customerGSTIN,
        contactNumber,
        email,
        discount,
        subTotal,
        status,
        total,
        clientId,
        items,
        invoiceId
    } = req.body;

    if (!date || !dueDate || !customerName || !customerAddress || !contactNumber || !email || !total || !clientId || !invoiceId) {
        res.status(400).json({
            message: "All required fields must be provided",
        });
        return;
    }

    try {
        // Get next invoice sequence from Settings
        const settings = await prisma.settings.findFirst();
        if (!settings) {
            res.status(400).json({
                message: "Settings not configured",
            });
            return;
        }


        await prisma.invoice.create({
            data: {
                invoiceId,
                date: new Date(date),
                dueDate: new Date(dueDate),
                customerName,
                customerAddress,
                customerGSTIN: customerGSTIN || 0,
                contactNumber: BigInt(contactNumber),
                email: email,
                discount: discount || 0,
                subTotal: parseFloat(subTotal) || 0,
                status: status || "pending",
                total: parseFloat(total),
                clientId: clientId || null,
                items: {
                    connect: items?.map((item: any) => ({
                        id: item.id,
                    })) || [],
                },
            },
        });

        // Update invoice sequence in settings
        await prisma.settings.update({
            where: { id: settings.id },
            data: {
                invoiceSequence: settings.invoiceSequence + BigInt(1),
            },
        });

        let updatedClient = null;
        if (clientId) {
            updatedClient = await prisma.client.update({
                where: { id: clientId },
                data: {
                    outstanding: {
                        increment: parseFloat(total)
                    }
                }
            });

            // Check if outstanding exceeds creditLimit and create notification
            if (updatedClient.outstanding > updatedClient.creditLimit) {
                await prisma.notification.create({
                    data: {
                        title: "Credit Limit Exceeded",
                        description: "",
                        message: `Outstanding (${updatedClient.outstanding}) has exceeded credit limit of (${updatedClient.creditLimit}) for client ${updatedClient.name}`
                    }
                });
            }
        }



        res.status(200).json({
            message: "Invoice created successfully"
        });
    } catch (error) {
        console.error("Create invoice error:", error);
        res.status(400).json({
            message: "Failed to create invoice",
        });
    }
};

export const updateInvoice = async (req: Request, res: Response) => {
    const {
        id,
        date,
        dueDate,
        customerName,
        customerAddress,
        customerGSTIN,
        contactNumber,
        email,
        discount,
        subTotal,
        status,
        total,
        clientId,
        items
    } = req.body;

    if (!id) {
        res.status(400).json({
            message: "Invoice ID is required",
        });
        return;
    }

    try {
        // Check if invoice exists
        const existingInvoice = await prisma.invoice.findUnique({
            where: { id },
        });

        if (!existingInvoice) {
            res.status(203).json({
                message: "Invoice doesn't exist",
            });
            return;
        }



        // Delete existing items if new items are provided
        if (items && items.length > 0) {
            await prisma.item.deleteMany({
                where: { invoiceId: id },
            });
        }
        await prisma.invoice.update({
            where: { id },
            data: {
                items: {
                    set: [],
                },
            },
        });

        await prisma.invoice.update({
            where: { id },
            data: {
                date: new Date(date),
                dueDate: new Date(dueDate),
                customerName,
                customerAddress,
                customerGSTIN: customerGSTIN || 0,
                contactNumber: BigInt(contactNumber),
                email: email,
                discount: discount || 0,
                subTotal: parseFloat(subTotal) || 0,
                status: status || "pending",
                total: parseFloat(total),
                clientId: clientId || null,
                items: {
                    connect: items?.map((item: any) => ({
                        id: item.id,
                    })) || [],
                },
            },
        });

        let existingTotal = existingInvoice.total;

        // Subtract the old invoice total from client's outstanding and update
        if (existingInvoice.clientId) {

            const client = await prisma.client.findUnique({
                where: { id: existingInvoice.clientId },
            });
            if (!client) {
                res.status(400).json({
                    message: "Client not found",
                });
                return;
            }

            const outstanding = client.outstanding + parseFloat(total) - parseFloat(existingTotal.toString());

            const updatedClient = await prisma.client.update({
                where: { id: existingInvoice.clientId },
                data: {
                    outstanding: outstanding
                }
            });

            // Check if outstanding exceeds creditLimit and create notification
            if (updatedClient.outstanding > updatedClient.creditLimit) {
                await prisma.notification.create({
                    data: {
                        title: "Credit Limit Exceeded",
                        description: "",
                        message: `Outstanding (${updatedClient.outstanding}) has exceeded credit limit of (${updatedClient.creditLimit}) for client ${updatedClient.name}`
                    }
                });
            }
        }

        res.status(200).json({
            message: "Invoice updated successfully"
        });
    } catch (error) {
        console.error("Update invoice error:", error);
        res.status(400).json({
            message: "Failed to update invoice",
        });
    }
};

export const deleteInvoice = async (req: Request, res: Response) => {
    const { id } = req.body;

    if (!id) {
        res.status(400).json({
            message: "Invoice ID is required",
        });
        return;
    }

    try {
        // Check if invoice exists
        const existingInvoice = await prisma.invoice.findUnique({
            where: { id },
        });

        if (!existingInvoice) {
            res.status(203).json({
                message: "Invoice doesn't exist",
            });
            return;
        }



        // Delete the invoice
        await prisma.invoice.delete({
            where: { id },
        });

        if (existingInvoice.clientId) {
            // Subtract the invoice total from client's outstanding
            await prisma.client.update({
                where: { id: existingInvoice.clientId },
                data: {
                    outstanding: {
                        decrement: parseFloat(existingInvoice.total.toString())
                    }
                }
            });
        }

        res.status(200).json({
            message: "Invoice deleted successfully",
        });
    } catch (error) {
        console.error("Delete invoice error:", error);
        res.status(400).json({
            message: "Failed to delete invoice",
        });
    }
};

export const getAllInvoices = async (req: Request, res: Response) => {
    try {
        const invoices = await prisma.invoice.findMany({
            include: {
                items: true,
                Client: true,
                payments: true,
            },
            orderBy: {
                date: 'desc',
            },
        });

        res.status(200).json({
            message: "Invoices retrieved successfully",
            data: invoices,
        });
    } catch (error) {
        console.error("Get invoices error:", error);
        res.status(400).json({
            message: "Failed to retrieve invoices",
        });
    }
};