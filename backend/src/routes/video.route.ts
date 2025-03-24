import express from "express";
import { upload } from "../middlewares/multer.middleware";
import {
    uploadVideo,
    getVideoUrl,
    getLatestVideo,
} from "../controllers/video.controller";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadVideo);
router.get("/latest", getLatestVideo);
router.get("/:id", getVideoUrl);

export default router;
