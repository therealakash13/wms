require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("tiny"));
const pool = require("./config/db"); // PostgreSQL connection
pool.connect();

const PORT = process.env.PORT;

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
