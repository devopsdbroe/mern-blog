import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

export const formatDataToSend = (user) => {
	const accessToken = jwt.sign({ id: user._id }, process.env.JWT_KEY);

	return {
		accessToken,
		profileImg: user.personal_info.profileImg,
		username: user.personal_info.username,
		fullname: user.personal_info.fullname,
	};
};

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
