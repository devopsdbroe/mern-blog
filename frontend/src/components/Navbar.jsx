import { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "../images/logo.png";
import { UserContext } from "../App";
import UserNavigation from "./UserNavigation";

const Navbar = () => {
	const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
	const [showUserNavigation, setShowUserNavigation] = useState(false);

	const {
		userAuth,
		userAuth: { access_token, profile_img },
	} = useContext(UserContext);

	const handleShowUserNavigation = () => {
		setShowUserNavigation((currentVal) => !currentVal);
	};

	const handleBlurFunction = () => {
		setTimeout(() => {
			setShowUserNavigation(false);
		}, 200);
	};

	return (
		<>
			<nav className="navbar">
				{/* Logo */}
				<Link to="/" className="flex-none w-10">
					{/* TODO: Find new logo */}
					<img src={logo} alt="logo" className="w-full" />
				</Link>

				{/* Search bar */}
				<div
					className={`absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ${
						searchBoxVisibility ? "show" : "hide"
					}`}
				>
					<input
						type="text"
						placeholder="Search"
						className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
					/>

					<i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
				</div>

				{/* Icon to toggle search bar in mobile + button to create a post */}
				<div className="flex items-center gap-3 md:gap-6 ml-auto">
					<button
						className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
						onClick={() => setSearchBoxVisibility((currentVal) => !currentVal)}
					>
						<i className="fi fi-rr-search text-xl"></i>
					</button>

					<Link to="/editor" className="hidden md:flex gap-2 link">
						<i className="fi fi-rr-file-edit"></i>
						<p>Write</p>
					</Link>

					{access_token ? (
						<>
							{/* TODO: Create notification page */}
							<Link to="/dashboard/notification">
								<button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10 text-2xl block mt-1">
									<i className="fi fi-rr-bell"></i>
								</button>
							</Link>

							<div
								className="relative"
								onClick={handleShowUserNavigation}
								onBlur={handleBlurFunction}
							>
								<button className="w-12 h-12 mt-1">
									<img
										src={profile_img}
										alt="profile"
										className="w-full h-full object-cover rounded-full"
									/>
								</button>

								{showUserNavigation && <UserNavigation />}
							</div>
						</>
					) : (
						<>
							<Link className="btn-dark py-2" to="/signin">
								Sign In
							</Link>

							<Link className="btn-light py-2 hidden md:block" to="/signup">
								Sign Up
							</Link>
						</>
					)}
				</div>
			</nav>

			{/* Outlet element to show nested elements in App.jsx */}
			<Outlet />
		</>
	);
};

export default Navbar;
