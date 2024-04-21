import express from "express";
import { createBlog } from "../controllers/postController.js";
import { validateJWT } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/createBlog", validateJWT, createBlog);

export default router;
