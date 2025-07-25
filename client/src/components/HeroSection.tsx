import { Link } from "react-router-dom";
import Features from "./ui/Features";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <motion.div
      id="top"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative max-w-5xl mx-auto px-6 text-center font-bold"
    >
      <div className="absolute hidden dark:block top-20 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 pointer-events-none z-[1]">
        <svg
          className="animate-fade-in w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 400"
          fill="none"
        >
          <defs>
            <filter
              id="glow-filter"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="60" result="coloredBlur" />
            </filter>
          </defs>
          <g filter="url(#glow-filter)">
            {/* Orange Glow */}
            <ellipse
              cx="300"
              cy="200"
              rx="180"
              ry="80"
              fill="#ea580c"
              fillOpacity="0.3"
            />
            {/* Amber Glow */}
            <ellipse
              cx="500"
              cy="200"
              rx="200"
              ry="90"
              fill="#facc15"
              fillOpacity="0.25"
            />
          </g>
        </svg>
      </div>
      <div className="flex z-[2] flex-col gap-6">
        <div className="mt-28">
          <span className="relative inline-flex overflow-hidden rounded-full p-[1.5px]">
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a855f7_0%,#3b82f6_50%,#a855f7_100%)]"></span>
            <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white dark:bg-black px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 backdrop-blur-sm">
              ✨ Over 100 clips generated & counting!
            </div>
          </span>
        </div>

        <h1 className="mt-6  dark:text-white text-5xl sm:text-6xl md:text-7xl font-bold text-slate-700">
          Clip YouTube Videos. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-600 dark:from-amber-300 dark:to-orange-500">
            Let AI Explain the Rest.
          </span>
        </h1>

        <div className="mt-8 text-center space-y-4">
          <p className="px-4 sm:text-xl text-lg font-medium dark:text-slate-200 text-slate-600">
            Instantly clip any YouTube video and let our AI explain it for you.
          </p>
          <p className="px-4 sm:text-xl text-lg font-medium dark:text-slate-200 text-slate-600">
            Perfect for learning and summarizing content.
          </p>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <span className="relative inline-flex overflow-hidden rounded-full p-[1.5px]">
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#facc15_0%,#ea580c_50%,#facc15_100%)]"></span>
            <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white dark:bg-black px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 backdrop-blur-sm">
              <Link to={"https://github.com/Rohan11203/SmartClip.ai/"}>
                ✨ Star on Github
              </Link>
            </div>
          </span>

          <span className="relative inline-flex overflow-hidden rounded-full p-[1.5px]">
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#facc15_0%,#ea580c_50%,#facc15_100%)]"></span>
            <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white dark:bg-black px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 backdrop-blur-sm">
              🚀 Built with Love
            </div>
          </span>
        </div>

        <Features />
      </div>
    </motion.div>
  );
};

export default HeroSection;
