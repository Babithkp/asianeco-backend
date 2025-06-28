import express from "express";
import { updateSettings, getSettings, getExpenseId, getInvoiceId, getQuotationId } from "../controller/settings";

const settingsRouter = express.Router();

settingsRouter.patch("/update", updateSettings);
settingsRouter.get("/all", getSettings);
settingsRouter.get("/expense-id", getExpenseId);
settingsRouter.get("/invoice-id", getInvoiceId);
settingsRouter.get("/quotation-id", getQuotationId);


export default settingsRouter;