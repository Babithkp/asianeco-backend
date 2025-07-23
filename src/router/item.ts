import express from "express";
import {
    createItem,
    updateItem,
    deleteItem,
    getAllItems,
    createPurchase,
    getAllPurchases,
    updatePurchase,
    deletePurchaseApi,
} from "../controller/item";

const itemRouter = express.Router();

itemRouter.post("/create", createItem);
itemRouter.patch("/update/:id", updateItem);
itemRouter.delete("/delete/:id", deleteItem);
itemRouter.get("/all", getAllItems);
itemRouter.post("/purchase", createPurchase);
itemRouter.get("/purchases", getAllPurchases);
itemRouter.patch("/purchase/update/:id", updatePurchase);
itemRouter.delete("/purchase/delete/:id", deletePurchaseApi);

export default itemRouter;