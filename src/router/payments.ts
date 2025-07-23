import express from "express";
import { createPayment, deletePayment, getPayments, updatePayment } from "../controller/payments";

const  paymentsRouter = express.Router();

paymentsRouter.post("/create", createPayment);
paymentsRouter.patch("/update/:id", updatePayment);
paymentsRouter.delete("/delete/:id", deletePayment);
paymentsRouter.get("/", getPayments);

export default paymentsRouter;