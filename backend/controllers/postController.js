import User from "../models/user.js";
import Blog from "../models/blog.js";
import Notification from "../models/notification.js";
import { generateBlogId } from "../utils/postHelpers.js";

export const createBlog = async (req, res) => {
	// req.user was set to user.id in validateJWT
	const authorId = req.user;

	let {
		title,
		banner,
		content,
		description,
		tags,
		draft = undefined,
		id,
	} = req.body;

	// Convert tags to lowercase
	tags = tags.map((tag) => tag.toLowerCase());

	// Replace any special characters with whitespace
	// Replace any whitespace with dashes
	// Trim whitespace and add nanoId
	const blog_id = id || generateBlogId(title);

	if (id) {
		try {
			await Blog.findOneAndUpdate(
				{ blog_id },
				{
					title,
					description,
					banner,
					content,
					tags,
					draft: draft ? draft : false,
				}
			);

			return res.status(200).json({ id: blog_id });
		} catch (error) {
			return res.status(500).json({ error: error.message });
		}
	} else {
		const blog = new Blog({
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
			const incrementVal = draft ? 0 : 1;

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
	}
};

export const getLatestBlogs = async (req, res) => {
	const { page } = req.body;

	const maxLimit = 5;

	try {
		const blogs = await Blog.find({ draft: false })
			.populate(
				"author",
				"personal_info.fullname personal_info.username personal_info.profile_img -_id"
			)
			.sort({ publishedAt: -1 })
			.select("blog_id title description banner activity tags publishedAt -_id")
			.skip((page - 1) * maxLimit)
			.limit(maxLimit);

		return res.status(200).json({ blogs });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const getAllLatestBlogsCount = async (req, res) => {
	try {
		const count = await Blog.countDocuments({ draft: false });
		return res.status(200).json({ totalDocs: count });
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ error: error.message });
	}
};

export const getTrendingBlogs = async (req, res) => {
	try {
		const blogs = await Blog.find({ draft: false })
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
			.limit(5);

		return res.status(200).json({ blogs });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const searchBlogs = async (req, res) => {
	// Filter according to tag
	const { tag, query, author, page, limit, eliminate_blog } = req.body;

	// Check if tags array contains the tag provided from req.body
	let findQuery;

	if (tag) {
		findQuery = { tags: tag, draft: false, blog_id: { $ne: eliminate_blog } };
	} else if (query) {
		findQuery = { draft: false, title: new RegExp(query, "i") };
	} else if (author) {
		findQuery = { author, draft: false };
	}

	const maxLimit = limit ? limit : 2;

	try {
		const blogs = await Blog.find(findQuery)
			.populate(
				"author",
				"personal_info.fullname personal_info.username personal_info.profile_img -_id"
			)
			.sort({ publishedAt: -1 })
			.select("blog_id title description banner activity tags publishedAt -_id")
			.skip((page - 1) * maxLimit)
			.limit(maxLimit);

		return res.status(200).json({ blogs });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const searchBlogsCount = async (req, res) => {
	const { tag, query, author } = req.body;

	let findQuery;

	if (tag) {
		findQuery = { tags: tag, draft: false };
	} else if (query) {
		findQuery = { draft: false, title: new RegExp(query, "i") };
	} else if (author) {
		findQuery = { author, draft: false };
	}

	try {
		const count = await Blog.countDocuments(findQuery);

		return res.status(200).json({ totalDocs: count });
	} catch (error) {
		return res.status(500).json({ error: err.message });
	}
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

export const getProfile = async (req, res) => {
	// Retreive username to get data from MongoDB
	const { username } = req.body;

	try {
		const user = await User.findOne({
			"personal_info.username": username,
		}).select("-personal_info.password -google_auth -updatedAt -blogs");

		return res.status(200).json(user);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};

export const getBlogs = async (req, res) => {
	const { blog_id, draft, mode } = req.body;

	const incrementVal = mode !== "edit" ? 1 : 0;

	try {
		const blog = await Blog.findOneAndUpdate(
			{ blog_id },
			{ $inc: { "activity.total_reads": incrementVal } }
		)
			.populate(
				"author",
				"personal_info.fullname personal_info.username personal_info.profile_img"
			)
			.select(
				"title description content banner activity publishedAt blog_id tags"
			);

		await User.findOneAndUpdate(
			{ "personal_info.username": blog.author.personal_info.username },
			{ $inc: { "account_info.total_reads": incrementVal } }
		);

		if (blog.draft && !draft) {
			return res.status(500).json({ error: "You cannot access draft blogs" });
		}

		return res.status(200).json({ blog });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const likeBlog = async (req, res) => {
	// Get user ID from validateJWT
	const user_id = req.user;

	const { _id, isLikedByUser } = req.body;

	if (!_id || typeof isLikedByUser !== "boolean") {
		return res.status(400).json({ error: "Invalid request data" });
	}

	const incrementVal = !isLikedByUser ? 1 : -1;

	try {
		// Find blog and update the like count
		const blog = await Blog.findOneAndUpdate(
			{ _id },
			{ $inc: { "activity.total_likes": incrementVal } },
			{ new: true }
		);

		if (!blog) {
			return res.status(404).json({ error: "Blog not found" });
		}

		// If blog was liked, create a new notification
		if (!isLikedByUser) {
			const like = new Notification({
				type: "like",
				blog: _id,
				notification_for: blog.author,
				user: user_id,
			});

			await like.save();

			return res.status(200).json({ liked_by_user: true });
		} else {
			const result = await Notification.findOneAndDelete({
				user: user_id,
				blog: _id,
				type: "like",
			});

			if (!result) {
				return res.status(500).json({ error: "Failed to unlike the blog" });
			}

			// Return response for unliking the blog
			return res.status(200).json({ liked_by_user: false });
		}
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const isLikedByUser = async (req, res) => {
	const user_id = req.user;

	const { _id } = req.body;

	try {
		const result = await Notification.exists({
			user: user_id,
			type: "like",
			blog: _id,
		});

		return res.status(200).json({ result });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
