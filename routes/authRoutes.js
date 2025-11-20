import { Router } from "express";
import { logIn, refresh, signUp } from "../controllers/authControllers.js";


const router = Router();

// Login Route
router.post("/login", logIn);

// Sign Up Route
router.post("/signup", signUp);

// Refresh Route
router.post("/refresh", refresh);


export default router;
