import fs from "fs";
import { exec } from "child_process";

// CAUTION: This method uses child_process exec(), which is not recommended for production

interface VideoProcessorOptions {
    videoPath: string;
    outputPath: string;
    callback: (error: Error | null, hlsPath?: string) => void;
}

export const convertToHLS = ({
    videoPath,
    outputPath,
    callback,
}: VideoProcessorOptions): void => {
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    const hlsPath = `${outputPath}/index.m3u8`;
    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            return callback(error);
        }

        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        callback(null, hlsPath);
    });
};
