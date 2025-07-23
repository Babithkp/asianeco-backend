import express from "express";
import { adminLogin, deleteNotification, getAllNotification, updateNotificationStatus } from "../controller/admin";
const adminRouter = express.Router();

adminRouter.post("/login",adminLogin)
adminRouter.get("/notifications",getAllNotification)
adminRouter.patch("/notifications/:id",updateNotificationStatus)
adminRouter.delete("/notifications/:id",deleteNotification)

export default adminRouter;