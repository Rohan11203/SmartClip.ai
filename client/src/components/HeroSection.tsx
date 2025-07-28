import Features from "./ui/Features";
import { motion } from "framer-motion";
import VideoPlayer from "./VideoPresent";
import smartclipVid from "@/assets/smartclipVid.mp4";
import { Github, Heart, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <>
      {/* This style block contains the keyframe animations and custom button styles.
        - @keyframes spin: Used for the rotating conic gradient border on buttons.
        - @keyframes pulse-glow: A subtle pulsing effect for the video player's border.
        - .github-button: Custom styles for the "Star on Github" button hover effect.
      */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px 5px rgba(251, 146, 60, 0.3); }
          50% { box-shadow: 0 0 35px 10px rgba(251, 146, 60, 0.1); }
        }
        .animated-gradient-border {
          animation: pulse-glow 5s infinite ease-in-out;
        }
        .github-button {
          transition: all 0.3s ease-in-out;
        }
        .github-button:hover {
          background: linear-gradient(rgb(255, 133, 89) 0%, rgb(255, 68, 0) 100%);
          box-shadow: 0 0 25px rgba(255, 100, 0, 0.6);
          transform: scale(1.05);
        }
      `}</style>

      <motion.div
        id="top"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center"
      >
        <div className="relative z-[2] flex flex-col gap-6 items-center">
          <div className="mt-20 sm:mt-28">
            <div className="relative inline-flex overflow-hidden rounded-full p-[1.5px]">
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#facc15_0%,#ea580c_50%,#facc15_100%)]"></span>
              <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-amber-50   dark:bg-black px-4 py-2 text-sm font-medium dark:text-gray-200 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                Over 100 clips generated & counting!
              </div>
            </div>
          </div>

          <h1 className="mt-4 text-4xl sm:text-6xl text-slate-700 md:text-7xl font-bold dark:text-white tracking-tight">
            Transform YouTube Content. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-orange-500">
              With AI-Powered Clips & Insights.
            </span>
          </h1>

          <div className="mt-4 max-w-2xl mx-auto space-y-2 text-slate-700 dark:text-gray-300 ">
            <p className="sm:text-lg text-lg font-medium ">
              Tired of endless scrubbing? SmartClip lets you grab the most
              important parts of any YouTube video instantly.
            </p>
            <p className="sm:text-lg text-lg font-medium ">
              Our AI generates summaries, turning long videos into quick,
              shareable knowledge.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            <a
              href="https://github.com/Rohan11203/SmartClip.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="github-button inline-flex items-center justify-center rounded-full bg-amber-50 dark:bg-[#111111] border border-gray-800 px-5 py-3 text-sm font-semibold dark:text-gray-200"
            >
              <Github className="w-4 h-4 mr-2" />
              Star on Github
            </a>
            <StyledButton
              icon={<Heart className="w-4 h-4 mr-2" />}
              text="Built with Love"
            />
          </div>

          <Features />

          <div className="w-full mt-14 border border-orange-900/50 animated-gradient-border rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
            <VideoPlayer className="w-full h-full" src={smartclipVid} />
          </div>
        </div>
      </motion.div>
    </>
  );
};

const StyledButton = ({ href, icon, text }: any) => {
  const content = (
    <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-gray-200  backdrop-blur-sm transition-colors hover:bg-black">
      {icon}
      {text}
    </div>
  );

  return (
    <div className="relative inline-flex overflow-hidden rounded-full p-[1.5px]">
      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#facc15_0%,#ea580c_50%,#facc15_100%)]"></span>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
};

export default HeroSection;
