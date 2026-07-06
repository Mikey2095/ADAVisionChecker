/**
 * SplashScreen
 *
 * Renders the Figma "Home page/Desktop" or "Home page/Mobile" design
 * for ~3.5 s, then fades out to reveal the app.
 *
 * Motion context — "Pattern Refraction" (ELLIPSE) node:
 *   REFRACTION_INTENSITY keyframes (Figma glass-refraction property)
 *   → approximated as CSS opacity on [data-name="Pattern Refraction"] wrappers
 *
 *   Desktop  (timelineDurationMs: 4 000 ms):
 *     t =    0 ms  →  intensity 100  (opacity 1)
 *     t =  801 ms  →  intensity   0  (opacity 0)   = 20.025 %
 *     t = 2 000 ms →  intensity 100  (opacity 1)   = 50 %
 *     t = 4 000 ms →  hold at 100               = 100 %
 *   easing: cubic-bezier(0.5, 0, 0.5, 1)   [from motion context]
 *
 *   Mobile   (timelineDurationMs: 2 000 ms):
 *     t =    0 ms  →  intensity 100  (opacity 1)
 *     t =  801 ms  →  intensity   0  (opacity 0)   = 40.05 %
 *     t = 2 000 ms →  intensity 100  (opacity 1)   = 100 %
 *   easing: cubic-bezier(0.5, 0, 0.5, 1)
 *
 * 3-keyframe tracks → keyframe-array form (not spring physics per skill rules).
 */

import { useState, useEffect } from 'react';
import HomePageDesktop from '../../imports/HomePageDesktop/index';
import HomePageMobile from '../../imports/HomePageMobile/index';

// Canvas sizes taken from each design's background SVG viewBox
const DESKTOP_W = 1000;
const DESKTOP_H = 1000;
const MOBILE_W  = 393;
const MOBILE_H  = 852;

// Milliseconds before the splash begins fading
const HOLD_MS  = 3200;
// Milliseconds for the fade-out transition
const FADE_MS  = 700;

// ── CSS keyframe animation injected once ─────────────────────────────────────
const SPLASH_CSS = `
  @keyframes refraction-desktop {
    0%      { opacity: 1; }
    20.025% { opacity: 0; }
    50%     { opacity: 1; }
    100%    { opacity: 1; }
  }
  @keyframes refraction-mobile {
    0%     { opacity: 1; }
    40.05% { opacity: 0; }
    100%   { opacity: 1; }
  }

  /* Target both the solid inner circle and the outer glow wrapper */
  .splash-desktop [data-name="Pattern Refraction"] {
    animation: refraction-desktop 4s cubic-bezier(0.5,0,0.5,1) 1 forwards;
  }
  .splash-mobile [data-name="Pattern Refraction"] {
    animation: refraction-mobile 2s cubic-bezier(0.5,0,0.5,1) 1 forwards;
  }

  /* Accessibility: disable motion for users who prefer reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .splash-desktop [data-name="Pattern Refraction"],
    .splash-mobile  [data-name="Pattern Refraction"] {
      animation: none !important;
    }
  }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function calcLayout() {
  if (typeof window === 'undefined') return { isMobile: false, scale: 1 };
  const isMobile = window.innerWidth < 768;
  const dw = isMobile ? MOBILE_W : DESKTOP_W;
  const dh = isMobile ? MOBILE_H : DESKTOP_H;
  const scale = Math.min(window.innerWidth / dw, window.innerHeight / dh);
  return { isMobile, scale };
}

// ── Component ─────────────────────────────────────────────────────────────────

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  // Initialise synchronously so the correct design renders on the first paint
  const [layout, setLayout] = useState(calcLayout);
  const [fading, setFading] = useState(false);

  // Recalculate on viewport resize
  useEffect(() => {
    const handler = () => setLayout(calcLayout());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Dismiss sequence: start fade at HOLD_MS, call onDone after fade completes
  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), HOLD_MS);
    const t2 = setTimeout(onDone, HOLD_MS + FADE_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  const { isMobile, scale } = layout;
  const designW = isMobile ? MOBILE_W  : DESKTOP_W;
  const designH = isMobile ? MOBILE_H  : DESKTOP_H;

  return (
    <>
      <style>{SPLASH_CSS}</style>

      {/*
        Fixed full-viewport overlay. The main app renders underneath so it is
        instantly visible once this fades out — no layout shift on dismiss.
      */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0c0e14',
          opacity: fading ? 0 : 1,
          transition: `opacity ${FADE_MS}ms ease-out`,
          pointerEvents: fading ? 'none' : 'auto',
        }}
      >
        {/*
          Scale the fixed-pixel Figma design to fill the viewport.
          The design uses absolute pixel coordinates, so we scale the entire
          canvas rather than trying to reflow absolute positions.
        */}
        <div
          className={isMobile ? 'splash-mobile' : 'splash-desktop'}
          style={{
            width: designW,
            height: designH,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          {isMobile ? <HomePageMobile /> : <HomePageDesktop />}
        </div>
      </div>
    </>
  );
}
