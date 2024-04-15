import { useState, useEffect, createContext } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserAuth from "./pages/UserAuth";
import { lookInSession } from "./common/Session";

export const UserContext = createContext({});

function App() {
	const [userAuth, setUserAuth] = useState({});

	// Check if we have current user session
	useEffect(() => {
		let userInSession = lookInSession("user");

		userInSession
			? setUserAuth(JSON.parse(userInSession))
			: setUserAuth({ access_token: null });
	}, []);

	return (
		<UserContext.Provider value={{ userAuth, setUserAuth }}>
			<Routes>
				<Route path="/" element={<Navbar />}>
					<Route path="signin" element={<UserAuth type="sign-in" />} />
					<Route path="signup" element={<UserAuth type="sign-up" />} />
				</Route>
			</Routes>
		</UserContext.Provider>
	);
}

export default App;
