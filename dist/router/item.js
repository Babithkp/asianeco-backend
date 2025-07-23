"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const item_1 = require("../controller/item");
const itemRouter = express_1.default.Router();
itemRouter.post("/create", item_1.createItem);
itemRouter.patch("/update/:id", item_1.updateItem);
itemRouter.delete("/delete/:id", item_1.deleteItem);
itemRouter.get("/all", item_1.getAllItems);
itemRouter.post("/purchase", item_1.createPurchase);
itemRouter.get("/purchases", item_1.getAllPurchases);
itemRouter.patch("/purchase/update/:id", item_1.updatePurchase);
itemRouter.delete("/purchase/delete/:id", item_1.deletePurchaseApi);
exports.default = itemRouter;
