import { Link, Navigate } from "react-router-dom";
import AnimationWrapper from "../components/AnimationWrapper";
import InputBox from "../components/InputBox";
import { Toaster, toast } from "react-hot-toast";
import { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import useAuth from "../hooks/useAuth";
import GoogleAuthButton from "../components/GoogleAuthButton";

const UserAuth = ({ type }) => {
	const { userAuthThroughServer } = useAuth();
	const {
		userAuth: { access_token },
	} = useContext(UserContext);

	const handleSubmit = (e) => {
		e.preventDefault();

		const serverRoute = type === "sign-in" ? "/auth/signin" : "/auth/signup";

		const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

		// Use FormData to retrieve data from form
		const form = new FormData(formElement);
		let formData = {};

		for (let [key, value] of form.entries()) {
			formData[key] = value;
		}

		// Form validation
		const { fullname, email, password } = formData;

		if (type === "sign-up" && fullname.length < 3) {
			return toast.error("Full name must be at least 3 letters");
		}
		if (!email.length) {
			return toast.error("Please enter an email address");
		}
		if (!emailRegex.test(email)) {
			return toast.error("Please enter a valid email address");
		}
		if (type === "sign-up" && !passwordRegex.test(password)) {
			return toast.error(
				"Password should be 6-20 characters long with at least 1 capital letter and 1 number"
			);
		}

		// For sign-in, check if the password is provided
		if (type === "sign-in" && !password) {
			return toast.error("Please enter your password");
		}

		userAuthThroughServer(serverRoute, formData);
	};

	return access_token ? (
		<Navigate to="/" />
	) : (
		// Animation wrapper for fade-in effect
		// keyValue prop enables fade-in for sign-in and sign-up pages
		<AnimationWrapper keyValue={type}>
			<section className="h-cover flex items-center justify-center">
				<Toaster />
				<form id="formElement" className="w-[80%] max-w-[400px]">
					<h1 className="text-4xl font-gelasio capitalize text-center mb-24">
						{type === "sign-in" ? "Welcome back!" : "Join us today!"}
					</h1>

					{type !== "sign-in" ? (
						<InputBox
							name="fullname"
							type="text"
							placeholder="Full Name"
							icon="fi-rr-user"
						/>
					) : (
						""
					)}

					<InputBox
						name="email"
						type="email"
						placeholder="Email"
						icon="fi-rr-envelope"
					/>

					<InputBox
						name="password"
						type="password"
						placeholder="Password"
						icon="fi-rr-key"
					/>

					<button
						className="btn-dark center mt-14"
						type="submit"
						onClick={handleSubmit}
					>
						{type.replace("-", " ")}
					</button>

					<div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
						<hr className="w-1/2 border-black" />
						<p>or</p>
						<hr className="w-1/2 border-black" />
					</div>

					<GoogleAuthButton serverRoute="/auth/google" />

					{type === "sign-in" ? (
						<p className="mt-6 text-dark-grey text-xl text-center">
							Don&apos;t have an account?
							<Link
								to="/signup"
								className="underline text-black text-xl ml-1"
								onClick={() => toast.dismiss()}
							>
								Sign Up here
							</Link>
						</p>
					) : (
						<p className="mt-6 text-dark-grey text-xl text-center">
							Already a member?
							<Link
								to="/signin"
								className="underline text-black text-xl ml-1"
								onClick={() => toast.dismiss()}
							>
								Sign In here
							</Link>
						</p>
					)}
				</form>
			</section>
		</AnimationWrapper>
	);
};
export default UserAuth;
