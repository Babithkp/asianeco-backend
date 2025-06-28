import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const initializeSettings = async () => {
    try {
        const isSettingsExists = await prisma.settings.findFirst();
        if (!isSettingsExists) {
            await prisma.settings.create({
                data: {
                    "address": "123 Business Street, Business City",
                    "contactNumber": 9876543210,
                    "email": "business@company.com",
                    "website": "www.company.com",
                    "GSTIN": "29ABCDE1234F1Z5",
                    "HSN": "12345678",
                    "bankName": "State Bank of India",
                    "AccountNo": 1234567890123456,
                    "IFSC": "SBIN0001234",
                    "invoiceSequence": 2000,
                    "quotationSequence": 3000,
                    "expenseSequence": 1500
                },
            });

        } else {
            console.log("Settings already exist. Use update instead.");
            return;
        }
    } catch (error) {
        console.log("Error creating settings:", error);
        return;
    }
}

export const updateSettings = async (req: Request, res: Response) => {
    const {
        address,
        contactNumber,
        email,
        website,
        GSTIN,
        HSN,
        bankName,
        AccountNo,
        IFSC,
        invoiceSequence,
        quotationSequence,
        expenseSequence
    } = req.body;



    try {
        // Get existing settings (should be only one)
        const existingSettings = await prisma.settings.findFirst();

        if (!existingSettings) {
            res.status(203).json({
                message: "Settings don't exist. Create settings first.",
            });
            return;
        }

        prisma.settings.update({
            where: {
                id: existingSettings.id,
            },
            data: {
                ...(address && { address }),
                ...(contactNumber && { contactNumber: BigInt(contactNumber) }),
                ...(email && { email }),
                ...(website !== undefined && { website }),
                ...(GSTIN && { GSTIN }),
                ...(HSN !== undefined && { HSN }),
                ...(bankName && { bankName }),
                ...(AccountNo && { AccountNo: BigInt(AccountNo) }),
                ...(IFSC && { IFSC }),
                ...(invoiceSequence && { invoiceSequence: BigInt(invoiceSequence) }),
                ...(quotationSequence && { quotationSequence: BigInt(quotationSequence) }),
                ...(expenseSequence && { expenseSequence: BigInt(expenseSequence) }),
            },
        });

        res.status(200).json({
            message: "Settings updated successfully"
        });
    } catch (error) {
        console.error("Update settings error:", error);
        res.status(400).json({
            message: "Failed to update settings",
        });
    }
};

export const getSettings = async (req: Request, res: Response) => {
    try {
        const settings = await prisma.settings.findFirst();

        if (!settings) {
            res.status(203).json({
                message: "Settings not found. Please create settings first.",
            });
            return;
        }

        res.status(200).json({
            message: "Settings retrieved successfully",
            data: settings,
        });
    } catch (error) {
        console.error("Get settings error:", error);
        res.status(400).json({
            message: "Failed to retrieve settings",
        });
    }
};


export const getExpenseId = async (req: Request, res: Response) => {
    try {
        const settings = await prisma.settings.findFirst();

        if (!settings) {
            res.status(203).json({
                message: "Settings not found. Please create settings first.",
            });
            return;
        }

        const expenseId = settings.expenseSequence.toString();

        res.status(200).json({
            message: "Expense ID retrieved successfully",
            data: expenseId,
        });
    } catch (error) {
        console.error("Get expense ID error:", error);
        res.status(400).json({
            message: "Failed to retrieve expense ID",
        });
    }
}


export const getInvoiceId = async (req: Request, res: Response) => {
    try {
        const settings = await prisma.settings.findFirst();

        if (!settings) {
            res.status(203).json({
                message: "Settings not found. Please create settings first.",
            });
            return;
        }

        const invoiceId = settings.invoiceSequence.toString();

        res.status(200).json({
            message: "Invoice ID retrieved successfully",
            data: invoiceId,
        });
    } catch (error) {
        console.error("Get invoice ID error:", error);
        res.status(400).json({
            message: "Failed to retrieve invoice ID",
        });
    }
};


export const getQuotationId = async (req: Request, res: Response) => {
    try {
        const settings = await prisma.settings.findFirst();

        if (!settings) {
            res.status(203).json({
                message: "Settings not found. Please create settings first.",
            });
            return;
        }

        const quotationId = settings.quotationSequence.toString();

        res.status(200).json({
            message: "Quotation ID retrieved successfully",
            data: quotationId,
        });
    } catch (error) {
        console.error("Get quotation ID error:", error);
        res.status(400).json({
            message: "Failed to retrieve quotation ID",
        });
    }
};