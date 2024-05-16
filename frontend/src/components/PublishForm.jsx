import { useContext } from "react";
import AnimationWrapper from "./AnimationWrapper";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/Editor";
import Tag from "./Tag";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const PublishForm = () => {
	const characterLimit = 200;
	const tagLimit = 10;

	let {
		blog,
		blog: { banner, title, content, tags, description },
		setBlog,
		setEditorState,
	} = useContext(EditorContext);

	const {
		userAuth: { access_token },
	} = useContext(UserContext);

	const navigate = useNavigate();

	const handleCloseEvent = () => {
		setEditorState("editor");
	};

	const handleBlogTitleChange = (e) => {
		const input = e.target;

		setBlog({ ...blog, title: input.value });
	};

	const handleBlogDescriptionChange = (e) => {
		const input = e.target;

		setBlog({ ...blog, description: input.value });
	};

	// Prevent user from creating a new line for title
	const handleTitleKeyDown = (e) => {
		// Check for "Enter" key code
		if (e.keyCode === 13) {
			e.preventDefault();
		}
	};

	const handleTagKeyDown = (e) => {
		// Check for enter and comma keys
		// If it is, add the value as a tag
		if (e.keyCode === 13 || e.keyCode === 188) {
			e.preventDefault();

			let tag = e.target.value;

			// Check to make sure you haven't hit tag limit
			if (tags.length < tagLimit) {
				// Check if tag value is a duplicate
				if (!tags.includes(tag) && tag.length) {
					setBlog({ ...blog, tags: [...tags, tag] });
				} else {
					return toast.error("Cannot have duplicate tags");
				}
			} else {
				toast.error(`You can only have ${tagLimit} tags`);
			}

			e.target.value = "";
		}
	};

	const publishBlog = async (e) => {
		if (e.target.className.includes("disable")) {
			return;
		}

		// Validate all input fields
		if (!title.length) {
			return toast.error("Please add a blog title");
		}

		if (!description.length || description.length > characterLimit) {
			return toast.error(
				`Please add a description that's less than ${characterLimit} characters`
			);
		}

		if (!tags.length) {
			return toast.error(
				"Please add at least one tag to help us rank your blog post"
			);
		}

		// Send data to backend
		const loadingToast = toast.loading("Publishing...");

		e.target.classList.add("disable");

		const blogObj = {
			title,
			banner,
			description,
			content,
			tags,
			draft: false,
		};

		try {
			await axios.post(
				`${import.meta.env.VITE_SERVER_DOMAIN}/post/createBlog`,
				blogObj,
				{
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				}
			);

			e.target.classList.remove("disable");

			toast.dismiss(loadingToast);
			toast.success("Published successfully!");

			// TODO: Send user to dashboard (still need to create)
			setTimeout(() => {
				navigate("/");
			}, 500);
		} catch ({ response }) {
			e.target.classList.remove("disable");

			toast.dismiss(loadingToast);
			return toast.error(response.data.error);
		}
	};

	return (
		<AnimationWrapper>
			<section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
				<Toaster />

				<button
					className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
					onClick={handleCloseEvent}
				>
					<i className="fi fi-br-cross"></i>
				</button>

				<div className="max-w-[550px] center">
					<p className="text-dark-grey mb-1">Preview</p>

					<div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
						<img
							src={banner}
							alt="banner image"
						/>
					</div>

					<h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
						{title}
					</h1>

					<p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
						{description}
					</p>
				</div>

				<div className="border-grey lg:border-1 lg:pl-8">
					<p className="text-dark-grey mb-2 mt-9">Blog Title</p>
					<input
						type="text"
						placeholder="Blog Title"
						defaultValue={title}
						className="input-box pl-4"
						onChange={handleBlogTitleChange}
					/>

					<p className="text-dark-grey mb-2 mt-9">
						Short description about your blog
					</p>
					<textarea
						maxLength={characterLimit}
						defaultValue={description}
						className="h-40 resize-none leading-7 input-box pl-4"
						onChange={handleBlogDescriptionChange}
						onKeyDown={handleTitleKeyDown}
					></textarea>

					<p className="mt-1 text-dark-grey text-sm text-right">
						{characterLimit - description.length} characters left
					</p>

					<p className="text-dark-grey mb-2 mt-9">Topics</p>
					<div className="relative input-box pl-2 py-2 pb-4">
						<input
							type="text"
							placeholder="Topics"
							className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
							onKeyDown={handleTagKeyDown}
						/>

						{tags.map((tag, i) => (
							<Tag
								key={i}
								tagIndex={i}
								tag={tag}
							/>
						))}
					</div>

					<p className="mt-1 mb-4 text-dark-grey text-sm text-right">
						{tagLimit - tags.length} tags left
					</p>

					<button
						className="btn-dark px-8"
						onClick={publishBlog}
					>
						Publish
					</button>
				</div>
			</section>
		</AnimationWrapper>
	);
};
export default PublishForm;
