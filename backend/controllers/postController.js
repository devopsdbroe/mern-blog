import User from "../models/user.js";
import Blog from "../models/blog.js";
import { generateBlogId } from "../utils/postHelpers.js";
import { raw } from "express";

export const createBlog = async (req, res) => {
	// req.user was set to user.id in validateJWT
	let authorId = req.user;

	let {
		title,
		banner,
		content,
		description,
		tags,
		draft = undefined,
	} = req.body;

	// Convert tags to lowercase
	tags = tags.map((tag) => tag.toLowerCase());

	// Replace any special characters with whitespace
	// Replace any whitespace with dashes
	// Trim whitespace and add nanoId
	let blog_id = generateBlogId(title);

	let blog = new Blog({
		blog_id,
		title,
		banner,
		description,
		content,
		tags,
		author: authorId,
		draft: Boolean(draft),
	});

	try {
		// Save blog post to DB
		await blog.save();
		let incrementVal = draft ? 0 : 1;

		// Update user
		await User.findOneAndUpdate(
			{ _id: authorId },
			{
				$inc: { "account_info.total_posts": incrementVal },
				$push: { blogs: blog._id },
			}
		);
		return res.status(200).json({ blogs: blog._id });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const getLatestBlogs = (req, res) => {
	const { page } = req.body;

	const maxLimit = 5;

	Blog.find({ draft: false })
		.populate(
			"author",
			"personal_info.fullname personal_info.username personal_info.profile_img -_id"
		)
		.sort({ publishedAt: -1 })
		.select("blog_id title description banner activity tags publishedAt -_id")
		.skip((page - 1) * maxLimit)
		.limit(maxLimit)
		.then((blogs) => {
			return res.status(200).json({ blogs });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
};

export const getAllLatestBlogsCount = (req, res) => {
	Blog.countDocuments({ draft: false })
		.then((count) => {
			return res.status(200).json({ totalDocs: count });
		})
		.catch((err) => {
			console.log(err.message);
			return res.status(500).json({ error: err.message });
		});
};

export const getTrendingBlogs = (req, res) => {
	Blog.find({ draft: false })
		.populate(
			"author",
			"personal_info.fullname personal_info.username personal_info.profile_img -_id"
		)
		.sort({
			"activity.total_reads": -1,
			"activity.total_likes": -1,
			publishedAt: -1,
		})
		.select("blog_id title publishedAt -_id")
		.limit(5)
		.then((blogs) => {
			return res.status(200).json({ blogs });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
};

export const searchBlogs = (req, res) => {
	// Filter according to tag
	const { tag, query, page } = req.body;

	// Check if tags array contains the tag provided from req.body
	let findQuery;

	if (tag) {
		findQuery = { tags: tag, draft: false };
	} else if (query) {
		findQuery = { draft: false, title: new RegExp(query, "i") };
	}

	const maxLimit = 10;

	Blog.find(findQuery)
		.populate(
			"author",
			"personal_info.fullname personal_info.username personal_info.profile_img -_id"
		)
		.sort({ publishedAt: -1 })
		.select("blog_id title description banner activity tags publishedAt -_id")
		.skip((page - 1) * maxLimit)
		.limit(maxLimit)
		.then((blogs) => {
			return res.status(200).json({ blogs });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
};

export const searchBlogsCount = (req, res) => {
	const { tag, query } = req.body;

	let findQuery;

	if (tag) {
		findQuery = { tags: tag, draft: false };
	} else if (query) {
		findQuery = { draft: false, title: new RegExp(query, "i") };
	}

	Blog.countDocuments(findQuery)
		.then((count) => {
			return res.status(200).json({ totalDocs: count });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
};

export const searchUsers = async (req, res) => {
	const { query } = req.body;

	try {
		// Search for any users that contain the search query
		const users = await User.find({
			"personal_info.username": new RegExp(query, "i"),
		})
			.limit(50)
			.select(
				"personal_info.fullname personal_info.username personal_info.profile_img -_id"
			);

		return res.status(200).json({ users });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
