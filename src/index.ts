import express from "express";
import cors from "cors";
import adminRouter from "./router/admin";
import clientRouter from "./router/client";
import dotenv from "dotenv";
import multer from "multer";
import { createAdmin } from "./controller/admin";
import expensesRouter from "./router/expenses";
import settingsRouter from "./router/settings";
import { initializeSettings } from "./controller/settings";
import quotationRouter from "./router/quotation";
import invoiceRouter from "./router/invoice";
import itemRouter from "./router/item";

// Global BigInt serialization fix
(BigInt.prototype as any).toJSON = function() {
    return this.toString();
};



const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage });


createAdmin();
initializeSettings();

// Test routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});



// Routes
app.use("/v1/admin", adminRouter);

app.use("/v1/client", clientRouter);

app.use("/v1/expenses", expensesRouter);

app.use('/v1/settings', settingsRouter);

app.use("/v1/quotation", quotationRouter);

app.use("/v1/invoice", invoiceRouter);

app.use("/v1/item", itemRouter);




app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
