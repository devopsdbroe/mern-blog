import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserAuth from "./pages/UserAuth";
import { UserProvider } from "./context/UserProvider";

function App() {
	return (
		<UserProvider>
			<Routes>
				<Route
					path="/"
					element={<Navbar />}
				>
					<Route
						path="signin"
						element={<UserAuth type="sign-in" />}
					/>
					<Route
						path="signup"
						element={<UserAuth type="sign-up" />}
					/>
				</Route>
			</Routes>
		</UserProvider>
	);
}

export default App;
