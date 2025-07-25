import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const Ai = () => {
  return (
    <motion.section
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="bg-white dark:bg-[#050505] font-semibold text-orange-900 dark:text-orange-100">
      <div className="max-w-7xl  sm:mx-auto mx-2 px-4 sm:pt-30 pt-20 sm:pb-40 pb-20 p-12 rounded-4xl   bg-gradient-to-b from-orange-100 to-white dark:from-[#121212] dark:to-[#050505] ">
        <h1 className="text-center spectral-bold  sm:text-5xl md:text-6xl text-2xl text-slate-700 dark:text-slate-200">
          <span>Turn Your Content Into an</span>
          <br />
          <span>AI Assistant Today</span>
        </h1>
        <p className="text-center sm:text-lg text-sm p-4">
          No code. No prompt engineering. Just results.
        </p>
        <div className="sm:flex grid justify-center items-center gap-6 spectral-medium">
          <div>
            <input
              placeholder="Youtube URL"
              className="dark:shadow-slate-800 dark:text-grey-100 outline-none shadow-sm h-12 w-full sm:w-86 p-4 bg-white dark:bg-[#121212]   rounded-2xl"
            />
          </div>
          <button  className=" bg-orange-500 cursor-pointer  hover:bg-amber-500 transition duration-300 text-white h-12 sm:w-30 w-full  rounded-2xl ">
            <Link to={"/clipVideos"}>Get Started</Link>
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default Ai;
