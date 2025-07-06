import express from "express";
import { updateSettings, getSettings, getExpenseId, getInvoiceId, getQuotationId } from "../controller/settings";

const settingsRouter = express.Router();

settingsRouter.patch("/update", updateSettings);
settingsRouter.get("/all", getSettings);
settingsRouter.get("/expenseId", getExpenseId);
settingsRouter.get("/invoiceId", getInvoiceId);
settingsRouter.get("/quotationId", getQuotationId);


export default settingsRouter;