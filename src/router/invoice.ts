import express from "express";
import {
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getAllInvoices,
    getInvoiceByDate
} from "../controller/invoice";

const invoiceRouter = express.Router();

invoiceRouter.post("/create", createInvoice);
invoiceRouter.patch("/update", updateInvoice);
invoiceRouter.post("/delete", deleteInvoice);
invoiceRouter.get("/all", getAllInvoices);
invoiceRouter.post("/getByDate", getInvoiceByDate);

export default invoiceRouter;