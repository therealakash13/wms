import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z
    .string()
    .transform((val) => val.toUpperCase())
    .refine(
      (val) => ["USER", "ADMIN", "PICKER"].includes(val),
      "Role must be one of USER, ADMIN, or PICKER"
    )
    .optional(),
});

export const updateUserSchema = createUserSchema.partial();
