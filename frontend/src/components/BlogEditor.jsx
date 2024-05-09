import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import defaultBanner from "../assets/blog banner.png";
import AnimationWrapper from "./AnimationWrapper";
import { uploadImage } from "../services/aws";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/Editor";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./Tools";
import axios from "axios";
import { UserContext } from "../context/UserProvider";

const BlogEditor = () => {
	const {
		blog,
		blog: { title, banner, content, tags, description },
		setBlog,
		setEditorState,
		textEditor,
		setTextEditor,
	} = useContext(EditorContext);

	const {
		userAuth: { access_token },
	} = useContext(UserContext);

	const navigate = useNavigate();

	useEffect(() => {
		setTextEditor(
			new EditorJS({
				holder: "textEditor",
				data: content,
				tools: tools,
				placeholder: "Let's write an awesome story!",
			})
		);
	}, []);

	const handleBannerUpload = (e) => {
		const img = e.target.files[0];

		if (img) {
			const loadingToast = toast.loading("Uploading...");

			uploadImage(img)
				.then((url) => {
					if (url) {
						toast.dismiss(loadingToast);
						toast.success("Upload Successful");

						setBlog({ ...blog, banner: url });
					}
				})
				.catch((err) => {
					toast.dismiss(loadingToast);
					return toast.error(err);
				});
		}
	};

	const handleError = (e) => {
		const img = e.target;

		img.src = defaultBanner;
	};

	// Prevent user from creating a new line for title
	const handleTitleKeyDown = (e) => {
		// Check for "Enter" key code
		if (e.keyCode === 13) {
			e.preventDefault();
		}
	};

	const handleTitleChange = (e) => {
		// Store reference to textarea
		const input = e.target;

		input.style.height = "auto";
		input.style.height = input.scrollHeight + "px";

		setBlog({ ...blog, title: input.value });
	};

	const handlePublishEvent = () => {
		// Validate form data
		if (!banner.length) {
			return toast.error("Please upload a blog banner image");
		}

		if (!title.length) {
			return toast.error("Please add a title");
		}

		if (textEditor.isReady) {
			// Convert data from editor into an array
			textEditor
				.save()
				.then((data) => {
					// Check if there is data in array and add to blog state
					if (data.blocks.length) {
						setBlog({ ...blog, content: data });
						setEditorState("publish");
					} else {
						return toast.error("Please add content to your blog");
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	const handleSaveDraft = (e) => {
		if (e.target.className.includes("disable")) {
			return;
		}

		// Validate all input fields
		if (!title.length) {
			return toast.error("Please add a blog title");
		}

		// Send data to backend
		const loadingToast = toast.loading("Saving Draft...");

		e.target.classList.add("disable");

		if (textEditor.isReady) {
			textEditor.save().then((content) => {
				const blogObj = {
					title,
					banner,
					description,
					content,
					tags,
					draft: true,
				};

				axios
					.post(
						`${import.meta.env.VITE_SERVER_DOMAIN}/post/createBlog`,
						blogObj,
						{
							headers: {
								Authorization: `Bearer ${access_token}`,
							},
						}
					)
					.then(() => {
						e.target.classList.remove("disable");

						toast.dismiss(loadingToast);
						toast.success("Saved successfully!");

						// TODO: Send user to dashboard (still need to create)
						setTimeout(() => {
							navigate("/");
						}, 500);
					})
					.catch(({ response }) => {
						e.target.classList.remove("disable");

						toast.dismiss(loadingToast);
						return toast.error(response.data.error);
					});
			});
		}
	};

	return (
		<>
			<nav className="navbar">
				<Link to="/">
					<img src={Logo} alt="logo" className="flex-none w-10" />
				</Link>
				<p className="max-md:hidden text-black line-clamp-1 w-full">
					{title.length ? title : "New Blog"}
				</p>

				<div className="flex gap-4 ml-auto">
					<button className="btn-dark py-2" onClick={handlePublishEvent}>
						Publish
					</button>
					<button className="btn-light py-2" onClick={handleSaveDraft}>
						Save Draft
					</button>
				</div>
			</nav>
			<Toaster />
			<AnimationWrapper>
				<section>
					<div className="mx-auto max-w-[900px] w-full">
						<div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
							<label htmlFor="uploadBanner">
								<img
									src={banner}
									alt="banner image"
									className="z-20"
									onError={handleError}
								/>
								<input
									id="uploadBanner"
									type="file"
									accept=".png, .jpg, .jpeg"
									hidden
									onChange={handleBannerUpload}
								/>
							</label>
						</div>

						<textarea
							defaultValue={title}
							placeholder="Blog Title"
							className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
							onKeyDown={handleTitleKeyDown}
							onChange={handleTitleChange}
						></textarea>

						<hr className="w-full opacity-10 my-5" />

						<div id="textEditor" className="font-gelasio"></div>
					</div>
				</section>
			</AnimationWrapper>
		</>
	);
};
export default BlogEditor;
