import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { convertToHLS } from "../utils/video-processor";

let lastVideoId: string | null = null;

export const uploadVideo = (request: Request, response: Response): void => {
    if (!request.file) {
        response.status(400).json({ message: "File not found" });
        return;
    }

    const videoId = uuidv4();
    lastVideoId = videoId;

    const videoPath = request.file.path;
    const outputPath = `./uploads/videos/${videoId}`;

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    // WARNING: This should not be used in a production environment
    convertToHLS({
        videoPath,
        outputPath,
        callback: (error, hlsPath) => {
            if (error) {
                console.error(`FFmpeg error: ${error}`);
                response.status(500).json({ message: "FFmpeg error" });
                return;
            }

            // Stored in the database
            const videoUrl: string = `http://localhost:8000/uploads/videos/${videoId}/index.m3u8`;

            response.status(200).json({
                message: "Video uploaded and converted to HLS format",
                videoUrl,
                videoId,
            });
        },
    });
};

export const getLatestVideo = (request: Request, response: Response): void => {
    if (!lastVideoId) {
        response.status(404).json({ message: "No videos uploaded yet" });
        return;
    }
    response.status(200).json({ videoId: lastVideoId });
};

export const getVideoUrl = (request: Request, response: Response): void => {
    const videoId = request.params.id;
    const videoUrl = `http://localhost:8000/uploads/videos/${videoId}/index.m3u8`;
    response.status(200).json({ videoUrl });
};
