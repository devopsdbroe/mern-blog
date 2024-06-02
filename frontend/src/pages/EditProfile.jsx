import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { profileDataStructure } from "./ProfilePage";
import AnimationWrapper from "../components/AnimationWrapper";
import Loader from "../components/Loader";
import { Toaster, toast } from "react-hot-toast";
import InputBox from "../components/InputBox";
import { uploadImage } from "../services/aws";
import { storeInSession } from "../services/session";

const EditProfile = () => {
	const bioLimit = 150;

	const [profile, setProfile] = useState(profileDataStructure);
	const [loading, setLoading] = useState(true);
	const [charactersLeft, setCharactersLeft] = useState(bioLimit);
	const [updatedProfileImg, setUpdatedProfileImg] = useState(null);

	const profileImgRef = useRef();
	const editFormRef = useRef();

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
		setUserAuth,
	} = useContext(UserContext);

	const handleCharacterChange = (e) => {
		setCharactersLeft(bioLimit - e.target.value.length);
	};

	const handleImagePreview = (e) => {
		const img = e.target.files[0];

		profileImgRef.current.src = URL.createObjectURL(img);

		setUpdatedProfileImg(img);
	};

	const handleImageUpload = async (e) => {
		e.preventDefault();

		// Validate that profile picture has been update
		if (updatedProfileImg) {
			const loadingToast = toast.loading("Uploading...");
			e.target.setAttribute("disabled", true);

			try {
				const url = await uploadImage(updatedProfileImg);

				// Check that a URL was returned
				if (url) {
					const { data } = await axios.post(
						`${import.meta.env.VITE_SERVER_DOMAIN}/post/updateProfileImg`,
						{
							url,
						},
						{
							headers: {
								Authorization: `Bearer ${access_token}`,
							},
						}
					);

					// Set new profile image
					const newUserAuth = { ...userAuth, profile_img: data.profile_img };
					storeInSession("user", JSON.stringify(newUserAuth));
					setUserAuth(newUserAuth);

					setUpdatedProfileImg(null);

					toast.dismiss(loadingToast);
					e.target.removeAttribute("disabled");
					toast.success("Profile Image Updated");
				}
			} catch (error) {
				toast.dismiss(loadingToast);
				e.target.removeAttribute("disabled");
				toast.error(error.response.data.error);
			}
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Retreive values from all input boxes
		const form = new FormData(editFormRef.current);
		let formData = {};

		for (let [key, value] of form.entries()) {
			formData[key] = value;
		}

		const {
			username,
			bio,
			youtube,
			facebook,
			twitter,
			github,
			instagram,
			website,
		} = formData;

		// Validate username and bio
		if (username.length < 3) {
			return toast.error("Username should be at least 3 characters long");
		}

		if (bio.length > bio.limit) {
			return toast.error(`Bio should not be more than ${bioLimit} characters`);
		}

		let loadingToast = toast.loading("Updating...");

		try {
			e.target.setAttribute("disabled", true);

			const { data } = await axios.post(
				`${import.meta.env.VITE_SERVER_DOMAIN}/post/updateProfile`,
				{
					username,
					bio,
					social_links: {
						youtube,
						facebook,
						twitter,
						github,
						instagram,
						website,
					},
				},
				{
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				}
			);

			// Check that username from backend matches username stored in session
			// If it's different, update it to match value from backend
			if (userAuth.username !== data.username) {
				const newUserAuth = { ...userAuth, username: data.username };
				storeInSession("user", JSON.stringify(newUserAuth));
				setUserAuth(newUserAuth);
			}

			toast.dismiss(loadingToast);
			e.target.removeAttribute("disabled");
			toast.success("Profile Updated");
		} catch (error) {
			toast.dismiss(loadingToast);
			e.target.removeAttribute("disabled");
			toast.error(error.response.data.error);
		}
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
				<form ref={editFormRef}>
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
									ref={profileImgRef}
								/>
							</label>
							<input
								type="file"
								id="uploadImg"
								accept=".jpg, .jpeg, .png"
								hidden
								onChange={handleImagePreview}
							/>

							<button
								className="btn-light mt-5 max-lg:center lg:w-full px-10"
								onClick={handleImageUpload}
							>
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
								onClick={handleSubmit}
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
