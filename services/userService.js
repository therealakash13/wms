import { PrismaClient } from "../generated/prisma/index.js";
import {
  registerSchema,
  updateUserSchema,
} from "../validators/userValidator.js";
import { hashPassword, comparePassword } from "../utils/password.js";

const prisma = new PrismaClient();

export const registerU = async (data) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const validatedData = registerSchema.parse(data); // Zod validation
    const hashedPassword = await hashPassword(validatedData.password); // Password hashing

    return prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        password: hashedPassword,
        role: "USER",
      },
    });
  } catch (error) {
    throw error;
  }
};

export const readById = (id) => {
  try {
    return prisma.user.findUnique({
      where: { id },
      include: {
        orders: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const updateUs = async (id, updateData) => {
  try {
    const validatedData = updateUserSchema.parse(updateData); // Zod validation
    const hashedPassword = await hashPassword(validatedData.password); // Password hashing

    return prisma.user.update({
      where: { id },
      data: {
        username: validatedData.username,
        email: validatedData.email,
        password: hashedPassword,
        role: "USER",
      },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteU = (id) => {
  try {
    return prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    throw error;
  }
};

export const loginU = async (data) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await comparePassword(data.password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    return user;
  } catch (error) {
    throw error;
  }
};
