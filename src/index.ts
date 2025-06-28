import express from "express";
import cors from "cors";
import adminRouter from "./router/admin";
import clientRouter from "./router/client";

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Important: This parses JSON request bodies

// Routes
app.use("/v1/admin", adminRouter);
app.use("/v1/client", clientRouter);

// Test routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/hello", (req, res) => {
    res.send("Hello World!");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
