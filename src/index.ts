import express from "express";import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import adminRouter from "./router/admin";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1", adminRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
