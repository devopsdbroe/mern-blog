import { generateUploadUrl } from "../utils/awsS3Service.js";

export const getUploadUrl = async (req, res) => {
	try {
		const { uploadUrl, contentType } = await generateUploadUrl();

		return res.status(200).json({ uploadUrl, contentType });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ error: error.message });
	}
};
