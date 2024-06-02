import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { profileDataStructure } from "./ProfilePage";
import AnimationWrapper from "../components/AnimationWrapper";
import Loader from "../components/Loader";
import { Toaster } from "react-hot-toast";
import InputBox from "../components/InputBox";

const EditProfile = () => {
	const bioLimit = 150;

	const [profile, setProfile] = useState(profileDataStructure);
	const [loading, setLoading] = useState(true);
	const [charactersLeft, setCharactersLeft] = useState(bioLimit);

	const {
		personal_info: {
			username: profile_username,
			fullname,
			profile_img,
			email,
			bio,
		},
		social_links,
	} = profile;

	const {
		userAuth,
		userAuth: { access_token },
	} = useContext(UserContext);

	const handleCharacterChange = (e) => {
		setCharactersLeft(bioLimit - e.target.value.length);
	};

	const getProfileData = async () => {
		try {
			const { data } = await axios.post(
				`${import.meta.env.VITE_SERVER_DOMAIN}/post/getProfile`,
				{
					username: userAuth.username,
				}
			);

			setProfile(data);
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};

	// Only run UseEffect when user is logged in
	useEffect(() => {
		if (access_token) {
			getProfileData();
		}
	}, [access_token]);

	return (
		<AnimationWrapper>
			{loading ? (
				<Loader />
			) : (
				<form>
					<Toaster />

					<h1 className="max-md:hidden">Edit Profile</h1>

					<div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
						<div className="max-lg:center mb-5">
							<label
								htmlFor="uploadImg"
								id="profileImgLabel"
								className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden"
							>
								<div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer">
									Upload Image
								</div>
								<img
									src={profile_img}
									alt="profile image"
								/>
							</label>
							<input
								type="file"
								id="uploadImg"
								accept=".jpg, .jpeg, .png"
								hidden
							/>

							<button className="btn-light mt-5 max-lg:center lg:w-full px-10">
								Upload
							</button>
						</div>

						<div className="w-full">
							<div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
								<div>
									<InputBox
										name="fullname"
										type="text"
										value={fullname}
										placeholder="Full Name"
										icon="fi-rr-user"
										disable={true}
										className="capitalize"
									/>
								</div>
								<div>
									<InputBox
										name="email"
										type="email"
										value={email}
										placeholder="Email"
										icon="fi-rr-envelope"
										disable={true}
									/>
								</div>
							</div>

							<InputBox
								type="text"
								name="username"
								value={profile_username}
								placeholder="Username"
								icon="fi-rr-at"
							/>
							<p className="text-dark-grey -mt-3">
								Username will be used to search for user and will be visable to
								all users
							</p>

							<textarea
								name="bio"
								maxLength={bioLimit}
								defaultValue={bio}
								placeholder="Bio"
								onChange={handleCharacterChange}
								className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5"
							></textarea>
							<p className="mt-1 text-dark-grey">
								{charactersLeft} characters left
							</p>

							<p className="my-6 text-dark-grey">
								Add your social handles below:
							</p>
							<div className="md:grid md:grid-cols-2 gap-x-6">
								{Object.keys(social_links).map((key, i) => {
									const link = social_links[key];

									return (
										<InputBox
											key={i}
											name={key}
											type="text"
											value={link}
											placeholder="https://"
											icon={`fi ${
												key !== "website" ? `fi-brands-${key}` : "fi-rr-globe"
											}`}
										/>
									);
								})}
							</div>
							<button
								className="btn-dark w-auto px-10"
								type="submit"
							>
								Update Profile
							</button>
						</div>
					</div>
				</form>
			)}
		</AnimationWrapper>
	);
};
export default EditProfile;
