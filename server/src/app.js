import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
import userRoutes from "./routes/User.route.js";

app.use("/api/v1/user", userRoutes);

export { app };
