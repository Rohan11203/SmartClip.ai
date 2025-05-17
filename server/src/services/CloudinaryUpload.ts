import cloudinary from "../config/cloudinary";
import { VideoModel } from "../DB";

export async function UploadToCloudinary(final: any, userId: any) {
  const uploadResult = await cloudinary.uploader.upload(final, {
    resource_type: "video",
    folder: "clips/",
    chunk_size: 6000000,
  });

  console.log(
    "Uploaded to claodinary",
    uploadResult.public_id,
    uploadResult.secure_url
  );

  const videoRecord = await VideoModel.create({
    user: userId,
    publicId: uploadResult.public_id,
    url: uploadResult.secure_url,
    format: uploadResult.format,
    duration: uploadResult.duration,
    clippedAt: new Date(),
  });
  console.log("Video Strored in DB");
}
