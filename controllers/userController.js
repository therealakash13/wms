import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

// CREATE user
export const createUser = async (req, res) => {
  try {
    const { email, username,password } = req.body;
    const user = await prisma.user.create({
      data: { email, username, password },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message || "Failed to create user" });
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
  const { username,role,password } = req.body;
  try {
    const result = await prisma.user.update({
      where: { id },
      data: { username,role:role.toUpperCase(),password },
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
