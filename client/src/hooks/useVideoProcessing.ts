// src/hooks/useVideoProcessing.js
import { useState, useEffect, useRef } from 'react';

const STEPS = [
  "Extracting audio…",
  "Transcoding video…",
  "Muxing streams…",
  "Optimizing bitrate…",
  "Finalizing…"
];

export function useVideoProcessing(isActive:boolean) {
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
      setIndex(i => {
        if (i + 1 >= STEPS.length) {
          clearInterval(interval);
          setDone(true);
          return i;
        }
        return i + 1;
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [isActive]);

  return {
    currentStep: STEPS[index],
    progress: Math.round(((index + 1) / STEPS.length) * 100),
    done
  };
}
