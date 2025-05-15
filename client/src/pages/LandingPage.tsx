import Ai from "@/components/Ai";
import { Footer } from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import Steps from "@/components/Steps";
import Testimonials from "@/components/Testimonials";
import UseCases from "@/components/UseCases";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const theme = localStorage.getItem("theme");

  return (
    <div className="relative h-screen w-full overflow-x-hidden">
      {/* LEFT SIDE SHAPE */}
      <div className="absolute top-0 left-0 h-[100vh] md:h-[150vh] lg:h-[180vh] w-[12vw] z-10 dark:hidden">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 800"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 left-0 h-full w-full"
        >
          <path
            d="M0 0 C0 0, 150 100, 180 400 C200 650, 120 780, 0 800 L0 0 Z"
            fill="url(#skin_tone_left)"
          />
          <defs>
            <linearGradient
              id="skin_tone_left"
              x1="100"
              y1="0"
              x2="100"
              y2="800"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="rgba(255,224,189,0)" />
              <stop offset="0.5" stopColor="rgba(255,224,189,0.7)" />
              <stop offset="1" stopColor="rgba(255,224,189,0)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* RIGHT SIDE SHAPE */}
      <div className="absolute top-0 right-0 h-[100vh] md:h-[150vh] lg:h-[180vh] w-[12vw] z-10 dark:hidden">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 800"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 right-0 h-full w-full"
        >
          <path
            d="M200 0 C200 0, 80 100, 40 400 C20 600, 100 780, 200 800 L200 0 Z"
            fill="url(#skin_tone_right)"
          />
          <defs>
            <linearGradient
              id="skin_tone_right"
              x1="100"
              y1="0"
              x2="100"
              y2="800"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="rgba(255,224,189,0)" />
              <stop offset="0.5" stopColor="rgba(255,224,189,0.7)" />
              <stop offset="1" stopColor="rgba(255,224,189,0)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div
        className={`
        absolute top-0 z-[-1] h-screen w-screen rotate-180 transform
    bg-white
    bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(255,224,189,0.5)_100%)]
        dark:bg-neutral-900
        dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]

        `}
      ></div>

      <Navbar />
      <HeroSection />
      <Steps />
      <UseCases />
      <Testimonials />
      <Ai />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
