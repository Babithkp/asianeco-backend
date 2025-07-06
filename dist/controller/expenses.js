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
exports.getAllExpenses = exports.deleteExpense = exports.updateExpense = exports.createExpense = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { expenseId, description, date, category, amount, amountInWords, paymentType, transactionId, title, } = req.body;
    if (!description ||
        !date ||
        !category ||
        !amount ||
        !paymentType ||
        !transactionId ||
        !title ||
        !expenseId) {
        res.status(400).json({
            message: "All required fields must be provided",
        });
        return;
    }
    try {
        const existingExpense = yield prisma.expenses.findUnique({
            where: { expenseId },
        });
        if (existingExpense) {
            res.status(203).json({
                message: "Expense ID already exists",
            });
            return;
        }
        // Get next expense sequence from Settings
        const settings = yield prisma.settings.findFirst();
        if (!settings) {
            res.status(400).json({
                message: "Settings not configured",
            });
            return;
        }
        yield prisma.expenses.create({
            data: {
                expenseId,
                description,
                date: new Date(date),
                category,
                amount: parseFloat(amount || "0"),
                amountInWords: amountInWords,
                paymentType,
                transactionId: transactionId,
                title,
            },
        });
        // Update expense sequence in settings
        yield prisma.settings.update({
            where: { id: settings.id },
            data: {
                expenseSequence: settings.expenseSequence + 1,
            },
        });
        res.status(200).json({
            message: "Expense created successfully",
        });
    }
    catch (error) {
        console.error("Create expense error:", error);
        res.status(400).json({
            message: "Failed to create expense",
        });
    }
});
exports.createExpense = createExpense;
const updateExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { expenseId, description, date, category, amount, amountInWords, paymentType, transactionId, title, } = req.body;
    if (!expenseId ||
        !description ||
        !date ||
        !category ||
        !amount ||
        !paymentType ||
        !transactionId ||
        !title) {
        res.status(400).json({
            message: "All required fields must be provided",
        });
        return;
    }
    if (!id) {
        res.status(400).json({
            message: "Expense ID is required",
        });
        return;
    }
    try {
        // Check if expense exists
        const existingExpense = yield prisma.expenses.findUnique({
            where: { id, expenseId },
        });
        if (!existingExpense) {
            res.status(203).json({
                message: "Expense doesn't exist",
            });
            return;
        }
        yield prisma.expenses.update({
            where: { id },
            data: {
                description,
                date: new Date(date),
                category,
                amount: parseFloat(amount || "0"),
                amountInWords: amountInWords || "",
                paymentType,
                transactionId: transactionId,
                title,
            },
        });
        res.status(200).json({
            message: "Expense updated successfully",
        });
    }
    catch (error) {
        console.error("Update expense error:", error);
        res.status(400).json({
            message: "Failed to update expense",
        });
    }
});
exports.updateExpense = updateExpense;
const deleteExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({
            message: "Expense ID is required",
        });
        return;
    }
    try {
        // Check if expense exists
        const existingExpense = yield prisma.expenses.findUnique({
            where: { id },
        });
        if (!existingExpense) {
            res.status(203).json({
                message: "Expense doesn't exist",
            });
            return;
        }
        yield prisma.expenses.delete({
            where: { id },
        });
        res.status(200).json({
            message: "Expense deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete expense error:", error);
        res.status(400).json({
            message: "Failed to delete expense",
        });
    }
});
exports.deleteExpense = deleteExpense;
const getAllExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expenses = yield prisma.expenses.findMany({
            orderBy: {
                date: "desc",
            },
        });
        res.status(200).json({
            message: "Expenses retrieved successfully",
            data: expenses,
        });
    }
    catch (error) {
        console.error("Get expenses error:", error);
        res.status(400).json({
            message: "Failed to retrieve expenses",
        });
    }
});
exports.getAllExpenses = getAllExpenses;
