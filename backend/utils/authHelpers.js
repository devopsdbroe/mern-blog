import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

// Data to be received by the frontend
export const formatDataToSend = (user) => {
	// Hash the user id from MongoDB, using JWT
	const access_token = jwt.sign({ id: user._id }, process.env.JWT_KEY);

	return {
		access_token,
		profile_img: user.personal_info.profile_img,
		username: user.personal_info.username,
		fullname: user.personal_info.fullname,
	};
};

// Function to deal with dulicate usernames
export const generateUsername = async (email) => {
	let username = email.split("@")[0];

	// Check MongoDB to see if username already exists
	let usernameExists = await User.exists({
		"personal_info.username": username,
	});

	// If username already exists, add 5 unique characters
	if (usernameExists) {
		username += nanoid().substring(0, 5);
	}

	return username;
};
