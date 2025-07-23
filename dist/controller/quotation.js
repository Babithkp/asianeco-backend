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
exports.sendQuoteMail = exports.getAllQuotes = exports.deleteQuote = exports.updateQuote = exports.createQuote = void 0;
const client_1 = require("@prisma/client");
const quoteMail_1 = require("./mails/quoteMail");
const prisma = new client_1.PrismaClient();
const createQuote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, dueDate, amount, Client, items, quoteId } = req.body;
    if (!date || !dueDate || !Client || !amount || !quoteId || !items) {
        res.status(400).json({
            message: "All required fields must be provided",
        });
        return;
    }
    try {
        const existingQuote = yield prisma.quote.findFirst({
            where: {
                quoteId,
            },
        });
        if (existingQuote) {
            res.status(203).json({
                message: "Quote already exists",
            });
            return;
        }
        // Get next quote sequence from Settings
        const settings = yield prisma.settings.findFirst();
        if (!settings) {
            res.status(400).json({
                message: "Settings not configured",
            });
            return;
        }
        const quote = yield prisma.quote.create({
            data: {
                quoteId,
                date: new Date(date),
                dueDate: new Date(dueDate),
                amount: parseFloat(amount),
                clientId: Client.id,
            },
        });
        Promise.all(items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.quoteItem.create({
                data: {
                    quoteId: quote.id,
                    itemId: item.itemId,
                    quantity: parseFloat(item.quantity),
                    amount: parseFloat(item.amount),
                    tax: item.tax,
                },
            });
        })));
        // Update quotation sequence in settings
        yield prisma.settings.update({
            where: { id: settings.id },
            data: {
                quotationSequence: settings.quotationSequence + 1,
            },
        });
        res.status(200).json({
            message: "Quote created successfully",
        });
    }
    catch (error) {
        console.error("Create quote error:", error);
        res.status(400).json({
            message: "Failed to create quote",
        });
    }
});
exports.createQuote = createQuote;
const updateQuote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { date, dueDate, amount, Client, items } = req.body;
    try {
        const existingQuote = yield prisma.quote.findUnique({
            where: { id },
        });
        if (!existingQuote) {
            res.status(203).json({
                message: "Quote doesn't exist",
            });
            return;
        }
        const itemQuote = yield prisma.quoteItem.findMany({
            where: {
                quoteId: id,
            },
        });
        Promise.all(itemQuote.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.quoteItem.delete({
                where: { quoteId_itemId: { itemId: item.itemId, quoteId: id } },
            });
        })));
        const quote = yield prisma.quote.update({
            where: { id },
            data: {
                date: new Date(date),
                dueDate: new Date(dueDate),
                amount: parseFloat(amount),
                clientId: Client.id,
            },
        });
        Promise.all(items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.quoteItem.create({
                data: {
                    quoteId: quote.id,
                    itemId: item.itemId,
                    quantity: parseFloat(item.quantity),
                    amount: parseFloat(item.amount),
                    tax: item.tax,
                },
            });
        })));
        res.status(200).json({
            message: "Quote updated successfully",
        });
    }
    catch (error) {
        console.error("Update quote error:", error);
        res.status(400).json({
            message: "Failed to update quote",
        });
    }
});
exports.updateQuote = updateQuote;
const deleteQuote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({
            message: "Quote ID is required",
        });
        return;
    }
    try {
        // Check if quote exists
        const existingQuote = yield prisma.quote.findUnique({
            where: { id },
        });
        if (!existingQuote) {
            res.status(203).json({
                message: "Quote doesn't exist",
            });
            return;
        }
        // Delete the quote
        yield prisma.quote.delete({
            where: { id },
        });
        res.status(200).json({
            message: "Quote deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete quote error:", error);
        res.status(400).json({
            message: "Failed to delete quote",
        });
    }
});
exports.deleteQuote = deleteQuote;
const getAllQuotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quotes = yield prisma.quote.findMany({
            include: {
                QuoteItem: {
                    include: {
                        item: true,
                    },
                },
                Client: true,
            },
            orderBy: {
                date: "desc",
            },
        });
        res.status(200).json({
            message: "Quotes retrieved successfully",
            data: quotes,
        });
    }
    catch (error) {
        console.error("Get quotes error:", error);
        res.status(400).json({
            message: "Failed to retrieve quotes",
        });
    }
});
exports.getAllQuotes = getAllQuotes;
const sendQuoteMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const quotationData = JSON.parse(req.body.quotationData);
    if (!quotationData) {
        res.status(400).json({
            message: "Quotation data is required",
        });
        return;
    }
    const subject = "Quote details for - " + quotationData.quoteId;
    try {
        let attachments;
        if (req.file) {
            attachments = {
                filename: "quotation.pdf",
                content: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }
        yield (0, quoteMail_1.sendQuoteMailToClient)(email, subject, (0, quoteMail_1.QuoteMailBody)(quotationData), attachments);
        res.status(200).json({
            message: "LR Email Sent",
        });
    }
    catch (error) {
        console.error("Send quote mail error:", error);
        res.status(400).json({
            message: "Failed to send quote mail",
        });
    }
});
exports.sendQuoteMail = sendQuoteMail;
