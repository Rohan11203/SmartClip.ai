import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import passport from "passport";
import session from "express-session";
dotenv.config();
import cors from "cors";
import { UserRouter } from "./routes/userRouter";
import "./config/Passport";
import mongoose from "mongoose";
import { ClipRouter } from "./routes/clipRoutes";
import path from "path";
import { videoExplainerRoutes } from "./routes/videoExplainerRoutes";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"], // frontend urls
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
      secure: false, // Set to true in production
      sameSite: "lax",
    },
  })
);

app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/users", UserRouter);
app.use("/api/v1/video", videoExplainerRoutes);

app.use("/api/v1/videos", ClipRouter);

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
