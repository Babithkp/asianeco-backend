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
exports.getAllClients = exports.deleteClient = exports.updateClient = exports.createClient = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, GSTIN, contactPerson, email, contactNumber, address, city, state, pincode, creditLimit, } = req.body;
    if (!name ||
        !contactPerson ||
        !email ||
        !contactNumber ||
        !address ||
        !city ||
        !state ||
        !pincode) {
        res.status(401).json({
            message: "All required fields must be provided",
        });
        return;
    }
    try {
        // Check if client with same name already exists
        const existingClient = yield prisma.client.findFirst({
            where: {
                name: name,
            },
        });
        if (existingClient) {
            res.status(202).json({
                message: "Client name already exists",
            });
            return;
        }
        yield prisma.client.create({
            data: {
                name,
                GSTIN,
                contactPerson,
                email,
                contactNumber,
                address,
                city,
                state,
                pincode: parseInt(pincode),
                creditLimit: parseFloat(creditLimit || "0"),
            },
        });
        res.status(200).json({
            message: "Client created successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Failed to create client",
        });
    }
});
exports.createClient = createClient;
const updateClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, GSTIN, contactPerson, email, contactNumber, address, city, state, pincode, creditLimit, } = req.body;
    if (!name || !contactPerson || !email || !contactNumber || !address || !city || !state || !pincode) {
        res.status(401).json({
            message: "All required fields must be provided",
        });
        return;
    }
    if (!id) {
        res.status(401).json({
            message: "Client ID is required",
        });
        return;
    }
    try {
        // Check if client exists
        const existingClient = yield prisma.client.findUnique({
            where: {
                id,
            },
        });
        if (!existingClient) {
            res.status(203).json({
                message: "Client doesn't exist",
            });
            return;
        }
        yield prisma.client.update({
            where: {
                id: id,
            },
            data: {
                name,
                GSTIN,
                contactPerson,
                email,
                contactNumber,
                address,
                city,
                state,
                pincode: parseInt(pincode),
                creditLimit: parseFloat(creditLimit || "0"),
            },
        });
        res.status(200).json({
            message: "Client updated successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Failed to update client",
        });
    }
});
exports.updateClient = updateClient;
const deleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({
            message: "Client ID is required",
        });
        return;
    }
    try {
        // Check if client exists
        const existingClient = yield prisma.client.findUnique({
            where: {
                id: id,
            },
        });
        if (!existingClient) {
            res.status(203).json({
                message: "Client doesn't exist",
            });
            return;
        }
        yield prisma.client.delete({
            where: {
                id: id,
            },
        });
        res.status(200).json({
            message: "Client deleted successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Failed to delete client",
        });
    }
});
exports.deleteClient = deleteClient;
const getAllClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clients = yield prisma.client.findMany({
            orderBy: {
                name: "asc",
            },
        });
        res.status(200).json({
            message: "Clients retrieved successfully",
            data: clients !== null && clients !== void 0 ? clients : [],
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Failed to retrieve clients",
        });
    }
});
exports.getAllClients = getAllClients;
