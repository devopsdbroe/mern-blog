import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

const region = "us-east-1";
const bucketName = "broe-code";
const s3Client = new S3Client({
	region,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SECRET_KEY,
	},
});

export const generateUploadUrl = async () => {
	const date = new Date();
	const imageName = `${nanoid()}-${date.getTime()}.jpeg`;
	const contentType = "image/jpeg";

	const command = new PutObjectCommand({
		Bucket: bucketName,
		Key: imageName,
		ContentType: contentType,
	});

	const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

	return { uploadUrl, contentType };
};
