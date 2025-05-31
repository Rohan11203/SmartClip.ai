import React, { useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const VideoUpload = () => {
  const [video, setVideo] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setIsloading] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!video) {
      setMessage("Please select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);

    try {
    setIsloading(false);

      const res = await axios.post(
        "https://smartclip-ai.onrender.com/api/v1/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setMessage(res.data.message || "Uploaded successfully");
    } catch (err: any) {
        setIsloading(true)
      setMessage(err.response?.data?.message || "Upload failed");
      console.error(err);
    } finally {
      setIsloading(true);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Upload Video
      </h2>

      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading ? (
        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 cursor-pointer text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Upload
        </button>
      ) : (
        <div className="items-center text-center">
          <ClipLoader size={18} />
        </div>
      )}

      {message && (
        <p className="mt-4 text-center text-sm text-gray-800">{message}</p>
      )}
    </div>
  );
};

export default VideoUpload;
