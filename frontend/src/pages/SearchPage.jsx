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
import UserCard from "../components/UserCard";

const SearchPage = () => {
	const { query } = useParams();

	const [blogs, setBlogs] = useState(null);
	const [users, setUsers] = useState(null);

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

	const fetchUsers = async () => {
		try {
			const {
				data: { users },
			} = await axios.post(
				`${import.meta.env.VITE_SERVER_DOMAIN}/post/searchUsers`,
				{ query }
			);

			setUsers(users);
		} catch (error) {
			console.log(error);
		}
	};

	const resetState = () => {
		setBlogs(null);
		setUsers(null);
	};

	useEffect(() => {
		resetState();
		searchBlogs({ page: 1, create_new_arr: true });
		fetchUsers();
	}, [query]);

	const UserCardWrapper = () => {
		return (
			<>
				{users === null ? (
					<Loader />
				) : users.length ? (
					users.map((user, i) => (
						<AnimationWrapper
							key={i}
							transition={{ duration: 1, delay: i * 0.08 }}
						>
							<UserCard user={user} />
						</AnimationWrapper>
					))
				) : (
					<NoDataMessage message="No users found" />
				)}
			</>
		);
	};

	return (
		<section className="h-cover flex justify-center gap-10">
			<div className="w-full">
				<InPageNavigation
					routes={[`Search Results for "${query}"`, "Accounts Matched"]}
					defaultHidden={["Accounts Matched"]}
				>
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

					<UserCardWrapper />
				</InPageNavigation>
			</div>

			<div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-gray pl-8 pt-3 max-md:hidden">
				<h1 className="font-medium text-xl mb-8">
					Users Related to Search <i className="fi fi-rr-user mt-1"></i>
				</h1>

				<UserCardWrapper />
			</div>
		</section>
	);
};
export default SearchPage;
