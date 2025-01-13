"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Allow both origins
    credentials: true, // Allow cookies, tokens, etc.
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.use("/api/v1", routes_1.default);
app.use(globalErrorHandler_1.default);
app.get("/", (req, res) => {
    res.status(200).json({
        Message: "Auth Starter Backend is Running",
    });
});
exports.default = app;
