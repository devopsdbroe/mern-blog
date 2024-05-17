import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../components/AnimationWrapper";
import Loader from "../components/Loader";
import { UserContext } from "../context/UserContext";

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

			setProfile(user);
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	const resetState = () => {
		setProfile(profileDataStructure);
		setLoading(true);
	};

	useEffect(() => {
		resetState();
		fetchUserProfile();
	}, [profileId]);

	return (
		<AnimationWrapper>
			{loading ? (
				<Loader />
			) : (
				<section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
					<div className="flex flex-col max-md:items-center gap-5 min-w-[250px]">
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
					</div>
				</section>
			)}
		</AnimationWrapper>
	);
};

export default ProfilePage;
