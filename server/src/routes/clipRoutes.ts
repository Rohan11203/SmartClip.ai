import { Router } from "express";
import { ClipVideo } from "../controllers/clipController";

export const ClipRouter = Router();

ClipRouter.post("/clip", ClipVideo);
