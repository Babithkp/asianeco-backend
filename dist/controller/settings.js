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
exports.getQuotationId = exports.getInvoiceId = exports.getExpenseId = exports.getSettings = exports.updateSettings = exports.initializeSettings = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const initializeSettings = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSettingsExists = yield prisma.settings.findFirst();
        if (!isSettingsExists) {
            yield prisma.settings.create({
                data: {
                    address: "123 Business Street, Business City",
                    contactNumber: "9876543210",
                    alternateContactNumber: "9876543210",
                    email: "business@company.com",
                    website: "www.company.com",
                    GSTIN: "29ABCDE1234F1Z5",
                    HSN: "12345678",
                    bankName: "State Bank of India",
                    AccountNo: "1234567890123456",
                    IFSC: "SBIN0001234",
                    invoiceSequence: 2000,
                    quotationSequence: 3000,
                    expenseSequence: 1500
                },
            });
            console.log("Settings created successfully");
        }
        else {
            console.log("Settings already exist. Use update instead.");
            return;
        }
    }
    catch (error) {
        console.log("Error creating settings:", error);
        return;
    }
});
exports.initializeSettings = initializeSettings;
const updateSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, contactNumber, alternateContactNumber, email, website, GSTIN, HSN, bankName, AccountNo, IFSC, invoiceSequence, quotationSequence, expenseSequence } = req.body;
    try {
        // Get existing settings (should be only one)
        const existingSettings = yield prisma.settings.findFirst();
        if (!existingSettings) {
            res.status(203).json({
                message: "Settings don't exist. Create settings first.",
            });
            return;
        }
        yield prisma.settings.update({
            where: {
                id: existingSettings.id,
            },
            data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (address && { address })), (contactNumber && { contactNumber })), (email && { email })), (website !== undefined && { website })), (GSTIN && { GSTIN })), (HSN !== undefined && { HSN })), (bankName && { bankName })), (AccountNo && { AccountNo })), (IFSC && { IFSC })), (alternateContactNumber && { alternateContactNumber })), (invoiceSequence && { invoiceSequence: parseFloat(invoiceSequence) })), (quotationSequence && { quotationSequence: parseFloat(quotationSequence) })), (expenseSequence && { expenseSequence: parseFloat(expenseSequence) })),
        });
        res.status(200).json({
            message: "Settings updated successfully"
        });
    }
    catch (error) {
        console.error("Update settings error:", error);
        res.status(400).json({
            message: "Failed to update settings",
        });
    }
});
exports.updateSettings = updateSettings;
const getSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield prisma.settings.findFirst();
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
    }
    catch (error) {
        console.error("Get settings error:", error);
        res.status(400).json({
            message: "Failed to retrieve settings",
        });
    }
});
exports.getSettings = getSettings;
const getExpenseId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield prisma.settings.findFirst();
        if (!settings) {
            res.status(203).json({
                message: "Settings not found. Please create settings first.",
            });
            return;
        }
        const expenseId = settings.expenseSequence;
        res.status(200).json({
            message: "Expense ID retrieved successfully",
            data: expenseId,
        });
    }
    catch (error) {
        console.error("Get expense ID error:", error);
        res.status(400).json({
            message: "Failed to retrieve expense ID",
        });
    }
});
exports.getExpenseId = getExpenseId;
const getInvoiceId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield prisma.settings.findFirst();
        if (!settings) {
            res.status(203).json({
                message: "Settings not found. Please create settings first.",
            });
            return;
        }
        const invoiceId = settings.invoiceSequence;
        res.status(200).json({
            message: "Invoice ID retrieved successfully",
            data: invoiceId,
        });
    }
    catch (error) {
        console.error("Get invoice ID error:", error);
        res.status(400).json({
            message: "Failed to retrieve invoice ID",
        });
    }
});
exports.getInvoiceId = getInvoiceId;
const getQuotationId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield prisma.settings.findFirst();
        if (!settings) {
            res.status(203).json({
                message: "Settings not found. Please create settings first.",
            });
            return;
        }
        const quotationId = settings.quotationSequence;
        res.status(200).json({
            message: "Quotation ID retrieved successfully",
            data: quotationId,
        });
    }
    catch (error) {
        console.error("Get quotation ID error:", error);
        res.status(400).json({
            message: "Failed to retrieve quotation ID",
        });
    }
});
exports.getQuotationId = getQuotationId;
