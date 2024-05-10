import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import InPageNavigation from "../components/InPageNavigation";
import Loader from "../components/Loader";
import AnimationWrapper from "../components/AnimationWrapper";
import BlogCard from "../components/BlogCard";
import NoDataMessage from "../components/NoDataMessage";
import LoadMoreDataBtn from "../components/LoadMoreDataBtn";
import { filterPaginationData } from "../components/FilterPaginationData";

const SearchPage = () => {
	const { query } = useParams();

	const [blogs, setBlogs] = useState(null);

	const searchBlogs = async ({ page = 1, create_new_arr = false }) => {
		try {
			const { data } = await axios.post(
				`${import.meta.env.VITE_SERVER_DOMAIN}/post/searchBlogs`,
				{ query, page }
			);

			const formattedData = await filterPaginationData({
				state: blogs,
				data: data.blogs,
				page,
				countRoute: "/post/searchBlogsCount",
				data_to_send: { query },
				create_new_arr,
			});

			setBlogs(formattedData);
		} catch (error) {
			console.log(error);
		}
	};

	const resetState = () => {
		setBlogs(null);
	};

	useEffect(() => {
		resetState();
		searchBlogs({ page: 1, create_new_arr: true });
	}, [query]);

	return (
		<section className="h-cover flex justify-center gap-10">
			<div className="w-full">
				<InPageNavigation
					routes={[`Search Results for "${query}"`, "Accounts Matched"]}
					defaultHidden={["Accounts Matched"]}
				/>

				<>
					{blogs === null ? (
						<Loader />
					) : blogs.results.length ? (
						blogs.results.map((blog, i) => (
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
					) : (
						<NoDataMessage message="No blogs found" />
					)}
					<LoadMoreDataBtn
						state={blogs}
						fetchData={searchBlogs}
					/>
				</>
			</div>
		</section>
	);
};
export default SearchPage;
