import express from "express";
import { createPayment, deletePayment, updatePayment } from "../controller/payments";

const  paymentsRouter = express.Router();

paymentsRouter.post("/create", createPayment);
paymentsRouter.patch("/update/:id", updatePayment);
paymentsRouter.delete("/delete/:id", deletePayment);

export default paymentsRouter;