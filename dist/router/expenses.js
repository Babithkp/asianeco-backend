"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expenses_1 = require("../controller/expenses");
const expensesRouter = express_1.default.Router();
expensesRouter.post("/create", expenses_1.createExpense);
expensesRouter.patch("/update/:id", expenses_1.updateExpense);
expensesRouter.delete("/delete/:id", expenses_1.deleteExpense);
expensesRouter.get("/all", expenses_1.getAllExpenses);
exports.default = expensesRouter;
