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
exports.deletePurchaseApi = exports.updatePurchase = exports.getAllPurchases = exports.createPurchase = exports.getAllItems = exports.deleteItem = exports.updateItem = exports.createItem = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemName, category, supplerName, sellingPrice, measurement, tax, description, } = req.body;
    if (!itemName ||
        !category ||
        !supplerName ||
        !sellingPrice ||
        !measurement ||
        !tax) {
        res.status(400).json({
            message: "All required fields must be provided",
        });
        return;
    }
    try {
        const isItemExists = yield prisma.item.findFirst({
            where: { itemName },
        });
        if (isItemExists) {
            res.status(202).json({
                message: "Item already exists",
            });
            return;
        }
        // Create item record
        yield prisma.item.create({
            data: {
                itemName,
                category,
                supplerName,
                sellingPrice: parseFloat(sellingPrice),
                measurement: measurement,
                tax,
                description: description || "",
            },
        });
        res.status(200).json({
            message: "Item created successfully",
        });
    }
    catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.createItem = createItem;
const updateItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { itemName, category, supplerName, sellingPrice, measurement, tax, description, } = req.body;
    if (!itemName ||
        !category ||
        !supplerName ||
        !sellingPrice ||
        !measurement ||
        !tax) {
        res.status(400).json({
            message: "All required fields must be provided",
        });
        return;
    }
    if (!id) {
        res.status(400).json({
            message: "Item ID is required",
        });
        return;
    }
    try {
        yield prisma.item.update({
            where: { id },
            data: {
                itemName,
                category: category,
                supplerName,
                sellingPrice: parseFloat(sellingPrice),
                measurement: measurement,
                tax,
                description: description || "",
            },
        });
        res.status(200).json({
            message: "Item updated successfully",
        });
    }
    catch (error) {
        console.error("Update item error:", error);
        res.status(500).json({
            message: "Failed to update item",
        });
    }
});
exports.updateItem = updateItem;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({
            message: "Item ID is required",
        });
        return;
    }
    try {
        // Check if item exists
        const existingItem = yield prisma.item.findUnique({
            where: { id },
        });
        if (!existingItem) {
            res.status(404).json({
                message: "Item not found",
            });
            return;
        }
        // Delete the item
        yield prisma.item.delete({
            where: { id },
        });
        res.status(200).json({
            message: "Item deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete item error:", error);
        res.status(500).json({
            message: "Failed to delete item",
        });
    }
});
exports.deleteItem = deleteItem;
const getAllItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield prisma.item.findMany({
            include: {},
            orderBy: {
                itemName: "asc",
            },
        });
        res.status(200).json({
            message: "Items retrieved successfully",
            data: items,
        });
    }
    catch (error) {
        console.error("Get items error:", error);
        res.status(500).json({
            message: "Failed to retrieve items",
        });
    }
});
exports.getAllItems = getAllItems;
const createPurchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemName, date, purchasePrice, quantity, amount, paymentType, transactionId, } = req.body;
    if (!itemName ||
        !date ||
        !purchasePrice ||
        !quantity ||
        !amount ||
        !paymentType ||
        !transactionId) {
        res.status(400).json({
            message: "All required fields must be provided",
        });
        return;
    }
    try {
        yield prisma.purchase.create({
            data: {
                itemId: itemName,
                date: new Date(date),
                purchasePrice: parseFloat(purchasePrice),
                quantity: parseFloat(quantity),
                amount: parseFloat(amount),
                paymentType: paymentType,
                transactionId: transactionId,
            },
        });
        yield prisma.item.update({
            where: { id: itemName },
            data: {
                quantity: {
                    increment: parseFloat(quantity),
                },
            },
        });
        res.status(200).json({
            message: "Purchase created successfully",
        });
    }
    catch (error) {
        console.error("Create purchase error:", error);
        res.status(500).json({
            message: "Failed to create purchase",
        });
        return;
    }
});
exports.createPurchase = createPurchase;
const getAllPurchases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchases = yield prisma.purchase.findMany({
            include: {
                item: {
                    select: {
                        id: true,
                        itemName: true,
                    },
                },
            },
        });
        res.status(200).json({
            message: "Purchases retrieved successfully",
            data: purchases,
        });
    }
    catch (error) {
        console.error("Get purchases error:", error);
        res.status(500).json({
            message: "Failed to retrieve purchases",
        });
    }
});
exports.getAllPurchases = getAllPurchases;
const updatePurchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { itemName, date, purchasePrice, quantity, amount, paymentType, transactionId, } = req.body;
    if (!itemName ||
        !date ||
        !purchasePrice ||
        !quantity ||
        !amount ||
        !paymentType ||
        !transactionId) {
        res.status(400).json({
            message: "All required fields must be provided",
        });
        return;
    }
    if (!id) {
        res.status(400).json({
            message: "Item ID is required",
        });
        return;
    }
    try {
        const existingPurchase = yield prisma.purchase.findUnique({
            where: { id },
        });
        if (!existingPurchase) {
            res.status(404).json({
                message: "Purchase not found",
            });
            return;
        }
        if (existingPurchase.quantity !== parseFloat(quantity)) {
            yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                yield tx.item.update({
                    where: { id: itemName },
                    data: {
                        quantity: {
                            decrement: existingPurchase.quantity,
                        },
                    },
                });
                yield tx.purchase.update({
                    where: { id },
                    data: {
                        itemId: itemName,
                        date: new Date(date),
                        purchasePrice: parseFloat(purchasePrice),
                        quantity: parseFloat(quantity),
                        amount: parseFloat(amount),
                        paymentType: paymentType,
                        transactionId: transactionId,
                    },
                });
                yield tx.item.update({
                    where: { id: itemName },
                    data: {
                        quantity: {
                            increment: parseFloat(quantity),
                        },
                    },
                });
            }));
        }
        else {
            yield prisma.purchase.update({
                where: { id },
                data: {
                    itemId: itemName,
                    date: new Date(date),
                    purchasePrice: parseFloat(purchasePrice),
                    quantity: parseFloat(quantity),
                    amount: parseFloat(amount),
                    paymentType: paymentType,
                    transactionId: transactionId,
                },
            });
        }
        res.status(200).json({
            message: "Purchase updated successfully",
        });
    }
    catch (error) {
        console.error("Create purchase error:", error);
        res.status(500).json({
            message: "Failed to update purchase",
        });
        return;
    }
});
exports.updatePurchase = updatePurchase;
const deletePurchaseApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({
            message: "Purchase ID is required",
        });
        return;
    }
    try {
        const existingPurchase = yield prisma.purchase.findUnique({
            where: { id },
        });
        if (!existingPurchase) {
            res.status(404).json({
                message: "Purchase not found",
            });
            return;
        }
        yield prisma.item.update({
            where: { id: existingPurchase.itemId },
            data: {
                quantity: {
                    decrement: existingPurchase.quantity,
                },
            },
        });
        yield prisma.purchase.delete({
            where: { id },
        });
        res.status(200).json({
            message: "Purchase deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete purchase error:", error);
        res.status(500).json({
            message: "Failed to delete purchase",
        });
    }
});
exports.deletePurchaseApi = deletePurchaseApi;
