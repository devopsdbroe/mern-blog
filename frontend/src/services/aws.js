import axios from "axios";

export const uploadImage = async (img) => {
	let imgUrl = null;

	// Make request to server to get uploadUrl
	await axios
		.get(`${import.meta.env.VITE_SERVER_DOMAIN}/s3/get-upload-url`)
		.then(async ({ data: { uploadUrl, contentType } }) => {
			await axios({
				method: "PUT",
				url: uploadUrl,
				headers: {
					"Content-Type": contentType,
				},
				data: img,
			}).then(() => {
				imgUrl = uploadUrl.split("?")[0];
			});
		});

	return imgUrl;
};
