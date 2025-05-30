import express from "express";
import dotenv from "dotenv";
import session from "express-session";

import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import passport from "passport";
dotenv.config();
import cors from "cors";
import { UserRouter } from "./routes/userRouter";
import "./config/Passport";
import mongoose from "mongoose";
import { ClipRouter } from "./routes/clipRoutes";
import path from "path";
import { videoExplainerRoutes } from "./routes/videoExplainerRoutes";
import { uploadVideo } from "./routes/uploadVideo";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: ["http://localhost:5173","https://smartclip-ai1.onrender.com"], // frontend urls
    credentials: true, // allow cookie headers
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_KEY!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: true, // Set to true in production
      sameSite: "none",
    },
  })
);

app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/users", UserRouter);
app.use("/api/v1/video", videoExplainerRoutes);

app.use("/api/v1/videos", ClipRouter);
app.use("/api/v1/video", uploadVideo)

const MongoUrl1 = process.env.MongoUrl!;

async function Main() {
  console.log(path.join(__dirname));
  const uploadsDir = path.join(__dirname, "../../uploads");
  console.log("UploadDIr", uploadsDir);
  await mongoose.connect(MongoUrl1);
  console.log("Connected to MongoDB");

  app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
  });
}

Main();
