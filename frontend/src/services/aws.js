import axios from "axios";

export const uploadImage = async (img) => {
	try {
		// Make request to server to get uploadUrl
		const res = await axios.get(
			`${import.meta.env.VITE_SERVER_DOMAIN}/s3/getUploadUrl`
		);
		const { uploadUrl, contentType } = res.data;

		// Upload image to the provided URL
		await axios.put(uploadUrl, img, {
			headers: {
				"Content-Type": contentType,
			},
		});

		// Return the base URL without query parameters
		return uploadUrl.split("?")[0];
	} catch (error) {
		console.error("Failed to upload image:", error);
	}
};
