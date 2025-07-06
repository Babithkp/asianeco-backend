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
exports.getAllItems = exports.deleteItem = exports.updateItem = exports.createItem = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemName, category, supplerName, purchasePrice, sellingPrice, measurement, purchaseQty, tax, description, } = req.body;
    if (!itemName ||
        !category ||
        !supplerName ||
        !purchasePrice ||
        !sellingPrice ||
        !measurement ||
        !purchaseQty ||
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
                purchasePrice: parseFloat(purchasePrice),
                sellingPrice: parseFloat(sellingPrice),
                measurement: measurement,
                purchaseQty: parseFloat(purchaseQty || "0"),
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
    const { itemName, category, supplerName, purchasePrice, sellingPrice, measurement, purchaseQty, tax, description, } = req.body;
    if (!itemName ||
        !category ||
        !supplerName ||
        !purchasePrice ||
        !sellingPrice ||
        !measurement ||
        !purchaseQty ||
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
                purchasePrice: parseFloat(purchasePrice),
                sellingPrice: parseFloat(sellingPrice),
                measurement: measurement,
                purchaseQty: parseFloat(purchaseQty),
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
            include: {
                Quote: {
                    select: {
                        id: true
                    }
                },
                Invoice: {
                    select: {
                        id: true
                    }
                }
            },
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
