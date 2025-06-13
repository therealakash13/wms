import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import client from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true               // allow cookies if needed
}));

client.connect();
const PORT = process.env.PORT;

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to WMS");
});

// Optional: Test DB Connection on Startup
// pool
//   .query("SELECT NOW()")
//   .then((res) => console.log("✅ DB Connected at:", res.rows[0].now))
//   .catch((err) => {
//     console.error("❌ DB connection failed:", err);
//     process.exit(1); // stop app if DB fails
//   });

process.on("SIGINT", async () => {
  await client.end();
  console.log("🔌 PostgreSQL client disconnected");
  process.exit();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
