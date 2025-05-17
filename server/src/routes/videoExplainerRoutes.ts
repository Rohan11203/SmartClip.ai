import { Router } from "express";
import { videoExplainer } from "../controllers/videoExplainerController";
import { Userauth } from "../auth";

export const videoExplainerRoutes = Router();

videoExplainerRoutes.post("/explain",Userauth, videoExplainer)