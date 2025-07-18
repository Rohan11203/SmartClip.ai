import React, { useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
const VideoUpload = ({ onUploadSuccess }:any) => {
  const [video, setVideo] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!video) {
      setMessage("Please select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);

    setIsLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "https://smartclip-ai.onrender.com/api/v1/video/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setMessage(res.data.message || "Uploaded successfully");

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      setVideo(null); 
      const input = document.getElementById('video-upload-input') as HTMLInputElement;
      if (input) input.value = '';


    } catch (err: any) {
      setMessage(err.response?.data?.message || "Upload failed");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-transparent rounded-2xl">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Upload New Video
      </h3>

      <div className="space-y-4">
         <input
            id="video-upload-input"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-orange-900/50 file:text-orange-700 dark:file:text-orange-300 hover:file:bg-blue-100 dark:hover:file:bg-orange-900/70 "
        />

        <button
            onClick={handleUpload}
            disabled={loading || !video}
            className="w-full bg-orange-500 hover:bg-orange-600 cursor-pointer disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-md flex items-center justify-center transition-colors"
        >
            {loading ? (
            <>
                <ClipLoader size={20} color={"#FFF"} className="mr-2" />
                <span>Uploading...</span>
            </>
            ) : (
            "Upload Video"
            )}
        </button>

        {message && (
            <p className={`mt-4 text-center text-sm font-medium ${message.includes("failed") ? 'text-red-500' : 'text-green-500'}`}>
                {message}
            </p>
        )}
      </div>
    </div>
  );
};

export default VideoUpload;
