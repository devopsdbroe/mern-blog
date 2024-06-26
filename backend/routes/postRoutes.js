import express from "express";
import {
	addComment,
	createBlog,
	deleteComment,
	getAllLatestBlogsCount,
	getBlogComments,
	getBlogs,
	getLatestBlogs,
	getProfile,
	getReplies,
	getTrendingBlogs,
	isLikedByUser,
	likeBlog,
	searchBlogs,
	searchBlogsCount,
	searchUsers,
	updateProfile,
	updateProfileImg,
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
router.post("/likeBlog", validateJWT, likeBlog);
router.post("/isLikedByUser", validateJWT, isLikedByUser);
router.post("/addComment", validateJWT, addComment);
router.post("/getBlogComments", getBlogComments);
router.post("/getReplies", getReplies);
router.post("/deleteComment", validateJWT, deleteComment);
router.post("/updateProfileImg", validateJWT, updateProfileImg);
router.post("/updateProfile", validateJWT, updateProfile);

export default router;
