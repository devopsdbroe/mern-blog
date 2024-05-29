/* eslint-disable react/prop-types */
import { useContext } from "react";
import { getDay } from "../utils/date";
import { UserContext } from "../context/UserContext";
import toast from "react-hot-toast";
import { useState } from "react";
import CommentField from "./CommentField";
import { BlogContext } from "../pages/BlogPage";
import axios from "axios";

const CommentCard = ({ index, leftVal, commentData }) => {
	const [isReplying, setIsReplying] = useState(false);

	const getParentIndex = () => {
		let startingPoint = index - 1;

		try {
			while (
				commentsArr[startingPoint].childrenLevel >= commentData.childrenLevel
			) {
				startingPoint--;
			}
		} catch (error) {
			startingPoint = undefined;
		}

		return startingPoint;
	};

	const {
		commented_by: {
			personal_info: { profile_img, fullname, username: commented_by_username },
		},
		commentedAt,
		comment,
		_id,
		children,
	} = commentData;

	const {
		blog,
		blog: {
			comments,
			activity,
			activity: { total_parent_comments },
			comments: { results: commentsArr },
			author: {
				personal_info: { username: blog_author },
			},
		},
		setBlog,
		setTotalParentCommentsLoaded,
	} = useContext(BlogContext);

	const {
		userAuth: { access_token, username },
	} = useContext(UserContext);

	const removeCommentCards = (startingPoint, isDelete = false) => {
		if (commentsArr[startingPoint]) {
			while (
				commentsArr[startingPoint].childrenLevel > commentData.childrenLevel
			) {
				commentsArr.splice(startingPoint, 1);

				if (!commentsArr[startingPoint]) {
					break;
				}
			}
		}

		if (isDelete) {
			const parentIndex = getParentIndex();

			if (parentIndex !== undefined) {
				commentsArr[parentIndex].children = commentsArr[
					parentIndex
				].children.filter((child) => child !== _id);

				if (!commentsArr[parentIndex].children.length) {
					commentsArr[parentIndex].isReplyLoaded = false;
				}
			}

			commentsArr.splice(index, 1);
		}

		// Deleting parent comment
		if (commentData.childrenLevel === 0 && isDelete) {
			setTotalParentCommentsLoaded((preVal) => preVal - 1);
		}

		setBlog({
			...blog,
			comments: { results: commentsArr },
			activity: {
				...activity,
				total_parent_comments:
					total_parent_comments -
					(commentData.childrenLevel === 0 && isDelete ? 1 : 0),
			},
		});
	};

	const loadReplies = async ({ skip = 0 }) => {
		if (children.length) {
			hideReplies();

			try {
				const {
					data: { replies },
				} = await axios.post(
					`${import.meta.env.VITE_SERVER_DOMAIN}/post/getReplies`,
					{
						_id,
						skip,
					}
				);

				commentData.isReplyLoaded = true;

				for (let i = 0; i < replies.length; i++) {
					replies[i].childrenLevel = commentData.childrenLevel + 1;

					commentsArr.splice(index + 1 + i + skip, 0, replies[i]);
				}

				setBlog({ ...blog, comments: { ...comments, results: commentsArr } });
			} catch (error) {
				console.log(error);
			}
		}
	};

	const deleteComment = async (e) => {
		e.target.setAttribute("disabled", true);

		try {
			// Make request to backend to delete comment
			await axios.post(
				`${import.meta.env.VITE_SERVER_DOMAIN}/post/deleteComment`,
				{
					_id,
				},
				{
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				}
			);

			e.target.removeAttribute("disable");
			removeCommentCards(index + 1, true);
		} catch (error) {
			console.log("Error deleting this comment");
		}
	};

	const hideReplies = () => {
		commentData.isReplyLoaded = false;

		removeCommentCards(index + 1);
	};

	const handleReplyClick = () => {
		// Validate that user is signed in
		if (!access_token) {
			return toast.error("Please login to reply");
		}

		setIsReplying((preVal) => !preVal);
	};

	return (
		<div
			className="w-full"
			style={{ paddingLeft: `${leftVal * 10}px` }}
		>
			<div className="my-5 p-6 rounded-md border border-grey">
				<div className="flex gap-3 items-center mb-8">
					<img
						src={profile_img}
						alt="profile image"
						className="w-6 h-6 rounded-full"
					/>
					<p className="line-clamp-1">
						{fullname} @{commented_by_username}
					</p>
					<p className="m-w-fit">{getDay(commentedAt)}</p>
				</div>

				<p className="font-gelasio text-xl ml-3">{comment}</p>

				<div className="flex gap-5 items-center mt-5">
					{commentData.isReplyLoaded ? (
						<button
							className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
							onClick={hideReplies}
						>
							<i className="fi fi-rs-comment-dots"></i>Hide Replies
						</button>
					) : (
						<button
							className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
							onClick={loadReplies}
						>
							<i className="fi fi-rs-comment-dots"></i>
							{children.length > 1
								? `${children.length} Replies`
								: `${children.length} Reply`}
						</button>
					)}

					<button
						className="underline"
						onClick={handleReplyClick}
					>
						Reply
					</button>

					{(username === commented_by_username || username === blog_author) && (
						<button
							className="p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center"
							onClick={deleteComment}
						>
							<i className="fi fi-rr-trash pointer-events-none"></i>
						</button>
					)}
				</div>

				{isReplying && (
					<div className="mt-8">
						<CommentField
							action="reply"
							index={index}
							replyingTo={_id}
							setReplying={setIsReplying}
						/>
					</div>
				)}
			</div>
		</div>
	);
};
export default CommentCard;
