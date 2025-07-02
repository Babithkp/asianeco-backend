import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createQuote = async (req: Request, res: Response) => {
    const {
        date,
        dueDate,
        customerName,
        contactNumber,
        email,
        discount,
        amount,
        clientId,
        items,
        quoteId
    } = req.body;

    if (!date || !dueDate || !customerName || !contactNumber || !email || !amount || !quoteId) {
        res.status(400).json({
            message: "All required fields must be provided",
        });
        return;
    }

    try {
        // Get next quote sequence from Settings
        const settings = await prisma.settings.findFirst();
        if (!settings) {
            res.status(400).json({
                message: "Settings not configured",
            });
            return;
        }


        await prisma.quote.create({
            data: {
                quoteId,
                date: new Date(date),
                dueDate: new Date(dueDate),
                customerName,
                contactNumber: BigInt(contactNumber),
                email,
                discount: parseFloat(discount) || 0,
                amount: parseFloat(amount),
                clientId: clientId || null,
                items: {
                    connect: items?.map((item: any) => ({
                        id: item.id,
                    })) || [],
                },
            },
        });

        // Update quotation sequence in settings
        await prisma.settings.update({
            where: { id: settings.id },
            data: {
                quotationSequence: settings.quotationSequence + BigInt(1),
            },
        });

        res.status(200).json({
            message: "Quote created successfully"
        });
    } catch (error) {
        console.error("Create quote error:", error);
        res.status(400).json({
            message: "Failed to create quote",
        });
    }
};

export const updateQuote = async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
        date,
        dueDate,
        customerName,
        contactNumber,
        email,
        discount,
        amount,
        clientId,
        items
    } = req.body;

    if (!id) {
        res.status(400).json({
            message: "Quote ID is required",
        });
        return;
    }

    try {
        // Check if quote exists
        const existingQuote = await prisma.quote.findUnique({
            where: { id },
        });

        if (!existingQuote) {
            res.status(203).json({
                message: "Quote doesn't exist",
            });
            return;
        }

        await prisma.quote.update({
            where: { id },
            data: {
                items: {
                    set: [],
                },
            },
        })

        await prisma.quote.update({
            where: { id },
            data: {
                date: new Date(date),
                dueDate: new Date(dueDate),
                customerName,
                contactNumber: BigInt(contactNumber),
                email,
                discount: parseFloat(discount) || 0,
                amount: parseFloat(amount),
                clientId: clientId || null,
                items: {
                    connect: items?.map((item: any) => ({
                        id: item.id,
                    })) || [],
                },
            },
        });

        res.status(200).json({
            message: "Quote updated successfully"
        });
    } catch (error) {
        console.error("Update quote error:", error);
        res.status(400).json({
            message: "Failed to update quote",
        });
    }
};

export const deleteQuote = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({
            message: "Quote ID is required",
        });
        return;
    }

    try {
        // Check if quote exists
        const existingQuote = await prisma.quote.findUnique({
            where: { id },
        });

        if (!existingQuote) {
            res.status(203).json({
                message: "Quote doesn't exist",
            });
            return;
        }

        // Delete the quote
        await prisma.quote.delete({
            where: { id },
        });

        res.status(200).json({
            message: "Quote deleted successfully"
        });
    } catch (error) {
        console.error("Delete quote error:", error);
        res.status(400).json({
            message: "Failed to delete quote",
        });
    }
};

export const getAllQuotes = async (req: Request, res: Response) => {
    try {
        const quotes = await prisma.quote.findMany({
            include: {
                items: true,
                Client: true,
            },
            orderBy: {
                date: 'desc',
            },
        });

        res.status(200).json({
            message: "Quotes retrieved successfully",
            data: quotes,
        });
    } catch (error) {
        console.error("Get quotes error:", error);
        res.status(400).json({
            message: "Failed to retrieve quotes",
        });
    }
};
