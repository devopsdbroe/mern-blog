import User from "../models/user.js";
import bcrypt from "bcrypt";
import { formatDataToSend, generateUsername } from "../utils/authHelpers.js";

export const signup = async (req, res) => {
	try {
		const { fullname, email, password } = req.body;
		const hashedPassword = bcrypt.hashSync(password, 10);
		const username = await generateUsername(email);

		let user = new User({
			personal_info: {
				fullname,
				email,
				password: hashedPassword,
				username,
			},
		});

		await user.save();
		res.status(200).json(formatDataToSend(user));
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const signin = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ "personal_info.email": email });
		if (!user) {
			return res.status(403).json({ error: "Email not found" });
		}

		const isMatch = await bcrypt.compare(password, user.personal_info.password);
		if (!isMatch) {
			return res.status(403).json({ error: "Password is incorrect" });
		} else {
			res.status(200).json(formatDataToSend(user));
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
