const Features = () => {
    const features = [
      "Analytics",
      "Image Q&A",
      "AI-Powered Content Delivery",
      "One-Click Campaign Reminders",
      
      "Analytics",
      "Image Q&A",
      "AI-Powered Content Delivery",
      "One-Click Campaign Reminders",
    ];
  
    return (
      <div className="mt-8 spectral-medium">
        <h1 className="mb-8">Our Top-Notch Features</h1>
  
        <div className="w-full inline-flex flex-nowrap p-2  overflow-hidden">
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
            {features.map((feature, idx) => (
              <li
                key={idx}
                className="text-slate-800 p-2 rounded-4xl bg-white whitespace-nowrap"
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  export default Features;
  