import axios from "axios";

export const uploadImage = async (img) => {
	let imgUrl = null;

	// Make request to server to get uploadURL
	await axios
		.get(`${import.meta.env.VITE_SERVER_DOMAIN}/s3/get-upload-url`)
		.then(async ({ data: { uploadURL, contentType } }) => {
			await axios({
				method: "PUT",
				url: uploadURL,
				headers: {
					"Content-Type": contentType,
				},
				data: img,
			}).then(() => {
				imgUrl = uploadURL.split("?")[0];
			});
		});

	return imgUrl;
};
