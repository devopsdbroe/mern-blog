import { nanoid } from "nanoid";
import User from "../models/user.js";
import Blog from "../models/blog.js";

export const createBlog = (req, res) => {
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

	// Validate incoming data
	if (!title.length) {
		return res
			.status(403)
			.json({ error: "You must provide a title to publish the blog" });
	}

	if (!description.length || description.length > 200) {
		return res.status(403).json({
			error: "You must provide a blog description under 200 characters",
		});
	}

	if (!banner.length) {
		return res
			.status(403)
			.json({ error: "You must provide a banner image to publish" });
	}

	if (!content.blocks.length) {
		return res
			.status(403)
			.json({ error: "There must be some content to publish" });
	}

	if (!tags.length || tags.length > 10) {
		return res.status(403).json({
			error: "Please provide the appropriate amount of tags to publish",
		});
	}

	// Convert tags to lowercase
	tags = tags.map((tag) => tag.toLowerCase());

	// Replace any special characters with whitespace
	// Replace any whitespace with dashes
	// Trim whitespace and add nanoId
	let blog_id =
		title
			.replace(/[^a-zA-Z0-9]/g, " ")
			.replace(/\s+/g, "-")
			.trim() + nanoid();

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

	// Push new blog object to MongoDB
	// Also associate it with author and increment user posts by 1
	blog
		.save()
		.then((blog) => {
			let incrementVal = draft ? 0 : 1;

			User.findOneAndUpdate(
				{ _id: authorId },
				{
					$inc: { "account_info.total_posts": incrementVal },
					$push: { blogs: blog._id },
				}
			)
				.then((user) => {
					return res.status(200).json({ id: blog.blog_id });
				})
				.catch((err) => {
					return res
						.status(500)
						.json({ error: "Failed to update totals posts number" });
				});
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
};
