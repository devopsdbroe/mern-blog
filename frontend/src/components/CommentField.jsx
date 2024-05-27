import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BlogContext } from "../pages/BlogPage";

const CommentField = ({ action }) => {
	const {
		blog,
		blog: {
			_id,
			author: { _id: blog_author },
			comments,
			activity,
			activity: { total_comments, total_parent_comments },
		},
		setBlog,
		setTotalParentCommentsLoaded,
	} = useContext(BlogContext);

	const {
		userAuth: { access_token, username, fullname, profile_image },
	} = useContext(UserContext);

	const [comment, setComment] = useState("");

	const handleComment = async () => {
		// Check if user is logged in
		if (!access_token) {
			return toast.error("Please login to leave a comment");
		}

		// Validate that there is a value provided
		if (!comment || !comment.length) {
			return toast.error("Write something to leave a comment");
		}

		try {
			// Send comment to backend
			const { data } = await axios.post(
				`${import.meta.env.VITE_SERVER_DOMAIN}/post/addComment`,
				{
					_id,
					blog_author,
					comment,
				},
				{
					headers: {
						Authorization: `bearer ${access_token}`,
					},
				}
			);

			setComment("");

			data.commented_by = {
				personal_info: { username, fullname, profile_image },
			};

			let newCommentArr;

			// childrenLevel 0 is a parent comment
			data.childrenLevel = 0;

			newCommentArr = [data];

			const parentCommentIncrementVal = 1;

			// Update the blog state after creating the comment
			setBlog({
				...blog,
				comments: { ...comments, results: newCommentArr },
				activity: {
					...activity,
					total_comments: total_comments + 1,
					total_parent_comments:
						total_parent_comments + parentCommentIncrementVal,
				},
			});

			setTotalParentCommentsLoaded(
				(preVal) => preVal + parentCommentIncrementVal
			);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Toaster />
			<textarea
				value={comment}
				onChange={(e) => setComment(e.target.value)}
				placeholder="Leave a comment..."
				className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
			></textarea>
			<button
				className="btn-dark mt-5 px-10"
				onClick={handleComment}
			>
				{action}
			</button>
		</>
	);
};
export default CommentField;
