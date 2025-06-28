import express from "express";
import { createClient, updateClient, deleteClient, getAllClients } from "../controller/client";
const clientRouter = express.Router();

clientRouter.post("/create", createClient);
clientRouter.patch("/update/:id", updateClient);
clientRouter.delete("/delete/:id", deleteClient);
clientRouter.get("/all", getAllClients);

export default clientRouter;