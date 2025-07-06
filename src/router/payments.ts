import express from "express";
import { createPayment, updatePayment } from "../controller/payments";

const  paymentsRouter = express.Router();

paymentsRouter.post("/create", createPayment);
paymentsRouter.patch("/update/:id", updatePayment);

export default paymentsRouter;