import axios from "axios";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import ProcessingModal from "./ui/ProcessingModal";

const ClipForm = () => {
  const [data, setData] = useState({
    url: "",
    startTime: "",
    endTime: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);


  const theme  = localStorage.getItem("theme")

  const [error, setError] = useState("");
  const [loading,setLoading] = useState(false);

  async function handleSubmit() {
    setIsProcessing(true)
    setLoading(true)
    try {
      setError(""); // Clear previous errors

      const response = await axios.post(
        "http://localhost:3000/api/v1/videos/clip",
        data,
        { responseType: "blob" }
      );

      // Handle server-side error inside blob
      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      const blob = new Blob([response.data], { type: "video/mp4" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "clip.mp4";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Download failed", err);
      setError(err?.message || "Something went wrong");
      setIsProcessing(false)
    }finally {
      setLoading(false)
      
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex justify-center">
      <ProcessingModal
      isOpen={isProcessing}
      onComplete={() => {error ? setIsProcessing(false) : setIsProcessing(false)}}
      />
      <div
        className="
      bg-white dark:bg-cg-dark dark:text-cg-text
      flex flex-col justify-center
      h-[320px] w-[384px]
      p-6 space-y-4
      rounded-2xl shadow-lg
      border border-gray-200 dark:border-gray-700 dark:bg-[#121212]
    "
      >
        <input
          value={data.url}
          name="url"
          onChange={handleChange}
          placeholder="https://www.youtube.com/"
          className="
        w-full p-3
        bg-gray-100 dark:bg-[#121212]
        border border-gray-300 dark:border-gray-600
        rounded-md
        focus:outline-none focus:ring-2 focus:ring-blue-500
        placeholder-gray-500 dark:placeholder-gray-400
        transition
      "
        />
        <input
          value={data.startTime}
          name="startTime"
          onChange={handleChange}
          placeholder="Start Time (HH:MM:SS)"
          className="
        w-full p-3
        bg-gray-100 dark:bg-[#121212]
        border border-gray-300 dark:border-gray-600
        rounded-md
        focus:outline-none focus:ring-2 focus:ring-blue-500
        placeholder-gray-500 dark:placeholder-gray-400
        transition
      "
        />
        <input
          value={data.endTime}
          name="endTime"
          onChange={handleChange}
          placeholder="End Time (HH:MM:SS)"
          className="
        w-full p-3
        bg-gray-100 dark:bg-[#121212]
        border border-gray-300 dark:border-gray-600
        rounded-md
        focus:outline-none focus:ring-2 focus:ring-blue-500
        placeholder-gray-500 dark:placeholder-gray-400
        transition
      "
        />
        <button
        disabled={loading}
          onClick={handleSubmit}
          className="
        w-full py-3
        bg-black hover:bg-gray-900 cursor-pointer
        dark:bg-white dark:hover:bg-gray-100 dark:text-black
        text-white font-semibold
        rounded-md shadow-md
        transition
      "
        >
          {
            loading ? (
              <ClipLoader size={20} color={`${theme == "dark" ? "black" : "white"}`} />
            ): "Download Clip"
          }
        </button>
        {error && <p className=" text-center text-red-600 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default ClipForm;
