import StepCard from "./ui/StepCard";

const Steps = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-neutral-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="pt-50  max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-center mb-10">
            <h1 className="spectral-bold dark:text-white text-5xl text-slate-700">
              How SmartClip Works
            </h1>
          </div>
          <div className="flex gap-8">
            <StepCard title={"Paste YouTube Link"} description={"Drop your link into SmartClip's input box."} step={"Step 1"} />
            <StepCard title={"Set Time Range & Prompt"} description={"Drop your link into SmartClip's input box."} step={"Step 2"} />
            <StepCard title={"Download and Explanation"} description={"Get your downloadable clip and an AI summary instantly."} step={"Step 2"}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Steps;
