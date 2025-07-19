import { useState, useEffect, useRef } from "react";

const STEPS = [
  "Preparing your request…",
  "Downloading the video section…",
  "Creating your high-quality clip…",
  "Assembling final video file…",
  "Finalizing your download…",
];

export function useVideoProcessing(isActive: boolean) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const prevActive = useRef(isActive);

  useEffect(() => {
    // when isActive turns true (i.e. modal opened), reset state
    if (!prevActive.current && isActive) {
      setIndex(0);
      setDone(false);
    }
    prevActive.current = isActive;

    if (!isActive) return;

    const interval = setInterval(() => {
      setIndex((i) => {
        if (i + 1 >= STEPS.length) {
          clearInterval(interval);
          setDone(true);
          return i;
        }
        return i + 1;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [isActive]);

  return {
    currentStep: STEPS[index],
    progress: Math.round(((index + 1) / STEPS.length) * 100),
    done,
  };
}
