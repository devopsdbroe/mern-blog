import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserAuth from "./pages/UserAuth";
import { UserProvider } from "./context/UserContext";
import Editor from "./pages/Editor";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import PageNotFound from "./pages/PageNotFound";

function App() {
	return (
		<UserProvider>
			<Routes>
				<Route
					path="/editor"
					element={<Editor />}
				/>
				<Route
					path="/"
					element={<Navbar />}
				>
					<Route
						index
						element={<Home />}
					/>
					<Route
						path="signin"
						element={<UserAuth type="sign-in" />}
					/>
					<Route
						path="signup"
						element={<UserAuth type="sign-up" />}
					/>
					<Route
						path="search/:query"
						element={<SearchPage />}
					/>
					<Route
						path="*"
						element={<PageNotFound />}
					/>
				</Route>
			</Routes>
		</UserProvider>
	);
}

export default App;
