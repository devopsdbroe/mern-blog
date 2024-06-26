import User from "../models/user.js";
import bcrypt from "bcrypt";
import { formatDataToSend, generateUsername } from "../utils/authHelpers.js";

import { auth } from "../config/firebase.js";
import { passwordRegex } from "../utils/regex.js";

export const signup = async (req, res) => {
	try {
		const { fullname, email, password } = req.body;

		// Create hashed password
		const hashedPassword = bcrypt.hashSync(password, 10);

		// Check to make sure username isn't a duplicate
		const username = await generateUsername(email);

		// Create new user via User model
		const user = new User({
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
		// Return more readable error for duplicate email address
		if (err.code === 11000) {
			return res.status(409).json({ error: "Email already exists" });
		}
		res.status(500).json({ error: err.message });
	}
};

export const signin = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Validate if email exists in MongoDB
		const user = await User.findOne({ "personal_info.email": email });

		// Check password only if user exists and isn't registed via Google
		if (user && !user.google_auth) {
			const isMatch = await bcrypt.compare(
				password,
				user.personal_info.password
			);
			if (isMatch) {
				return res.status(200).json(formatDataToSend(user));
			}
		}

		// Handle Google auth and other errors
		if (user && user.google_auth) {
			return res.status(409).json({
				error:
					'This account was created using Google. Please try logging in using "Continue with Google"',
			});
		}

		return res
			.status(401)
			.json({ error: "Authentication failed: Incorrect username or password" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const google = async (req, res) => {
	const { access_token } = req.body;

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
				return res.status(409).json({
					error:
						"This account has already been registered. Please sign in using email and password.",
				});
			}
		} else {
			// Gernerate username if user doesn't exist already
			const username = await generateUsername(email);
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

export const changePassword = async (req, res) => {
	const { currentPassword, newPassword } = req.body;

	if (
		!passwordRegex.test(currentPassword) ||
		!passwordRegex.test(newPassword)
	) {
		return res.status(403).json({
			error:
				"Password should be 6-20 characters long with at least 1 capital letter and 1 number",
		});
	}

	try {
		const user = await User.findOne({ _id: req.user });

		// Check if user has signed up using Google
		if (user.google_auth) {
			return res.status(403).json({
				error:
					"You cannot change your password because this account was created using a Google account",
			});
		}

		// Compare plaintext password that was submitted against the hashed PW from MongoDB
		const result = await bcrypt.compare(
			currentPassword,
			user.personal_info.password
		);

		if (!result) {
			return res.status(403).json({ error: "Current password is incorrect" });
		}

		// If passwords pass validation, hash the new PW and add it to MongoDB
		const hashed_password = await bcrypt.hash(newPassword, 10);

		await User.findOneAndUpdate(
			{ _id: req.user },
			{ "personal_info.password": hashed_password }
		);

		return res.status(200).json({ status: "Password changed successfully" });
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({
				error:
					"Something went wrong while changing the password. Please try again later.",
			});
	}
};
