import axios from "axios";
import AnimationWrapper from "../components/AnimationWrapper";
import InPageNavigation from "../components/InPageNavigation";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import BlogCard from "../components/BlogCard";
import MinimalBlogCard from "../components/MinimalBlogCard";
import { activeTabRef } from "../components/InPageNavigation";

const Home = () => {
	const [blogs, setBlogs] = useState(null);
	const [trendingBlogs, setTrendingBlogs] = useState(null);
	const [pageState, setPageState] = useState("home");

	const categories = [
		"programming",
		"patriots",
		"movies",
		"shows",
		"tech",
		"finances",
		"travel",
	];

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

	const fetchBlogsByCategory = () => {
		axios
			.post(`${import.meta.env.VITE_SERVER_DOMAIN}/post/searchBlogs`, {
				tag: pageState,
			})
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
		// Run useEffect every time category changes
		// Update hr element to match category length
		activeTabRef.current.click();

		// Only fetch latest blogs if filter is set to "home"
		if (pageState === "home") {
			fetchLatestBlogs();
		} else {
			fetchBlogsByCategory();
		}

		// Only fetch trending blogs if state is null
		if (!trendingBlogs) {
			fetchTrendingBlogs();
		}
	}, [pageState]);

	const loadBlogByCategory = (e) => {
		// Get the category name (e.g. "programming")
		const category = e.target.innerText.toLowerCase();

		setBlogs(null);

		if (pageState === category) {
			setPageState("home");
			return;
		}

		setPageState(category);
	};

	return (
		<AnimationWrapper>
			<section className="h-cover flex justify-center gap-10">
				{/* Latest blogs */}
				<div className="w-full">
					<InPageNavigation
						routes={[pageState, "trending blogs"]}
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
				<div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
					<div className="flex flex-col gap-10">
						<div>
							<h1 className="font-medium text-xl mb-8">
								Stories from all interests
							</h1>

							<div className="flex gap-3 flex-wrap">
								{categories.map((category, i) => (
									<button
										key={i}
										className={`tag ${
											pageState === category && "bg-black text-white"
										}`}
										onClick={loadBlogByCategory}
									>
										{category}
									</button>
								))}
							</div>
						</div>

						<div>
							<h1 className="font-medium text-xl mb-8">
								Trending <i className="fi fi-rr-arrow-trend-up"></i>
							</h1>

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
						</div>
					</div>
				</div>
			</section>
		</AnimationWrapper>
	);
};
export default Home;
