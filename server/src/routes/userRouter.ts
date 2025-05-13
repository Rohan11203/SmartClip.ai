import { Router } from "express";
import { Signup } from "../controllers/userController";

export const UserRouter = Router();

UserRouter.post("/signup", Signup);