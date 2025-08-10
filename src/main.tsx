import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import Lenis from 'lenis';

createRoot(document.getElementById("root")!).render(<App />);

// High refresh-rate friendly Lenis setup
const lenis = new Lenis({
  // Keep programmatic scrolls smooth, but leave wheel/touch native for a normal feel
  duration: 0.7,
  easing: (t: number) => t,
  gestureOrientation: 'vertical',
  smoothWheel: false,
  smoothTouch: false,
  normalizeWheel: false,
  syncTouch: false,
  wheelMultiplier: 1.0,
  touchMultiplier: 1.0,
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Global API: allow components to request Lenis scrolls
window.addEventListener('lenis:scrollTo', (e: Event) => {
  const ce = e as CustomEvent<{ target: number | string | Element; options?: Record<string, unknown> }>;
  const target = ce.detail?.target ?? 0;
  const options = ce.detail?.options ?? { immediate: false };
  // @ts-ignore - lenis types accept Element | number | string
  lenis.scrollTo(target, options);
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            if (registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                registration.waiting.addEventListener('statechange', (e) => {
                    // @ts-ignore
                    if (e?.target?.state === 'activated') {
                        window.location.reload();
                    }
                });
            }
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (!newWorker) return;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                        }
                    }
                });
            });
        }).catch((err) => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
