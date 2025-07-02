import express from "express";
import {
    createItem,
    updateItem,
    deleteItem,
    getAllItems,
} from "../controller/item";

const itemRouter = express.Router();

itemRouter.post("/create", createItem);
itemRouter.patch("/update/:id", updateItem);
itemRouter.delete("/delete/:id", deleteItem);
itemRouter.get("/all", getAllItems);

export default itemRouter;