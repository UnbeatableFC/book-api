import { Router } from "express";
import { createNewBook, deleteBook, getAllBooks, getBook, updateBook } from "../controllers/bookControllers.js";
import { authenticateToken } from "../middlewares/auth.js";


const router = Router();

// Get all tasks route
router.get("/", authenticateToken,getAllBooks);

// Get single task route
router.get("/:id", authenticateToken,getBook);

// Create new task route
router.post("/", authenticateToken,createNewBook);

// Update task
router.put("/:id", authenticateToken,updateBook);

// Delete task
router.delete("/:id", authenticateToken,deleteBook);


export default router;
