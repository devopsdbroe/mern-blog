import axios from "axios";
import AnimationWrapper from "../components/AnimationWrapper";
import InPageNavigation from "../components/InPageNavigation";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import BlogCard from "../components/BlogCard";

const Home = () => {
	const [blogs, setBlogs] = useState(null);

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

	useEffect(() => {
		fetchLatestBlogs();
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
								blogs.map((blog, i) => {
									return (
										<AnimationWrapper
											transition={{ duration: 1, delay: i * 0.1 }}
											key={i}
										>
											<BlogCard
												content={blog}
												author={blog.author.personal_info}
											/>
										</AnimationWrapper>
									);
								})
							)}
						</>

						<h1>Trending Blogs</h1>
					</InPageNavigation>
				</div>

				{/* Filters and trending */}
				<div></div>
			</section>
		</AnimationWrapper>
	);
};
export default Home;
