const dns = require("node:dns");
dns.setServers(["8.8.8.8"]);
require("dotenv").config();

const dnsServers = (process.env.DNS_SERVERS || "")
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);

if (dnsServers.length) {
  dns.setServers(dnsServers);
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const { authenticate, allowRoles } = require("./middleware/auth");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
}));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "EMS backend is running." });
});

app.use("/api/auth", authRoutes);

app.get(
  "/api/admin/dashboard",
  authenticate,
  allowRoles("admin"),
  (req, res) => {
    res.json({ message: "Admin access verified." });
  }
);

app.get(
  "/api/employee/dashboard",
  authenticate,
  allowRoles("employee"),
  (req, res) => {
    res.json({ message: "Employee access verified." });
  }
);

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    throw new Error("Set MONGO_URI and JWT_SECRET in backend/.env");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected successfully.");

  app.listen(PORT, () => {
    console.log(`EMS backend running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});
