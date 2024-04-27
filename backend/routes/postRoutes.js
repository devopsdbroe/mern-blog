import express from "express";
import {
	createBlog,
	getLatestBlogs,
	getTrendingBlogs,
} from "../controllers/postController.js";
import {
	validateBlogData,
	validateJWT,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/createBlog", validateJWT, validateBlogData, createBlog);
router.get("/getLatestBlogs", getLatestBlogs);
router.get("/getTrendingBlogs", getTrendingBlogs);

export default router;
