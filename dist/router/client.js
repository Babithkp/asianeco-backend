"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("../controller/client");
const clientRouter = express_1.default.Router();
clientRouter.post("/create", client_1.createClient);
clientRouter.patch("/update/:id", client_1.updateClient);
clientRouter.delete("/delete/:id", client_1.deleteClient);
clientRouter.get("/all", client_1.getAllClients);
exports.default = clientRouter;
