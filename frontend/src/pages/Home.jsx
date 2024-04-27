import axios from "axios";
import AnimationWrapper from "../components/AnimationWrapper";
import InPageNavigation from "../components/InPageNavigation";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import BlogCard from "../components/BlogCard";
import MinimalBlogCard from "../components/MinimalBlogCard";

const Home = () => {
	const [blogs, setBlogs] = useState(null);
	const [trendingBlogs, setTrendingBlogs] = useState(null);

	const fetchLatestBlogs = () => {
		axios
			.get(`${import.meta.env.VITE_SERVER_DOMAIN}/post/getLatestBlogs`)
			.then(({ data }) => {
				setBlogs(data.blogs);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const fetchTrendingBlogs = () => {
		axios
			.get(`${import.meta.env.VITE_SERVER_DOMAIN}/post/getTrendingBlogs`)
			.then(({ data }) => {
				setTrendingBlogs(data.blogs);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		fetchLatestBlogs();
		fetchTrendingBlogs();
	}, []);

	return (
		<AnimationWrapper>
			<section className="h-cover flex justify-center gap-10">
				{/* Latest blogs */}
				<div className="w-full">
					<InPageNavigation
						routes={["home", "trending blogs"]}
						defaultHidden={["trending blogs"]}
					>
						<>
							{blogs === null ? (
								<Loader />
							) : (
								blogs.map((blog, i) => (
									<AnimationWrapper
										transition={{ duration: 1, delay: i * 0.1 }}
										key={i}
									>
										<BlogCard
											content={blog}
											author={blog.author.personal_info}
										/>
									</AnimationWrapper>
								))
							)}
						</>

						{trendingBlogs === null ? (
							<Loader />
						) : (
							trendingBlogs.map((blog, i) => (
								<AnimationWrapper
									key={i}
									transition={{ duration: 1, delay: i * 0.1 }}
								>
									<MinimalBlogCard
										blog={blog}
										index={i}
									/>
								</AnimationWrapper>
							))
						)}
					</InPageNavigation>
				</div>

				{/* Filters and trending */}
				<div></div>
			</section>
		</AnimationWrapper>
	);
};
export default Home;
