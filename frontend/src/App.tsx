import { useEffect, useState, useRef } from "react";
import VideoPlayer from "./components/VideoPlayer";

const App = () => {
    const playerRef = useRef<any>(null);
    const [videoLink, setVideoLink] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            await fetch("http://localhost:8000/api/v1/videos/upload", {
                method: "POST",
                body: formData,
            });

            fetchLatestVideo();
        } catch (error) {
            console.error("Error uploading video: ", error);
        } finally {
            setIsUploading(false);
        }
    };

    const fetchLatestVideo = async () => {
        try {
            const latestVideoResponse = await fetch(
                "http://localhost:8000/api/v1/videos/latest"
            );
            const latestVideoData = await latestVideoResponse.json();
            if (!latestVideoData.videoId) return;

            const videoResponse = await fetch(
                `http://localhost:8000/api/v1/videos/${latestVideoData.videoId}`
            );
            const videoData = await videoResponse.json();
            setVideoLink(videoData.videoUrl);
        } catch (error) {
            console.error("Error fetching video:", error);
        }
    };

    useEffect(() => {
        fetchLatestVideo();
    }, []);

    const videoPlayerOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: videoLink
            ? [{ src: videoLink, type: "application/x-mpegURL" }]
            : [],
    };

    const handlePlayerReady = (player: any) => {
        playerRef.current = player;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-gray-200">
            <h1 className="text-3xl font-bold mb-8 text-[#e07de6]">
                Upload & Watch Video
            </h1>

            <div className="flex flex-col items-center space-y-4">
                <input
                    type="file"
                    accept="video/*"
                    onChange={(e) =>
                        setSelectedFile(e.target.files?.[0] || null)
                    }
                    className="block w-full px-4 py-2 text-sm bg-gray-800 text-gray-300 border border-gray-700 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#e07de6]"
                />
                <button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    className={`cursor-pointer text-[#121212] px-6 py-2 rounded-lg font-semibold transition ${
                        !selectedFile || isUploading
                            ? "bg-gray-700 cursor-not-allowed opacity-50"
                            : "bg-[#e07de6] hover:bg-[#a954ac]"
                    }`}
                >
                    {isUploading ? "Uploading..." : "Upload Video"}
                </button>
            </div>

            {videoLink && (
                <div className="flex items-center justify-center w-full max-w-xl mt-6">
                    <VideoPlayer
                        options={videoPlayerOptions}
                        onReady={handlePlayerReady}
                    />
                </div>
            )}
        </div>
    );
};

export default App;
