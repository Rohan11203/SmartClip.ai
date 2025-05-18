import mongoose, { Schema, Types } from "mongoose";

interface VideoDoc extends Document {
  user:      Types.ObjectId;   // ref to User
  publicId:  string;
  url:       string;
  format:    string;
  duration:  number;
  clippedAt: Date;
}

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String },
    googleId: { type: String }
})

const videoSchema = new Schema<VideoDoc>({
  user: {
    type: Schema.Types.ObjectId,
    ref:  "User",
    required: true,
    index: true     // for fast lookups of a user’s videos
  },
  publicId:  { type: String, required: true, unique: true },
  url:       { type: String, required: true },
  format:    { type: String },
  duration:  { type: Number },
  clippedAt: { type: Date,   default: Date.now },
});

export const UserModel = mongoose.model("User", UserSchema);
export const VideoModel = mongoose.model("Video", videoSchema);