import { authWithGoogle } from "../services/firebase";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import googleIcon from "../assets/google.png";

const GoogleAuthButton = ({ serverRoute }) => {
	const { userAuthThroughServer } = useAuth();

	// Handler function to call
	const handleGoogleAuth = async (e) => {
		e.preventDefault();

		try {
			const user = await authWithGoogle();
			const formData = { access_token: user.accessToken };
			await userAuthThroughServer(serverRoute, formData);
		} catch (error) {
			toast.error("Error logging in with Google");
			console.error(error);
		}
	};

	return (
		<button
			className="btn-dark flex items-center justify-center gap-4 w-[90%]"
			onClick={handleGoogleAuth}
		>
			<img
				src={googleIcon}
				alt="google icon"
				className="w-5"
			/>
			continue with google
		</button>
	);
};
export default GoogleAuthButton;
