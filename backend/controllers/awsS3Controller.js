import { generateUploadURL } from "../server.js";

export const getUploadUrl = async (req, res) => {
	try {
		const { uploadURL, contentType } = await generateUploadURL();

		return res.status(200).json({ uploadURL, contentType });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ error: error.message });
	}
};
