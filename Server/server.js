import dotenv from "dotenv";
import app from "./src/app.js";
import prisma from "./src/config/prisma.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// ✅ DB CONNECT FIRST
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database Connected Successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ DB Connection Failed:", err);
    process.exit(1);
  }
};

startServer();