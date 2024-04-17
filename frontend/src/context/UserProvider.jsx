import { useState, useEffect, createContext } from "react";
import { lookInSession } from "../services/session";

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
	const [userAuth, setUserAuth] = useState({});

	useEffect(() => {
		const userInSession = lookInSession("user");
		if (userInSession) {
			setUserAuth(JSON.parse(userInSession));
		} else {
			setUserAuth({ access_token: null });
		}
	}, []);

	return (
		<UserContext.Provider value={{ userAuth, setUserAuth }}>
			{children}
		</UserContext.Provider>
	);
};
