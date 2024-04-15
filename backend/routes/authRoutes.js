import express from "express";
import { signup, signin } from "../controllers/authController.js";
import { validateSignup } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/signin", signin);

export default router;
