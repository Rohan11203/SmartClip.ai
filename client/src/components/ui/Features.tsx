const Features = () => {
  const features = [
    "Clip Selector",
    "GPT Generated Natural Language Summary",
    "Interactive Q&A Overlay",
    "Direct Download of Clipped Video",

    "Clip Selector",
    "GPT Generated Natural Language Summary",
    "Interactive Q&A Overlay",
    "Direct Download of Clipped Video",
  ];

  return (
    <>
      {/* The keyframes for the infinite scroll animation.
       */}
      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      <div className="sm:mt-4 mt-14 text-center">
        <h2 className="text-3xl font-bold text-gray-600 dark:text-neutral-200">
          Our Top-Notch Features
        </h2>

        <div className="w-full pt-8 inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-[infinite-scroll_40s_linear_infinite]">
            {/* Render the list twice for a seamless loop */}
            {features.map((feature, idx) => (
              <li
                key={idx}
                className="bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-neutral-800 rounded-full px-6 py-2 text-gray-700 dark:text-neutral-300 whitespace-nowrap transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800"
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Features;
