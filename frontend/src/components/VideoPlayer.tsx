import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

interface VideoPlayerProps {
    options: any;
    onReady?: (player: any) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = (props: VideoPlayerProps) => {
    const videoRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);
    const { options, onReady } = props;

    useEffect(() => {
        if (!playerRef.current) {
            const videoElement = document.createElement("video-js");

            videoElement.classList.add("vjs-big-play-centered");
            videoRef.current?.appendChild(videoElement);

            const player = (playerRef.current = videojs(
                videoElement,
                options,
                () => {
                    videojs.log("player is ready");
                    onReady && onReady(player);
                }
            ));
        } else {
            const player = playerRef.current;

            player.autoplay(options.autoplay);
            player.src(options.sources);
        }
    }, [options, videoRef]);

    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    return (
        <div data-vjs-player>
            <div ref={videoRef} className="w-xl" />
        </div>
    );
};

export default VideoPlayer;
