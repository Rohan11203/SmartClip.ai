import { Router } from "express";
import { Signin, Signup } from "../controllers/userController";
import { Userauth } from "../auth";
import { VideoModel } from "../DB";

export const UserRouter = Router();

UserRouter.post("/signup", Signup);
UserRouter.post("/signin", Signin);

UserRouter.get("/signout", Userauth, (req, res) => {
  res.json({
    success: true,
    message: "Signout successful",
  });
});

UserRouter.get("/userVideos", Userauth, async (req: any, res) => {
  const userId = (req.user as any).sub;
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
