import express from "express";
import {
	createBlog,
	getAllLatestBlogsCount,
	getLatestBlogs,
	getTrendingBlogs,
	searchBlogs,
	searchBlogsCount,
} from "../controllers/postController.js";
import {
	validateBlogData,
	validateJWT,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/createBlog", validateJWT, validateBlogData, createBlog);
router.post("/getLatestBlogs", getLatestBlogs);
router.post("/getAllLatestBlogsCount", getAllLatestBlogsCount);
router.get("/getTrendingBlogs", getTrendingBlogs);
router.post("/searchBlogs", searchBlogs);
router.post("/searchBlogsCount", searchBlogsCount);

export default router;
