import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../components/AnimationWrapper";
import Loader from "../components/Loader";
import { UserContext } from "../context/UserContext";
import AboutUser from "../components/AboutUser";
import { filterPaginationData } from "../components/FilterPaginationData";
import InPageNavigation from "../components/InPageNavigation";
import BlogCard from "../components/BlogCard";
import NoDataMessage from "../components/NoDataMessage";
import LoadMoreDataBtn from "../components/LoadMoreDataBtn";
import PageNotFound from "./PageNotFound";

export const profileDataStructure = {
	personal_info: {
		fullname: "",
		username: "",
		profile_img: "",
		bio: "",
	},
	account_info: {
		total_posts: 0,
		total_reads: 0,
	},
	social_links: {},
	joinedAt: " ",
};

const ProfilePage = () => {
	const { id: profileId } = useParams();

	// State for storing profile data
	const [profile, setProfile] = useState(profileDataStructure);
	const [loading, setLoading] = useState(true);
	const [blogs, setBlogs] = useState(null);
	const [profileLoaded, setProfileLoaded] = useState("");

	const {
		personal_info: { fullname, username: profile_username, profile_img, bio },
		account_info: { total_posts, total_reads },
		social_links,
		joinedAt,
	} = profile;

	// Retrieve username of user currently logged in
	const {
		userAuth: { username },
	} = useContext(UserContext);

	const fetchUserProfile = async () => {
		try {
			const { data: user } = await axios.post(
				`${import.meta.env.VITE_SERVER_DOMAIN}/post/getProfile`,
				{ username: profileId }
			);

			if (user !== null) {
				setProfile(user);
			}
			setProfileLoaded(profileId);
			getBlogs({ user_id: user._id });
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	const getBlogs = async ({ page = 1, user_id }) => {
		user_id = user_id === undefined ? blogs.user_id : user_id;

		try {
			const { data } = await axios.post(
				`${import.meta.env.VITE_SERVER_DOMAIN}/post/searchBlogs`,
				{
					author: user_id,
					page,
				}
			);

			const formattedData = await filterPaginationData({
				state: blogs,
				data: data.blogs,
				page,
				countRoute: "/post/searchBlogsCount",
				data_to_send: { author: user_id },
			});

			formattedData.user_id = user_id;

			setBlogs(formattedData);
		} catch (error) {
			console.log(error);
		}
	};

	const resetState = () => {
		setProfile(profileDataStructure);
		setProfileLoaded("");
		setLoading(true);
	};

	useEffect(() => {
		if (profileId !== profileLoaded) {
			setBlogs(null);
		}

		if (blogs === null) {
			resetState();
			fetchUserProfile();
		}
	}, [profileId, blogs]);

	return (
		<AnimationWrapper>
			{loading ? (
				<Loader />
			) : profile_username.length ? (
				<section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
					<div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
						<img
							src={profile_img}
							alt="Profile image"
							className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
						/>

						<h1 className="text-2xl font-medium">@{profile_username}</h1>
						<p className="text-xl capitalize h-6">{fullname}</p>

						<p>
							{total_posts.toLocaleString()} Blogs -{" "}
							{total_reads.toLocaleString()} Reads
						</p>

						<div className="flex gap-4 mt-2">
							{profileId === username && (
								<Link
									to="/settings/edit-profile"
									className="btn-light rounded-md"
								>
									Edit Profile
								</Link>
							)}
						</div>

						<AboutUser
							className="max-md:hidden"
							bio={bio}
							social_links={social_links}
							joinedAt={joinedAt}
						/>
					</div>

					<div className="max-md:mt-12 w-full">
						<InPageNavigation
							routes={["Blogs Published", "About"]}
							defaultHidden={["About"]}
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
									fetchData={getBlogs}
								/>
							</>

							<AboutUser
								bio={bio}
								social_links={social_links}
								joinedAt={joinedAt}
							/>
						</InPageNavigation>
					</div>
				</section>
			) : (
				<PageNotFound />
			)}
		</AnimationWrapper>
	);
};

export default ProfilePage;
