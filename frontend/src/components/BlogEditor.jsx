import { useContext } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import defaultBanner from "../assets/blog banner.png";
import AnimationWrapper from "./AnimationWrapper";
import { uploadImage } from "../services/aws";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/Editor";

const BlogEditor = () => {
	const {
		blog,
		blog: { title, banner, content, tags, description },
		setBlog,
	} = useContext(EditorContext);

	const handleBannerUpload = (e) => {
		const img = e.target.files[0];

		if (img) {
			let loadingToast = toast.loading("Uploading...");

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
		let img = e.target;

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
		let input = e.target;

		input.style.height = "auto";
		input.style.height = input.scrollHeight + "px";

		setBlog({ ...blog, title: input.value });
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
					<button className="btn-dark py-2">Publish</button>
					<button className="btn-light py-2">Save Draft</button>
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
							placeholder="Blog Title"
							className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
							onKeyDown={handleTitleKeyDown}
							onChange={handleTitleChange}
						></textarea>

						<hr className="w-full opacity-10 my-5" />
					</div>
				</section>
			</AnimationWrapper>
		</>
	);
};
export default BlogEditor;
