import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPayment = async (req: Request, res: Response) => {
    const { invoiceNumber,
        date,
        clientName,
        amount,
        amountInWords,
        pendingAmount,
        transactionId,
        paymentMode,
        remarks, } = req.body;
    
    if (!invoiceNumber || !date || !clientName || !amount || !paymentMode || !transactionId || !amountInWords || !pendingAmount) {
        res.status(400).json({
            message: "All required fields must be provided",
        });
        return;
    }
    
    try {
        // Create payment record
        await prisma.payments.create({
            data: {
                invoiceNumber,
                date: new Date(date),
                clientName,
                amount: parseFloat(amount),
                amountInWords,
                pendingAmount: parseFloat(pendingAmount),
                transactionId,
                paymentMode,
                remarks: remarks || "",
            },
        });

        res.status(201).json({
            message: "Payment created successfully"
        });
        
    } catch (error) {
        console.error("Error creating payment:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}