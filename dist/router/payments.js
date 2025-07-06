"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payments_1 = require("../controller/payments");
const paymentsRouter = express_1.default.Router();
paymentsRouter.post("/create", payments_1.createPayment);
paymentsRouter.patch("/update/:id", payments_1.updatePayment);
paymentsRouter.delete("/delete/:id", payments_1.deletePayment);
exports.default = paymentsRouter;
