"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settings_1 = require("../controller/settings");
const settingsRouter = express_1.default.Router();
settingsRouter.patch("/update", settings_1.updateSettings);
settingsRouter.get("/all", settings_1.getSettings);
settingsRouter.get("/expenseId", settings_1.getExpenseId);
settingsRouter.get("/invoiceId", settings_1.getInvoiceId);
settingsRouter.get("/quotationId", settings_1.getQuotationId);
exports.default = settingsRouter;
