import User from "../models/user.js";
import Blog from "../models/blog.js";
import { generateBlogId } from "../utils/postHelpers.js";

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
