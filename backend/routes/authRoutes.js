import express from "express";
import {
	signup,
	signin,
	google,
	changePassword,
} from "../controllers/authController.js";
import {
	validateJWT,
	validateSignup,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/signin", signin);
router.post("/google", google);
router.post("/changePassword", validateJWT, changePassword);

export default router;
