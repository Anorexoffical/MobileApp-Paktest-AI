import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth/auth.js";

const app = express();

// CORS — allow Expo Go, ngrok, and LAN origins
app.use(cors({
  origin: [
    "http://localhost:8081",
    "http://localhost:5000",
    "http://192.168.100.18:8081",
    "http://192.168.100.18:5000",
    process.env.BETTER_AUTH_URL,
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}));

// Better Auth — must come BEFORE express.json()
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "🚀 PakTest AI Backend is Running" });
});

export default app;