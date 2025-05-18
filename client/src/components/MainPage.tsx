import { useEffect, useState } from "react";
import ClipForm from "./ClipForm";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import VideoDropdown from "./ui/VideoDropdown";
import { getUserVideos } from "@/api";
// import { getUserVideos } from "@/api";
const MainPage = () => {
  const [prompt, setPrompt] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videos,setVideos] = useState([])
  const [videoId,setVideoId] = useState("")

  const theme = localStorage.getItem("theme");

  async function handleUserVideos() {
    const res = await getUserVideos();
    setVideos(res.data.videos)
    console.log(res.data.videos)
  }


  const handleExplainSubmit = async () => {
    setLoading(true);
    try {
      setError("");
      const response = await axios.post(
        "http://localhost:3000/api/v1/video/explain",
        { prompt,videoId }
      );
      if (response.data?.error) {
        throw new Error(response.data.error);
      }
      setExplanation(response.data.videoText);
    } catch (error) {
      console.error("Error fetching explanation:", error);
      setError("Failed to fetch explanation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      // If no saved preference, check system preference
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
    handleUserVideos()

  }, []);

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  return (
    <div className="flex flex-col md:flex-row flex-grow ">
      {/* Mobile toggle for sidebar */}
      <div className="md:hidden flex justify-between items-center border-b border-gray-200 dark:bg-[#121212]  dark:border-gray-800 p-4">
        <span className="font-medium">Video Details & Prompt</span>
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {showMobileSidebar ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Left Side - Input Form and Prompt */}
      <div
        className={`w-full md:w-1/3 xl:w-1/4 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black p-4 overflow-y-auto ${
          showMobileSidebar ? "block" : "hidden md:block"
        }`}
      >
        {/* Video details form */}
        <div className="mb-6 bg-white dark:bg-[#121212] rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Video Details</h2>
          <ClipForm />
        </div>

        {/* Prompt textarea */}
        {/* Drop Down*/}

        <VideoDropdown videos={videos}
        onSelect={(id) => { setVideoId(id) }}
        />
        <div className="bg-white dark:bg-[#121212] rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Prompt</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExplainSubmit();
            }}
          >
            <div className="mb-4">
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={8}
                placeholder="Enter your prompt here to guide the explanation..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-[#121212] dark:text-white"
              />
            </div>
            <button
              disabled={loading}
              // disabled={true}
              type="submit"
              className="w-full bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 cursor-pointer text-white dark:text-black font-medium py-2 px-4 rounded-md  "
            >
              {loading ? (
                <ClipLoader
                  size={20}
                  color={`${theme == "dark" ? "black" : "white"}`}
                />
              ) : (
                "Explain ( Coming Soon )"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Explanation Display */}
      <div className="w-full md:w-2/3 xl:w-3/4 bg-white dark:bg-[#202123] overflow-y-auto">
        <div className="h-full flex flex-col">
          {/* Explanation header */}
          <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between">
            <h2 className="text-xl font-semibold">Video Clip Explanation</h2>
            <button
              onClick={toggleDarkMode}
              className="ml-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {darkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Explanation content */}
          <div className="flex-grow p-6">
            {error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : explanation ? (
              <div className="prose dark:prose-invert max-w-none">
                {explanation
                  .split("\n")
                  .map((line, i) =>
                    line === "" ? <br key={i} /> : <p key={i}>{line}</p>
                  )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                <p className="text-xl">
                  Select Your video and submit a prompt to get started
                </p>
                <p className="mt-2 text-center max-w-md">
                  smartClip will clip your video and provide an AI-powered
                  explanation based on your prompt
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
