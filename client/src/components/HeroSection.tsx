import Features from "./ui/Features";

const HeroSection = () => {
  return (
    <div className="relative max-w-5xl mx-auto px-4 text-center">
      <div className="flex flex-col gap-6">
        <div className="mt-30 ">
          <span className="bg-slate-100 dark:text-black rounded-3xl spectral-light p-2">
            🤩 1000+ Successfully Downloads
          </span>
        </div>
        <h1 className="mt-4 spectral-bold dark:text-white text-6xl text-slate-700">
          Clip YouTube Videos. <br />
          <span className=" tracking-wider">Let AI Explain the Rest.</span>
        </h1>

        <p className="spectral-medium text-lg">
          SmartClip lets you extract clips from any YouTube video and get
          instant AI-generated explanations
          <br />
           — perfect for learning, sharing, or
          summarizing content.
        </p>

        <div className=" spectral-medium">
          <input
            placeholder="Enter Your Email"
            className="dark:shadow-slate-800 outline-none shadow-md h-14 p-4 bg-white dark:bg-[#121212]  rounded-4xl mr-4 w-86"
          />
          <button className=" bg-orange-500 text-white h-14 w-26 rounded-4xl">
            Join Beta
          </button>
        </div>

        <Features />
      </div>
    </div>
  );
};

export default HeroSection;
