require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("node:readline/promises");
const User = require("./models/User");

async function promptValue(question) {
  const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    return (await terminal.question(question)).trim();
  } finally {
    terminal.close();
  }
}

async function promptPassword() {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
    return promptValue("Admin password: ");
  }

  return new Promise((resolve, reject) => {
    const input = process.stdin;
    let password = "";

    process.stdout.write("Admin password (input hidden): ");
    input.setRawMode(true);
    input.resume();
    input.setEncoding("utf8");

    function finish(error) {
      input.off("data", onData);
      input.setRawMode(false);
      process.stdout.write("\n");
      if (error) reject(error);
      else resolve(password);
    }

    function onData(chunk) {
      for (const character of chunk) {
        if (character === "\u0003") {
          finish(new Error("Admin setup cancelled."));
          return;
        }
        if (character === "\r" || character === "\n") {
          finish();
          return;
        }
        if (character === "\u007f" || character === "\b") {
          password = Array.from(password).slice(0, -1).join("");
          continue;
        }
        if (character >= " ") password += character;
      }
    }

    input.on("data", onData);
  });
}

async function seedAdmin() {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) throw new Error("Configure MONGO_URI in backend/.env");

  const name = (process.env.ADMIN_NAME || await promptValue("Admin name: ")).trim();
  const email = (process.env.ADMIN_EMAIL || await promptValue("Admin email: ")).trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || await promptPassword();

  if (!name || !email || !password) {
    throw new Error("Admin name, email, and password are required.");
  }

  if (password.length < 12) {
    throw new Error("Use an admin password of at least 12 characters.");
  }

  await mongoose.connect(MONGO_URI);

  const existing = await User.findOne({ email });

  if (existing) {
    console.log("An account with this email already exists. No changes made.");
  } else {
    const passwordHash = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      password: passwordHash,
      role: "admin",
    });

    console.log("Admin account created successfully.");
  }

  await mongoose.disconnect();
}

seedAdmin().catch(async (error) => {
  console.error("Admin setup failed:", error.message);
  await mongoose.disconnect().catch(() => {});
  process.exitCode = 1;
});
