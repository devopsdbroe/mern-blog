import { generateUploadURL } from "../server.js";

export const getUploadUrl = async (req, res) => {
	try {
		const url = await generateUploadURL();

		return res.status(200).json({ uploadURL: url });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ error: error.message });
	}
};
