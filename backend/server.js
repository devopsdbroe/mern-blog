import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

// Schema imports
import User from "./Schema/User.js";

const server = express();

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

// Enable JSON sharing
server.use(express.json());

server.listen(3000, () => {
	console.log("Listening on port 3000");
});

// Data to be received by the frontend
const formatDataToSend = (user) => {
	// Hash the user id from MongoDB, using JWT
	const access_token = jwt.sign({ id: user._id }, process.env.JWT_KEY);

	return {
		access_token,
		profile_img: user.personal_info.profile_img,
		username: user.personal_info.username,
		fullname: user.personal_info.fullname,
	};
};

// Function to deal with duplicate usernames
const generatedUsername = async (email) => {
	let username = email.split("@")[0];

	// Check MongoDB to see if username already exists
	// If it does, add numbers to the end to make it unique
	let usernameExists = await User.exists({
		"personal_info.username": username,
	}).then((result) => result);

	// Take username and add 5 unique characters
	usernameExists ? (username += nanoid().substring(0, 5)) : "";

	return username;
};

server.post("/signup", (req, res) => {
	let { fullname, email, password } = req.body;

	// Validate the data from frontend
	if (fullname.length < 3) {
		return res
			.status(403)
			.json({ error: "Full name must be at least 3 letters long" });
	}

	// Check for blank email field
	if (!email.length) {
		return res.status(403).json({ error: "Please enter an email" });
	}

	// Check to make sure email fits "example@domain.com" format
	if (!emailRegex.test(email)) {
		return res.status(403).json({ error: "Invalid email" });
	}

	// Check to make sure password fits length and character requirements
	if (!passwordRegex.test(password)) {
		return res.status(403).json({
			error:
				"Password should be 6-20 characters long with a number, at least 1 lowercase letter, and at least 1 uppercase letter",
		});
	}

	// Create hashed password
	bcrypt.hash(password, 10, async (err, hashed_pasword) => {
		let username = await generatedUsername(email);

		// Create new user using User.js schema
		let user = new User({
			personal_info: {
				fullname,
				email,
				password: hashed_pasword,
				username,
			},
		});

		// Add new user to MongoDB (temporarily returning data to frontend)
		user
			.save()
			.then((u) => {
				return res.status(200).json(formatDataToSend(u));
			})
			.catch((err) => {
				// Return more readable error for duplicate email address
				if (err.code === 11000) {
					return res.status(500).json({ error: "Email already exists" });
				}

				return res.status(500).json({ error: err.message });
			});
	});
});

server.post("/signin", (req, res) => {
	let { email, password } = req.body;

	// Validate that email already exists in MongoDB
	User.findOne({ "personal_info.email": email })
		.then((user) => {
			if (!user) {
				return res.status(403).json({ error: "Email not found" });
			}

			bcrypt.compare(password, user.personal_info.password, (err, result) => {
				if (err) {
					return res
						.status(403)
						.json({ error: "Error occured during login. Please try again." });
				}

				// Validate password
				if (!result) {
					return res.status(403).json({ error: "Incorrect password" });
				} else {
					return res.status(200).json(formatDataToSend(user));
				}
			});
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({ error: err.message });
		});
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
	autoIndex: true,
});
