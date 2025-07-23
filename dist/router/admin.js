"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = require("../controller/admin");
const adminRouter = express_1.default.Router();
adminRouter.post("/login", admin_1.adminLogin);
adminRouter.get("/notifications", admin_1.getAllNotification);
adminRouter.patch("/notifications/:id", admin_1.updateNotificationStatus);
adminRouter.delete("/notifications/:id", admin_1.deleteNotification);
exports.default = adminRouter;
