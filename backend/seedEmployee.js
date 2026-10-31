require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function seedEmployee() {
  const { MONGO_URI, EMPLOYEE_NAME, EMPLOYEE_EMAIL, EMPLOYEE_PASSWORD, EMPLOYEE_ID } =
    process.env;

  if (!MONGO_URI || !EMPLOYEE_NAME || !EMPLOYEE_EMAIL || !EMPLOYEE_PASSWORD) {
    throw new Error(
      "Configure MongoDB and all required EMPLOYEE_* variables in .env"
    );
  }

  if (EMPLOYEE_PASSWORD.length < 12) {
    throw new Error("Use an employee password of at least 12 characters.");
  }

  await mongoose.connect(MONGO_URI);

  const email = EMPLOYEE_EMAIL.trim().toLowerCase();
  const existing = await User.findOne({ email });

  if (existing) {
    console.log("An account with this email already exists. No changes made.");
    return;
  }

  const password = await bcrypt.hash(EMPLOYEE_PASSWORD, 12);

  await User.create({
    name: EMPLOYEE_NAME,
    email,
    password,
    role: "employee",
    employeeId: EMPLOYEE_ID || "",
  });

  console.log("Employee account created successfully.");
}

seedEmployee()
  .catch((error) => {
    console.error("Employee setup failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
