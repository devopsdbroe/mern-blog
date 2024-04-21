import { emailRegex, passwordRegex } from "../utils/regex.js";
import jwt from "jsonwebtoken";

export const validateSignup = (req, res, next) => {
	const { fullname, email, password } = req.body;

	// Validate name and email length
	// Validate email requirements
	// Validate PW requirements
	if (
		fullname.length < 3 ||
		!email.length ||
		!emailRegex.test(email) ||
		!passwordRegex.test(password)
	) {
		return res.status(400).json({ error: "Validation error" });
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
