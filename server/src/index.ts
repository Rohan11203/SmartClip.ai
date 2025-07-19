import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import passport from "passport";
dotenv.config();
import cors from "cors";
import { UserRouter } from "./routes/userRouter";
import "./config/Passport";
import mongoose from "mongoose";
import path from "path";
import { ClipRouter } from "./routes/clipRoutes";
import { videoExplainerRoutes } from "./routes/videoExplainerRoutes";
import { uploadVideo } from "./routes/uploadVideo";

const app = express();

app.set("trust proxy", 1);

const MongoUrl1 = process.env.MongoUrl!;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://smartclip-ai1.onrender.com"], // frontend urls
    credentials: true, // allow cookie headers
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_KEY!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MongoUrl1, // Your MongoDB connection string
      ttl: 14 * 24 * 60 * 60, // Session TTL (e.g., 14 days)
      autoRemove: "interval",
      autoRemoveInterval: 10, // In minutes. Removes expired sessions every 10 minutes
    }),
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
app.use("/api/v1/video", uploadVideo);

async function Main() {
  try {
    await mongoose.connect(MongoUrl1);
    console.log("Connected to MongoDB");

    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Failed to connect to mongoDB and server");
  }
}

Main();
