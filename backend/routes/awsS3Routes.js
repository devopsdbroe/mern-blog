import express from "express";
import { getUploadUrl } from "../controllers/awsS3Controller.js";

const router = express.Router();

router.get("/get-upload-url", getUploadUrl);

export default router;
