import Features from "./ui/Features";
import { motion } from "framer-motion";
const HeroSection = () => {

  
  return (
    <motion.div
    id="top"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6,delay: 0.2 }}
    className="relative max-w-5xl mx-auto px-6 text-center">
      <div className="flex flex-col gap-6">
        <div className="mt-30 ">
          <span className="relative inline-flex overflow-hidden rounded-full p-[1.5px]">
          <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a855f7_0%,#3b82f6_50%,#a855f7_100%)]"></span>
          <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white dark:bg-black px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 backdrop-blur-sm">
            ✨ Over 100 clips generated & counting!
          </div>
        </span>
        </div>
        <h1 className="mt-6 spectral-bold  dark:text-white sm:text-5xl md:text-6xl text-3xl  text-slate-700">
          Clip YouTube Videos. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-600 dark:from-amber-300 dark:to-orange-500">Let AI Explain the Rest.</span>
        </h1>

        <p className="spectral-medium text-xs px-4 sm:text-base dark:text-orane-100 dark:text-white">
          SmartClip lets you extract clips from any YouTube video and get
          instant AI-generated explanations
          <br />— perfect for learning, sharing, or summarizing content.
        </p>

        <div className="sm:flex grid justify-center items-center gap-6 spectral-medium">
          <div>
            <input
              placeholder="Enter Your Email"
              className=" outline-none dark:text-grey-100 shadow-md h-12 w-full sm:w-86 p-4 bg-white dark:bg-[#121212]  rounded-4xl"
            />
          </div>
            <button className=" bg-orange-500  text-white h-12 sm:w-30 w-full rounded-4xl cursor-pointer hover:bg-orange-400 transition duration-300">
              Send Message
            </button>
        </div>

        <Features />
      </div>
    </motion.div>
  );
};

export default HeroSection;
