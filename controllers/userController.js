import { PrismaClient } from "../generated/prisma/index.js";
import { createUserSchema } from "../validators/usersValidator.js";
import { ZodError } from "zod";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// CREATE user
export const createUser = async (req, res) => {
  try {
    // Validate input
    const data = createUserSchema.parse(req.body);

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        role: data.role.toUpperCase() || "USER", // fallback to default
      },
    });

    const { password, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);

  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: "Validation failed", issues: error.errors });
    }
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Email or username already exists." });
    }

    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const result = await prisma.user.findMany();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await prisma.user.findUnique({ where: { id } });
    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, role, password } = req.body;
  try {
    const result = await prisma.user.update({
      where: { id },
      data: { username, role: role.toUpperCase(), password },
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await prisma.user.delete({ where: { id } });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
