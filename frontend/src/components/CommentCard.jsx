/* eslint-disable react/prop-types */
import { useContext } from "react";
import { getDay } from "../utils/date";
import { UserContext } from "../context/UserContext";
import toast from "react-hot-toast";
import { useState } from "react";
import CommentField from "./CommentField";

const CommentCard = ({ index, leftVal, commentsData }) => {
	const [isReplying, setIsReplying] = useState(false);

	const {
		commented_by: {
			personal_info: { profile_img, fullname, username },
		},
		commentedAt,
		comment,
		_id,
	} = commentsData;

	const {
		userAuth: { access_token },
	} = useContext(UserContext);

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
						{fullname} @{username}
					</p>
					<p className="m-w-fit">{getDay(commentedAt)}</p>
				</div>

				<p className="font-gelasio text-xl ml-3">{comment}</p>

				<div className="flex gap-5 items-center mt-5">
					<button
						className="underline"
						onClick={handleReplyClick}
					>
						Reply
					</button>
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
