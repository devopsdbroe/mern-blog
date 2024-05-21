import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AnimationWrapper from "../components/AnimationWrapper";
import Loader from "../components/Loader";
import BlogInteraction from "../components/BlogInteraction";
import { getDay } from "../utils/date";

export const blogStructure = {
	title: "",
	description: "",
	content: [],
	tags: [],
	author: { personal_info: {} },
	banner: "",
	publishedAt: "",
};

export const BlogContext = createContext({});

const BlogPage = () => {
	const { blog_id } = useParams();

	const [blog, setBlog] = useState(blogStructure);
	const [loading, setLoading] = useState(true);

	const {
		title,
		content,
		banner,
		author: {
			personal_info: { fullname, username: author_username, profile_img },
		},
		publishedAt,
	} = blog;

	const fetchBlog = async () => {
		try {
			const {
				data: { blog },
			} = await axios.post(
				`${import.meta.env.VITE_SERVER_DOMAIN}/post/getBlogs`,
				{
					blog_id,
				}
			);

			setBlog(blog);
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBlog();
	}, [blog_id]);

	return (
		<AnimationWrapper>
			{loading ? (
				<Loader />
			) : (
				<BlogContext.Provider value={{ blog, setBlog }}>
					<div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
						<img
							src={banner}
							alt="Banner image"
							className="aspect-video"
						/>

						<div className="mt-12">
							<h2>{title}</h2>

							<div className="flex max-sm:flex-col justify-between my-8">
								<div className="flex gap-5 items-start">
									<img
										src={profile_img}
										alt="Profile image"
										className="w-12 h-12 rounded-full"
									/>

									<p className="capitalize">
										{fullname}
										<br />@
										<Link
											to={`/user/${author_username}`}
											className="underline"
										>
											{author_username}
										</Link>
									</p>
								</div>

								<p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
									Published on {getDay(publishedAt)}
								</p>
							</div>
						</div>

						<BlogInteraction />
					</div>
				</BlogContext.Provider>
			)}
		</AnimationWrapper>
	);
};
export default BlogPage;
