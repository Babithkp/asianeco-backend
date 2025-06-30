import express from "express";
import { createExpense, updateExpense, deleteExpense, getAllExpenses } from "../controller/expenses";
const expensesRouter = express.Router();

expensesRouter.post("/create", createExpense)
expensesRouter.patch("/update/:id", updateExpense);
expensesRouter.delete("/delete/:id", deleteExpense);
expensesRouter.get("/all", getAllExpenses);

export default expensesRouter;