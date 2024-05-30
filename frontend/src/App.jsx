import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserAuth from "./pages/UserAuth";
import { UserProvider } from "./context/UserContext";
import Editor from "./pages/Editor";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import PageNotFound from "./pages/PageNotFound";
import ProfilePage from "./pages/ProfilePage";
import BlogPage from "./pages/BlogPage";
import SideNav from "./components/SideNav";
import ChangePassword from "./pages/ChangePassword";

function App() {
	return (
		<UserProvider>
			<Routes>
				<Route
					path="/editor"
					element={<Editor />}
				/>
				<Route
					path="/editor/:blog_id"
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
						path="settings"
						element={<SideNav />}
					>
						<Route
							path="edit-profile"
							element={<h1>This is edit profile page</h1>}
						/>
						<Route
							path="change-password"
							element={<ChangePassword />}
						/>
					</Route>
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
						path="user/:id"
						element={<ProfilePage />}
					/>
					<Route
						path="blog/:blog_id"
						element={<BlogPage />}
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
