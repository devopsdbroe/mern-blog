import User from "../models/user.js";
import bcrypt from "bcrypt";
import { formatDataToSend, generateUsername } from "../utils/authHelpers.js";

import { auth } from "../config/firebase.js";

export const signup = async (req, res) => {
	try {
		const { fullname, email, password } = req.body;

		// Create hashed password
		const hashedPassword = bcrypt.hashSync(password, 10);

		// Check to make sure username isn't a duplicate
		const username = await generateUsername(email);

		// Create new user via User model
		let user = new User({
			personal_info: {
				fullname,
				email,
				password: hashedPassword,
				username,
			},
		});

		// Add new user to MongoDB and send formatted data to frontend
		await user.save();
		res.status(200).json(formatDataToSend(user));
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const signin = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Validate if email exists in MongoDB
		const user = await User.findOne({ "personal_info.email": email });
		if (!user) {
			return res.status(403).json({ error: "Email not found" });
		}

		// Only check if account wasn't registered with Google
		if (!user.google_auth) {
			// Compare PW provided to PW stored in MongoDB to authenticate user
			const isMatch = await bcrypt.compare(
				password,
				user.personal_info.password
			);
			if (!isMatch) {
				return res.status(403).json({ error: "Incorrect password" });
			} else {
				res.status(200).json(formatDataToSend(user));
			}
		} else {
			return res.status(403).json({
				error:
					"Account was created using Google. Please try logging in with Google.",
			});
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const google = async (req, res) => {
	let { access_token } = req.body;

	try {
		// Confirm with Google that access token is valid
		const decodedUser = await auth.verifyIdToken(access_token);
		let { email, name, picture } = decodedUser;

		// Improve picture resolution
		picture = picture.replace("s96-c", "s384-c");

		// Check MongoDB to see if there is a matching email
		let user = await User.findOne({ "personal_info.email": email }).select(
			"personal_info.email personal_info.fullname personal_info.profile_img personal_info.username google_auth"
		);

		// If user already exists
		if (user) {
			if (!user.google_auth) {
				return res.status(403).json({
					error:
						"This account has already been registered. Please sign in using email and password.",
				});
			}
		} else {
			// Gernerate username if user doesn't exist already
			let username = await generateUsername(email);
			user = new User({
				personal_info: {
					fullname: name,
					email,
					profile_img: picture,
					username,
				},
				google_auth: true,
			});

			await user.save();
		}

		return res.status(200).json(formatDataToSend(user));
	} catch (error) {
		return res.status(500).json({
			error:
				"Failed to authenticate to Google. Please try with another Google account.",
		});
	}
};
