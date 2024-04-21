import express from "express";
import { getUploadUrl } from "../controllers/awsS3Controller.js";

const router = express.Router();

router.get("/getUploadUrl", getUploadUrl);

export default router;
