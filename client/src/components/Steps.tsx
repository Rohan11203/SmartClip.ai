import StepCard from "./ui/StepCard";
import { motion } from "framer-motion";
import Image from "@/assets/smartClipImage2.jpg";
import Image2 from "@/assets/ytSearch.webp";
import VideoPlayer from "./VideoPresent";
import VideoClip from '@/assets/smartClip.mp4';

const Steps = () => {
  return (
    <>
      <motion.div
        id="about"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
      >
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black dark:bg-[radial-gradient(#ffffff33_1px,#000000_1px)] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="sm:pt-50 py-20  max-w-6xl mx-auto px-4">
          <div className="pb-8">
            <div className="flex justify-center">
              <h1 className="spectral-bold dark:text-white sm:text-5xl md:text-4xl text-3xl text-slate-700">
                How SmartClip Works
              </h1>
            </div>

            <VideoPlayer
              className="mx-auto mt-10 max-w-2xl"
              src={VideoClip}
            />

            <div className="sm:flex grid mt-20 justify-center  w-full gap-8">
              <StepCard
                title={"Paste YouTube Link"}
                description={"Drop your link into SmartClip's input box."}
                step={"Step 1"}
                image={Image2}
              />
              <StepCard
                title={"Set Time Range & Prompt"}
                description={"Drop your link into SmartClip's input box."}
                step={"Step 2"}
                image={Image}
              />
              <StepCard
                title={"Download and Explanation"}
                description={
                  "Get your downloadable clip and an AI summary instantly."
                }
                step={"Step 3"}
                image={Image}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Steps;
