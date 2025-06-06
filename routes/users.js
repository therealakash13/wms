import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/create", createUser);

router.get("/get", getUsers);
router.get("/get/:id", getUserById);

router.put("/update/:id", updateUser);

router.delete("/delete/:id", deleteUser);

export default router;
