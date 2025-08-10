import Lenis from "lenis";

// Create a single Lenis instance shared across the app
export const lenis = new Lenis({
  // Lower duration reduces latency while staying smooth; tune as desired
  duration: 1.1,
  // Ease-in-out cubic, smooth on high refresh panels
  easing: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  gestureOrientation: "vertical",
  smoothWheel: true,
  smoothTouch: true,
  syncTouch: true,
  normalizeWheel: true,
  wheelMultiplier: 1.0,
  touchMultiplier: 1.0,
});

// High refresh rate friendly RAF loop
function onRaf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(onRaf);
}

requestAnimationFrame(onRaf);

// Optional: expose helpers
export function scrollToTopSmooth() {
  lenis.scrollTo(0, { immediate: false });
}


