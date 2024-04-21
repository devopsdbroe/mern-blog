import { emailRegex, passwordRegex } from "../utils/regex.js";
import jwt from "jsonwebtoken";

export const validateSignup = (req, res, next) => {
	const { fullname, email, password } = req.body;

	if (fullname.trim().length < 3) {
		return res
			.status(400)
			.json({ error: "Full name must  be at least 3 characters long" });
	}

	if (!email.trim().length || !emailRegex.test(email)) {
		return res
			.status(400)
			.json({ error: "Please enter a valid email address" });
	}

	if (!passwordRegex.test(password)) {
		return res
			.status(400)
			.json({ error: "Password does not meet requirements" });
	}

	next();
};

export const validateBlogData = (req, res, next) => {
	const { title, banner, description, content, tags, draft } = req.body;
	if (!title.trim().length) {
		return res.status(400).json({ error: "You must provide a title" });
	}
	if (!draft) {
		if (!description.trim().length || description.length > 200) {
			return res.status(400).json({
				error: "HELLO",
			});
		}
		if (!banner.trim().length) {
			return res
				.status(400)
				.json({ error: "You must provide a banner image to publish" });
		}
		if (!content.blocks.length) {
			return res
				.status(400)
				.json({ error: "There must be some content to publish" });
		}
		if (!tags.length || tags.length > 10) {
			return res.status(400).json({
				error: "Please provide the appropriate amount of tags to publish",
			});
		}
	}
	next();
};

export const validateJWT = (req, res, next) => {
	const authHeader = req.headers["authorization"];

	// If authorization exists in header, split it to get access token
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ error: "No access token" });
	}

	jwt.verify(token, process.env.JWT_KEY, (err, user) => {
		if (err) {
			return res.status(403).json({ error: "Access token is invalid" });
		}

		// If token is valid set req.user to user ID (MongoDB ID)
		req.user = user.id;
		next();
	});
};

export const errorHandler = (err, req, res, next) => {
	const status = err.statusCode || 500;
	const message = err.message || "Something went wrong";
	res.status(status).json({
		error: message,
	});
};
