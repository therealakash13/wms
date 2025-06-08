import { ZodError } from "zod";
import {
  createU,
  readAllU,
  readUById,
  updateU,
  deleteU,
  loginUser,
} from "../services/adminService.js";
import generateToken from "../utils/generateToken.js";

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
    return res.status(200).json(allUsersWithoutPassword);
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
    return res.status(200).json(userWithoutPassword);
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
    return res.status(200).json(userWithoutPassword);
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

export const loginAdmin = async (req, res) => {
  try {
    const user = await loginUser(req.body);
    const jwtToken = generateToken(user);
    return res
      .status(200)
      .cookie("token", jwtToken, {
        // httpOnly: true,
        // sameSite: "strict",
        // maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      })
      .json({
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          email: user.email,
        },
        token: jwtToken,
      });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};

export const logoutAdmin = (req, res) => {
  return res
    .clearCookie("token", {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
    })
    .status(200)
    .json({ message: "Logged out successfully" });
};
