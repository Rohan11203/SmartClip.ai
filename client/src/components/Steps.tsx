import StepCard from "./ui/StepCard";
import { motion } from "framer-motion";
import Image from "@/assets/clip.png";
import Image2 from "@/assets/ytSearch.webp";
import Image3 from "@/assets/download.png";

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
        <div className="sm:pt-30 pt-8  py-20  max-w-6xl mx-auto px-4 ">
          <div className="pb-8">
            <div className="flex justify-center">
              <h1 className=" dark:text-white sm:text-6xl font-mono text-2xl text-slate-700">
                How SmartClip Works
              </h1>
            </div>


            <div className="sm:mt-20 mt-8 font-semibold lg:mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 justify-center">
              <StepCard
                step="Step 1"
                title="Provide the Link"
                description="Simply paste the URL of any YouTube video you want to analyze into the designated field."
                image={Image2}
              />
              <StepCard
                step="Step 2"
                title="Define Your Focus"
                description="Pinpoint the exact segment you're interested in by setting a time range and download."
                image={Image}
              />
              <StepCard
                step="Step 3"
                title="Get Instant Insights"
                description="Download your new, shorter clip and receive a clear, AI-generated explanation of its content."
                image={Image3}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Steps;
