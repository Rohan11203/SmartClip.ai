import { Router } from "express";
import { ClipVideo } from "../controllers/clipController";
import { Userauth } from "../auth";

export const ClipRouter = Router();

ClipRouter.post("/clip",Userauth, ClipVideo);
