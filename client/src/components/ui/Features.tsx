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

      <div className=" text-center">
       

        <div className="w-full sm:pt-8 pt-14 inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-[infinite-scroll_40s_linear_infinite]">
            {/* Render the list twice for a seamless loop */}
            {features.map((feature, idx) => (
              <li
                key={idx}
                className="bg-white/50 dark:bg-black/50   rounded-full px-6 py-2 text-gray-700 dark:text-neutral-300 whitespace-nowrap transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800"
              >
                {feature}
              </li>
            ))}

            {features.map((feature, idx) => (
              <li
                key={idx}
                className="bg-white/50 dark:bg-black/50   rounded-full px-6 py-2 text-gray-700 dark:text-neutral-300 whitespace-nowrap transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800"
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
