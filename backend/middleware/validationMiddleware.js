import { emailRegex, passwordRegex } from "../utils/regex.js";

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

export const errorHandler = (err, req, res, next) => {
	const status = err.statusCode || 500;
	const message = err.message || "Something went wrong";
	res.status(status).json({
		error: message,
	});
};
