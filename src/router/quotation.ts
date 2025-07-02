import express from "express";
import {
    createQuote,
    updateQuote,
    deleteQuote,
    getAllQuotes
} from "../controller/quotation";

const quotationRouter = express.Router();

quotationRouter.post("/create", createQuote);
quotationRouter.patch("/update/:id", updateQuote);
quotationRouter.delete("/delete/:id", deleteQuote);
quotationRouter.get("/all", getAllQuotes);

export default quotationRouter;