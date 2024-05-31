import { useContext, useRef } from "react";
import AnimationWrapper from "../components/AnimationWrapper";
import InputBox from "../components/InputBox";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const ChangePassword = () => {
	const {
		userAuth: { access_token },
	} = useContext(UserContext);

	// Reference to get form values for handleSubmit funciton
	const changePasswordForm = useRef();

	const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Use FormData JS class to extract data from the HTML form
		const form = new FormData(changePasswordForm.current);
		const formData = {};

		// Populate formData with values from HTML form
		for (let [key, value] of form.entries()) {
			formData[key] = value;
		}

		const { currentPassword, newPassword } = formData;

		// Validate if either field is empty
		if (!currentPassword.length || !newPassword.length) {
			return toast.error("Please provide values for both fields");
		}

		// Validate the password fits policy
		if (
			!passwordRegex.test(currentPassword) ||
			!passwordRegex.test(newPassword)
		) {
			return toast.error(
				"Password should be 6-20 characters long with at least 1 capital letter and 1 number"
			);
		}

		// Disable "Change Password" button until submission is complete
		e.target.setAttribute("disabled", true);

		const loadingToast = toast.loading("Updating...");

		try {
			// Send data to back-end to update PW in MongoDB
			await axios.post(
				`${import.meta.env.VITE_SERVER_DOMAIN}/auth/changePassword`,

				{ currentPassword, newPassword },
				{
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				}
			);

			toast.dismiss(loadingToast);
			e.target.removeAttribute("disabled");

			return toast.success("Password updated");
		} catch (error) {
			toast.dismiss(loadingToast);
			e.target.removeAttribute("disabled");

			return toast.error(error.message);
		}
	};

	return (
		<AnimationWrapper>
			<Toaster />
			<form ref={changePasswordForm}>
				<h1 className="max-md:hidden">Change Password</h1>

				<div className="py-10 w-full md:max-w-[400px]">
					<InputBox
						name="currentPassword"
						type="password"
						className="profile-edit-input"
						placeholder="Current Password"
						icon="fi-rr-unlock"
					/>

					<InputBox
						name="newPassword"
						type="password"
						className="profile-edit-input"
						placeholder="New Password"
						icon="fi-rr-unlock"
					/>

					<button
						onClick={handleSubmit}
						className="btn-dark px-10"
						type="submit"
					>
						Change Password
					</button>
				</div>
			</form>
		</AnimationWrapper>
	);
};
export default ChangePassword;
