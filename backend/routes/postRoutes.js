import express from "express";
import {
	createBlog,
	getAllLatestBlogsCount,
	getBlogs,
	getLatestBlogs,
	getProfile,
	getTrendingBlogs,
	searchBlogs,
	searchBlogsCount,
	searchUsers,
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
router.post("/searchUsers", searchUsers);
router.post("/getProfile", getProfile);
router.post("/getBlogs", getBlogs);

export default router;
