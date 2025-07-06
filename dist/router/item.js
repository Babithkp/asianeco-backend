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
exports.default = itemRouter;
