import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginAdmin,
  logoutAdmin,
} from "../controllers/adminController.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", createUser);
router.get("/get",authMiddleware,roleMiddleware("ADMIN"), getUsers);
router.get("/get/:id",authMiddleware,roleMiddleware("ADMIN"), getUserById);
router.put("/update/:id",authMiddleware,roleMiddleware("ADMIN"), updateUser);
router.delete("/delete/:id",authMiddleware,roleMiddleware("ADMIN"), deleteUser);

router.get("/login", loginAdmin);
router.get("/logout", logoutAdmin);
// Implement logout for admin and revisit all apis //

export default router;
