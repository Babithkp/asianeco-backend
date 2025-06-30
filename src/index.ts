import express from "express";
import cors from "cors";
import adminRouter from "./router/admin";
import clientRouter from "./router/client";
import dotenv from "dotenv";
import multer from "multer";
import { createAdmin } from "./controller/admin";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage });


// createAdmin();
// Test routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});



// Routes
app.use("/v1/admin", adminRouter);

app.use("/v1/client", clientRouter);




app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
