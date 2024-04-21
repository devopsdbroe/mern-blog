import { nanoid } from "nanoid";

export const generateBlogId = (title) => {
	return (
		title
			.replace(/[^a-zA-Z0-9]/g, " ")
			.replace(/\s+/g, "-")
			.trim() + nanoid()
	);
};
