import express from "express";
import { createBlog, getLatestBlogs } from "../controllers/postController.js";
import {
	validateBlogData,
	validateJWT,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/createBlog", validateJWT, validateBlogData, createBlog);
router.get("/getLatestBlogs", getLatestBlogs);

export default router;
