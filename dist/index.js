"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const admin_1 = __importDefault(require("./router/admin"));
const client_1 = __importDefault(require("./router/client"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const expenses_1 = __importDefault(require("./router/expenses"));
const settings_1 = __importDefault(require("./router/settings"));
const quotation_1 = __importDefault(require("./router/quotation"));
const invoice_1 = __importDefault(require("./router/invoice"));
const item_1 = __importDefault(require("./router/item"));
const quotation_2 = require("./controller/quotation");
const invoice_2 = require("./controller/invoice");
const payments_1 = __importDefault(require("./router/payments"));
// Global BigInt serialization fix
BigInt.prototype.toJSON = function () {
    return this.toString();
};
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// createAdmin();
// initializeSettings();
// Test routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});
// Routes
app.use("/v1/admin", admin_1.default);
app.use("/v1/client", client_1.default);
app.use("/v1/expenses", expenses_1.default);
app.use("/v1/settings", settings_1.default);
app.use("/v1/item", item_1.default);
app.use("/v1/quotes", quotation_1.default);
app.use("/v1/invoices", invoice_1.default);
app.use("/v1/payments", payments_1.default);
app.post("/v1/quotes/sendMail/:email", upload.single("file"), quotation_2.sendQuoteMail);
app.post("/v1/invoices/sendMail/:email", upload.single("file"), invoice_2.sendInvoiceMail);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
