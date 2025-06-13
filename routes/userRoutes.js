import express from "express";
import {
  registerUser,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
} from "../controllers/userController.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/get/:id",authMiddleware,roleMiddleware("USER"), getUserById);
router.put("/update/:id",authMiddleware,roleMiddleware("USER"), updateUser);
router.delete("/delete/:id",authMiddleware,roleMiddleware("USER"), deleteUser);

router.post("/login", loginUser);
router.get("/logout", logoutUser);

export default router;
