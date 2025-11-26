import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userControllers.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

// Get all users route
router.get("/", getAllUsers);

// Get single user route
router.get("/:id", getUser);

// Update user route
router.put("/:id", updateUser);

// Delete user route
router.delete("/:id", isAdmin, deleteUser);

export default router;
