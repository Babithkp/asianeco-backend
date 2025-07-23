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
exports.deleteNotification = exports.updateNotificationStatus = exports.getAllNotification = exports.adminLogin = exports.createAdmin = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isAdminExists = yield prisma.admin.findFirst();
        if (!isAdminExists) {
            yield prisma.admin.create({
                data: {
                    userName: "admin",
                    password: "admin@123",
                    purchaseValue: 0,
                },
            });
        }
        else {
            console.log("Admin already exists");
            return;
        }
    }
    catch (error) {
        console.log(error);
        return;
    }
});
exports.createAdmin = createAdmin;
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({
            message: "Username and password are required",
        });
        return;
    }
    try {
        const user = yield prisma.admin.findUnique({
            where: {
                userName: username,
                password: password,
            },
        });
        if (user) {
            res.status(200).json({
                message: "Login Successful",
                user,
            });
        }
        else {
            res.status(203).json({
                message: "Invalid Credentials",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.adminLogin = adminLogin;
const getAllNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield prisma.notification.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            message: "Notifications retrieved successfully",
            data: notifications,
        });
    }
    catch (error) {
        console.error("Get notifications error:", error);
        res.status(400).json({
            message: "Failed to retrieve notifications",
        });
    }
});
exports.getAllNotification = getAllNotification;
const updateNotificationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({
            message: "Notification ID is required",
        });
        return;
    }
    try {
        const existingNotification = yield prisma.notification.findUnique({
            where: {
                id,
            },
        });
        if (!existingNotification) {
            res.status(203).json({
                message: "Notification doesn't exist",
            });
            return;
        }
        yield prisma.notification.update({
            where: {
                id,
            },
            data: {
                status: "read",
            },
        });
        res.status(200).json({
            message: "Notification status updated successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Failed to update notification status",
        });
    }
});
exports.updateNotificationStatus = updateNotificationStatus;
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({
            message: "Notification ID is required",
        });
        return;
    }
    try {
        const existingNotification = yield prisma.notification.findUnique({
            where: {
                id,
            },
        });
        if (!existingNotification) {
            res.status(203).json({
                message: "Notification doesn't exist",
            });
            return;
        }
        yield prisma.notification.delete({
            where: {
                id,
            },
        });
        res.status(200).json({
            message: "Notification deleted successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Failed to delete notification",
        });
    }
});
exports.deleteNotification = deleteNotification;
