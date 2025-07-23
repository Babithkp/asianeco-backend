"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const invoice_1 = require("../controller/invoice");
const invoiceRouter = express_1.default.Router();
invoiceRouter.post("/create", invoice_1.createInvoice);
invoiceRouter.patch("/update", invoice_1.updateInvoice);
invoiceRouter.post("/delete", invoice_1.deleteInvoice);
invoiceRouter.get("/all", invoice_1.getAllInvoices);
invoiceRouter.post("/getByDate", invoice_1.getInvoiceByDate);
exports.default = invoiceRouter;
