import { PrismaClient } from "../generated/prisma/index.js";
import { ZodError } from "zod";
import {
  createU,
  readAllU,
  readUById,
  updateU,
  deleteU,
} from "../services/userService.js";

const prisma = new PrismaClient();

// CREATE user
export const createUser = async (req, res) => {
  try {
    const user = await createU(req.body);

    const { password, ...userWithoutPassword } = user;
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ error: "Validation failed", issues: error.errors });
    }
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "Email or username already exists." });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const allUsers = await readAllU();

    const allUsersWithoutPassword = allUsers.map(
      ({ password, ...rest }) => rest
    );
    return res.status(201).json(allUsersWithoutPassword);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await readUById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await updateU(id, req.body);

    const { password, ...userWithoutPassword } = updatedUser;
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ error: "Validation failed", issues: error.errors });
    }
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "Email or username already exists." });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await deleteU(id);
    return res.json({
      user: deletedUser,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
