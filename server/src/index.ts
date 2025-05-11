import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

import cors from "cors";
import {UserRouter} from "./routes/index";
import mongoose from "mongoose";
import { Userauth } from "./auth/index";


const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"], // frontend urls
    credentials: true,                // allow cookie headers
  })
);
app.use(express.json());
app.use(cookieParser());


app.use("/api/v1/", UserRouter);

const MongoUrl1 = process.env.MongoUrl!

async function Main() {

  await  mongoose.connect(MongoUrl1);
  console.log('Connected to MongoDB');

  app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
  });
}

Main();
