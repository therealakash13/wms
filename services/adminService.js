import { PrismaClient } from "../generated/prisma/index.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../validators/adminValidator.js";

import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const createU = async (data) => {
  try {
    const validatedData = createUserSchema.parse(data); // Zod validation

    const hashedPassword = await bcrypt.hash(validatedData.password, 10); // Password hashing

    return prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const readAllU = () => {
  try {
    return prisma.user.findMany({
      include: {
        orders: true,
        picks: true,
        items: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const readUById = (id) => {
  try {
    return prisma.user.findUnique({
      where: { id },
      include: {
        orders: true,
        picks: true,
        items: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const updateU = async (id, updateData) => {
  try {
    const validatedData = updateUserSchema.parse(updateData); // Zod validation
    const hashedPassword = await hashPassword(validatedData.password) // Password hashing

    return prisma.user.update({
      where: { id },
      data: {
        username: validatedData.username,
        email: validatedData.email,
        role: validatedData.role,
        password: hashedPassword,
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

export const loginUser = async (data) => {
  try {
    console.log(data);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await comparePassword(data.password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return user;
  } catch (error) {
    throw error;
  }
};
