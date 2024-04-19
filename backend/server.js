import express from "express";
import "dotenv/config";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import awsS3Routes from "./routes/awsS3Routes.js";
import { errorHandler } from "./middleware/validationMiddleware.js";
import connectDB from "./config/db.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/s3", awsS3Routes);
app.use(errorHandler);

connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
