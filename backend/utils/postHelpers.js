import Blog from "../models/blog.js";
import Comment from "../models/comment.js";
import Notification from "../models/notification.js";
import { nanoid } from "nanoid";

export const generateBlogId = (title) => {
	return (
		title
			.replace(/[^a-zA-Z0-9]/g, " ")
			.replace(/\s+/g, "-")
			.trim() + nanoid()
	);
};

export const deleteComments = async (_id) => {
	try {
		const comment = await Comment.findOneAndDelete({ _id });

		// Check if comment is a reply
		// Remove from children array
		if (comment.parent) {
			await Comment.findOneAndUpdate(
				{ _id: comment.parent },
				{ $pull: { children: _id } }
			);
			console.log("Comment deleted from parent");
		}

		await Notification.findOneAndDelete({ comment: _id });
		console.log("Comment notification has been deleted");

		await Notification.findOneAndDelete({ reply: _id });
		console.log("Replay notification has been deleted");

		await Blog.findOneAndUpdate(
			{ _id: comment.blog_id },
			{
				$pull: { comments: _id },
				$inc: {
					"activity.total_comments": -1,
					"activity.total_parent_comments": comment.parent ? 0 : -1,
				},
			}
		);

		if (comment.children.length) {
			comment.children.map((replies) => {
				deleteComments(replies);
			});
		}
	} catch (error) {
		console.log(error.message);
	}
};
