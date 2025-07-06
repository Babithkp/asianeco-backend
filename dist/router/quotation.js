"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quotation_1 = require("../controller/quotation");
const quotationRouter = express_1.default.Router();
quotationRouter.post("/create", quotation_1.createQuote);
quotationRouter.patch("/update/:id", quotation_1.updateQuote);
quotationRouter.delete("/delete/:id", quotation_1.deleteQuote);
quotationRouter.get("/all", quotation_1.getAllQuotes);
exports.default = quotationRouter;
