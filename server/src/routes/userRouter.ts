import { Router } from "express";
import { Signin, Signup } from "../controllers/userController";
import { Userauth } from "../auth";

export const UserRouter = Router();

UserRouter.post("/signup", Signup);
UserRouter.post("/signin", Signin);

UserRouter.get("/signout", Userauth, (req, res) => {
    res.json({
        success: true,
        message: "Signout successful",
    })
});