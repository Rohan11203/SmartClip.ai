import { Router } from "express";
import { videoExplainer } from "../controllers/videoExplainerController";

export const videoExplainerRoutes = Router();

videoExplainerRoutes.post("/explain", videoExplainer)