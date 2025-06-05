import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/users.js";
import client from "./config/db.js"; // PostgreSQL connection

dotenv.config();
const app = express();
app.use(morgan("tiny"));
app.use(express.json());

client.connect();
const PORT = process.env.PORT;

app.use("/api/users", userRoutes);

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
