import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
const app: Application = express();

const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Allow both origins
  credentials: true, // Allow cookies, tokens, etc.
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
};

app.use(cors(corsOptions));


app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    Message: "Auth Starter Backend is Running",
  });
});

export default app;
