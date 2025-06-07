import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Hashes a plain text password
 * @param {string} password - The plain text password
 * @returns {Promise<string>} - The hashed password
 */
export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plain text password with a hashed password
 * @param {string} plainTextPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
export const comparePassword = async (plainTextPassword, hashedPassword) => {
  return bcrypt.compare(plainTextPassword, hashedPassword);
};
