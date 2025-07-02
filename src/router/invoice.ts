import express from "express";
import {
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getAllInvoices
} from "../controller/invoice";

const invoiceRouter = express.Router();

invoiceRouter.post("/create", createInvoice);
invoiceRouter.patch("/update", updateInvoice);
invoiceRouter.delete("/delete", deleteInvoice);
invoiceRouter.get("/all", getAllInvoices);

export default invoiceRouter;