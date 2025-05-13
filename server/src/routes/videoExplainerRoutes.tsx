import { Router } from "express";
import { videoExplainer } from "../controllers/videoExplainerController";

export const videoExplainerRoutes = Router();

videoExplainerRoutes.post("/video/explain", videoExplainer)