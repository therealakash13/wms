import { ZodError } from "zod";
import generateToken from "../utils/generateToken.js";
import {
  registerU,
  readById,
  updateUs,
  deleteU,
  loginU,
} from "../services/userService.js";

export const registerUser = async (req, res) => {
  try {
    const user = await registerU(req.body);

    const token = generateToken(user); // Token generation
    return res.status(201).json({
      user: { id: user.id, username: user.username, email: user.email },
      token,
      message: "Registration Successful.",
    });
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
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await readById(id);

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
    const updatedUser = await updateUs(id, req.body);

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

export const loginUser = async (req, res) => {
  try {
    const user = await loginU(req.body);

    const jwtToken = generateToken(user); // Returns a signed JWT

    res
      .cookie("token", jwtToken)
      .status(200)
      .json({
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          email: user.email,
        },
        token: jwtToken,
        message:"Logged In Successfully."
      });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};

export const logoutUser = (req, res) => {
  return res
    .clearCookie("token", {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
    })
    .status(200)
    .json({ message: "Logged out successfully" });
};
