import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userControllers.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = Router();

// Get all users route
router.get("/", authenticateToken, getAllUsers);

// Get single user route
router.get("/:id", authenticateToken, getUser);

// Update user route
router.put("/:id", authenticateToken, updateUser);

// Delete user route
router.delete("/:id", isAdmin, authenticateToken, deleteUser);

export default router;
