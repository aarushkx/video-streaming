import express from "express";
import cors from "cors";

import videoRoute from "./routes/video.route";

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/v1/videos", videoRoute);

export default app;
