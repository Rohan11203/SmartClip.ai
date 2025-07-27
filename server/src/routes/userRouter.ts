import { Router } from "express";
import { Signin, Signout, Signup } from "../controllers/userController";
import { Userauth } from "../auth";
import { VideoModel } from "../DB";
import passport from "passport";

export const UserRouter = Router();

UserRouter.post("/signup", Signup);
UserRouter.post("/signin", Signin);
UserRouter.post("/logout", Userauth,Signout)
UserRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account",
  })
);

UserRouter.get(
  "/google/redirect/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: true
  }),
  (req: any, res: any) => {
    res.redirect("https://smartclip-chi.vercel.app/clipVideos");
  }
);

UserRouter.get("/signout", Userauth, (req, res) => {
  res.json({
    success: true,
    message: "Signout successful",
  });
});

UserRouter.get("/userVideos", Userauth, async (req: any, res) => {
  // const userId = (req.user as any).sub;
  const userId = req.user._id;
  try {
    const videos = await VideoModel.find({
      user: userId,
    });

    const enrichedVideos = videos.map((video: any) => {
      const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
      const baseUrl = `https://res.cloudinary.com/${cloud_name}/video/upload/so_3`;

      const thumbnailUrl = `${baseUrl}/${video.publicId}.jpg`;
      return {
        ...video._doc,
        thumbnailUrl,
      };
    });

    res.status(200).json({
      videos: enrichedVideos,
    });
  } catch (error) {
    console.error("Error fetching user videos:", error);
    res.status(500).json({ message: "Server error" });
  }
});
