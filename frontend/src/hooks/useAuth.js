import { useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import toast from "react-hot-toast";
import { storeInSession } from "../services/session";

const useAuth = () => {
	const { setUserAuth } = useContext(UserContext);

	const userAuthThroughServer = async (serverRoute, formData) => {
		try {
			const res = await axios.post(
				`${import.meta.env.VITE_SERVER_DOMAIN}${serverRoute}`,
				formData,
				{
					validateStatus: function (status) {
						return status >= 200 && status < 500;
					},
				}
			);

			if (res.status !== 200) {
				toast.error(res.data.error);
			} else {
				storeInSession("user", JSON.stringify(res.data));
				setUserAuth(res.data);
				toast.success("Login successful");
			}
		} catch (error) {
			console.error("Request failed:", error);
			toast.error("A network error occured");
		}
	};

	return { userAuthThroughServer };
};
export default useAuth;
