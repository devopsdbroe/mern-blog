import express from "express";
import "dotenv/config";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import awsS3Routes from "./routes/awsS3Routes.js";
import { errorHandler } from "./middleware/validationMiddleware.js";
import connectDB from "./config/db.js";

import aws from "aws-sdk";
import { nanoid } from "nanoid";

// Setting up S3 bucket
const s3 = new aws.S3({
	region: "us-east-1",
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_KEY,
});

export const generateUploadURL = async () => {
	const date = new Date();
	const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

	// Get signed URL using S3 keys
	return await s3.getSignedUrlPromise("putObject", {
		Bucket: "broe-code",
		Key: imageName,
		Expires: 1000,
		ContentType: "image/jpeg",
	});
};

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/s3", awsS3Routes);
app.use(errorHandler);

connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
