import User from "../models/user.js";
import bcrypt from "bcrypt";
import { formatDataToSend, generateUsername } from "../utils/authHelpers.js";

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

		// Compare PW provided to PW stored in MongoDB to authenticate user
		const isMatch = await bcrypt.compare(password, user.personal_info.password);
		if (!isMatch) {
			return res.status(403).json({ error: "Incorrect password" });
		} else {
			res.status(200).json(formatDataToSend(user));
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
