import { useEffect, useState } from "react";
import ClipForm from "./ClipForm";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import VideoDropdown from "./ui/VideoDropdown";
import { getUserVideos, onLogout } from "@/api";
import { FaUser } from "react-icons/fa";
import { LogOut, Film, Upload, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import VideoUpload from "./VideoUpload";

const MainPage = () => {
  const [prompt, setPrompt] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videos, setVideos] = useState([]);
  const [videoId, setVideoId] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);

  const [activeTab, setActiveTab] = useState("clip"); // 'clip', 'insights', 'upload'

  const navigate = useNavigate();

  async function handleUserVideos() {
    try {
      const res = await getUserVideos();
      setVideos(res.data.videos);
      console.log(res.data.videos);
    } catch (err) {
      console.error("Failed to fetch user videos:", err);
      setError("Could not load your videos. Please try refreshing.");
    }
  }

  const handleExplainSubmit = async () => {
    if (!prompt) {
      setError("Please enter a prompt.");
      return;
    }
    setLoading(true);
    setError("");
    setExplanation("");
    try {
      const response = await axios.post(
        "https://smartclip.duckdns.org/api/v1/video/explain",
        { prompt, videoId }
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
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("th eme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    handleUserVideos();
  }, []);

  const handleLogout = async () => {
    setIsLogout(true);
    try {
      await onLogout();
      localStorage.setItem("isAuth", "false");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLogout(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-800 dark:text-gray-200 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b  border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-black/50 backdrop-blur-lg">
        <div className="container mx-auto flex items-center max-w-7xl  px-6 justify-between p-4">
          <Link 
          to={"/"}
          className="text-xl font-bold text-gray-900 dark:text-white">
            Smart<span className="text-orange-500">Clip</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
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
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                <FaUser className="h-5 w-5" />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      disabled={isLogout}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md disabled:opacity-50"
                    >
                      {isLogout ? (
                        <ClipLoader
                          size={16}
                          color={darkMode ? "white" : "black"}
                        />
                      ) : (
                        <LogOut className="w-4 h-4 mr-2" />
                      )}
                      <span>{isLogout ? "Logging out..." : "Logout"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-amber-400  dark:to-orange-600">
            Clip Videos. Let AI Explain the Rest.
          </h2>
          <p className="mt-4 text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Use the tools below to extract perfect moments and generate instant,
            intelligent explanations.
          </p>
        </div>

        {/* Tab Navigation (Reordered) */}
        <div className="flex justify-center max-w-7xl mx-auto px-6  mb-8">
          <TabButton
            icon={<Film />}
            label="Clip Video"
            isActive={activeTab === "clip"}
            onClick={() => setActiveTab("clip")}
          />
          <TabButton
            icon={<Sparkles />}
            label="AI Insights"
            isActive={activeTab === "insights"}
            onClick={() => setActiveTab("insights")}
          />
          <TabButton
            icon={<Upload />}
            label="Upload"
            isActive={activeTab === "upload"}
            onClick={() => setActiveTab("upload")}
          />
        </div>

        {/* Tab Content */}
        <div className="w-full max-w-6xl mx-auto">
          {activeTab === "clip" && (
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 md:p-8">
              <ClipForm />
            </div>
          )}

          {activeTab === "insights" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Controls */}
              <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800  rounded-lg p-6 space-y-6 h-fit">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Controls
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    1. Select a Video
                  </label>
                  <VideoDropdown
                    videos={videos}
                    onSelect={(id) => setVideoId(id)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="prompt"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    2. Enter Your Prompt
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={6}
                    placeholder="e.g., 'Summarize the key points discussed in this clip' or 'What is the main argument being made?'"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 focus:ring-orange-500 rounded-md shadow-sm focus:outline-none focus:ring-2  dark:bg-black dark:text-white transition"
                  />
                </div>
                <button
                  disabled={loading || !prompt}
                  onClick={handleExplainSubmit}
                  className="w-full bg-orange-500 hover:bg-orange-600 cursor-pointer disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-md flex items-center justify-center transition-colors"
                >
                  {loading ? (
                    <>
                      <ClipLoader size={20} color={"#FFF"} className="mr-2" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    "Generate Explanation"
                  )}
                </button>
              </div>

              {/* Right Side - Explanation */}
              <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 min-h-[300px] lg:min-h-0">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Explanation
                </h3>
                <div className="flex-grow">
                  {error && (
                    <div className="text-red-500 text-center p-4 bg-red-500/10 rounded-md">
                      {error}
                    </div>
                  )}
                  {loading && !explanation && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      <ClipLoader
                        size={40}
                        color={darkMode ? "#4A90E2" : "#3B82F6"}
                      />
                      <p className="mt-4 text-lg">Analyzing video...</p>
                    </div>
                  )}
                  {!loading && !explanation && !error && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 mb-4 opacity-50"
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
                      <p className="text-xl font-medium">
                        Your AI-powered explanation will appear here.
                      </p>
                      <p className="mt-2 max-w-md">
                        Select a video, provide a prompt, and click "Generate
                        Explanation" to begin.
                      </p>
                    </div>
                  )}
                  {explanation && (
                    <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none whitespace-pre-wrap">
                      {explanation}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "upload" && (
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 md:p-8">
              <VideoUpload onUploadSuccess={handleUserVideos} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const TabButton = ({ icon, label, isActive, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-all duration-200
      ${
        isActive
          ? "border-orange-500 text-orange-500 dark:text-orange-400"
          : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
      }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default MainPage;
