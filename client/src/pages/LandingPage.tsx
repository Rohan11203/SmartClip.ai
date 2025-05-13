import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="relative text-black dark:text-white min-h-screen flex flex-col">
      <div
        className="
    absolute inset-0 -z-10 h-full w-full
    bg-white dark:bg-black
    bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]
    dark:bg-[linear-gradient(to_right,#2a2a2a_1px,transparent_1px),linear-gradient(to_bottom,#2a2a2a_1px,transparent_1px)]
    bg-[size:6rem_4rem] dark:bg-[size:6rem_4rem]
  "
      ></div>

      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center px-4  text-center ">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Transform Videos with{" "}
          <span className="text-blue-500 dark:text-blue-400">smartClip</span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mb-8 text-gray-700 dark:text-gray-300">
          Paste a URL, clip what matters, download, and get AI-powered
          explanations about your video clips. Simplify your video content
          experience.
        </p>

        <Link
          to={"/clip"}
          className="px-8 py-4 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Coming Soon
        </Link>

        <p className="mt-6 text-gray-600 dark:text-gray-400 max-w-lg">
          smartClip is revolutionizing how you interact with video content. Our
          platform allows you to extract the most valuable parts of any video,
          save them for later, and understand them better with GPT-powered
          insights.
        </p>
      </main>
      {/* Footer */}
      <footer className="py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} smartClip. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
