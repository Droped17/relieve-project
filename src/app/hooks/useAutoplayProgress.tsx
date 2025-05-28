"use client"

import { EmblaCarouselType } from 'embla-carousel';
import { RefObject, useEffect, useState } from 'react';

// OLD (causing the error)
// export const useAutoplayProgress = (
//   emblaApi: EmblaCarouselType | undefined,
//   progressNode: RefObject<HTMLElement> // <--- This is the problematic part
// ) => {
//   // ... implementation
// }

// NEW (Fixing the type)
export const useAutoplayProgress = (
  emblaApi: EmblaCarouselType | undefined,
  // The progressNode can be HTMLDivElement or null initially
  progressNode: RefObject<HTMLDivElement | null> // <--- Updated type
) => {
  const [showProgress, setShowProgress] = useState(false); // Example state

  useEffect(() => {
    if (!emblaApi || !progressNode.current) {
      // Handle cases where emblaApi or the DOM node is not yet available
      setShowProgress(false);
      return;
    }

    // Now progressNode.current is guaranteed to be HTMLDivElement inside this block
    const progressBar = progressNode.current;

    // Your autoplay progress logic here
    const updateProgress = () => {
      // Example: calculate progress based on Embla state
      const progress = emblaApi.scrollProgress();
      progressBar.style.width = `${progress * 100}%`;
    };

    emblaApi.on('scroll', updateProgress);
    emblaApi.on('reInit', updateProgress);
    updateProgress(); // Initial update

    // Example logic to show/hide based on autoplay status
    const toggleProgressVisibility = () => {
        // You'd likely get autoplay state from emblaApi or another hook
        // For demonstration, let's just say it's always shown when the ref is active.
        setShowProgress(true);
    };

    emblaApi.on('autoplay:play', toggleProgressVisibility);
    emblaApi.on('autoplay:stop', () => setShowProgress(false));


    return () => {
      emblaApi.off('scroll', updateProgress);
      emblaApi.off('reInit', updateProgress);
      emblaApi.off('autoplay:play', toggleProgressVisibility);
      emblaApi.off('autoplay:stop', () => setShowProgress(false));
    };
  }, [emblaApi, progressNode]); // Include progressNode in dependencies if its ref changes

  // Return values (e.g., a boolean to control visibility in the component)
  return { showAutoplayProgress: showProgress };
};