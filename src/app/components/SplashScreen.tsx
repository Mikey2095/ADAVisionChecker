/**
 * SplashScreen
 *
 * Desktop — HomePageDesktop-3 (1000×1000 canvas)
 * Mobile  — HomePageMobile-4  (393×852 canvas)
 *
 * The Figma export sets `transform-[translateY(-50%)]` on the card without the
 * matching `translateX(-50%)`, so the card starts at left=50% of the canvas
 * instead of being centered. We fix this with a precise CSS selector targeting
 * only the direct-child card Frame of the page root, not any nested Frames
 * (icon, spacers, divider, button).
 *
 * A transparent hit-target <button> is overlaid in design-space over Frame7
 * (the ENTER button inside the card) to capture clicks.
 */

import { useState, useEffect } from 'react';
import HomePageDesktop from '../../imports/HomePageDesktop-3/index';
import HomePageMobile  from '../../imports/HomePageMobile-4/index';

// ── Canvas sizes ──────────────────────────────────────────────────────────────
const DESKTOP_W = 1000;
const DESKTOP_H = 1000;
const MOBILE_W  = 393;
const MOBILE_H  = 852;

// ── Timing ────────────────────────────────────────────────────────────────────
const FADE_MS = 700;

// ── CSS fix ───────────────────────────────────────────────────────────────────
// Only target the card Frame that is a direct child of the page root element.
// This avoids affecting Frame1 (icon), Frame2/6 (spacers), Frame3 (divider), Frame7 (button).
const SPLASH_FIX_CSS = `
  [data-name="Home page/Desktop"] > [data-name="Frame"],
  [data-name="Home page/Mobile"]  > [data-name="Frame"] {
    transform: translate(-50%, -50%) !important;
  }
`;

// ── ENTER button hit-target coordinates (design-space pixels) ─────────────────
// Desktop: card 640px wide, px-64, py-56. Estimated card height ≈ 568px.
//   Card centered at (500, 500): left=180, top=216.
//   Frame7 (h-58) above py-56 bottom: top = 216 + 568 − 56 − 58 = 670
const DESKTOP_BTN = { left: 244, top: 670, width: 512, height: 58 };

// Mobile: card 345px wide, px-40, py-44. Estimated card height ≈ 461px.
//   Card centered at (196.5, 426): left=24, top=195.5.
//   Frame7 (h-52) above py-44 bottom: top = 195.5 + 461 − 44 − 52 = 560.5
const MOBILE_BTN  = { left: 64, top: 561, width: 265, height: 52 };

// ── Layout helper ─────────────────────────────────────────────────────────────

function calcLayout() {
  if (typeof window === 'undefined') return { isMobile: false, scale: 1 };
  const isMobile = window.innerWidth < 768;
  const dw = isMobile ? MOBILE_W : DESKTOP_W;
  const dh = isMobile ? MOBILE_H : DESKTOP_H;
  return { isMobile, scale: Math.min(window.innerWidth / dw, window.innerHeight / dh) };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [layout, setLayout] = useState(calcLayout);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const h = () => setLayout(calcLayout());
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const handleEnter = () => {
    if (fading) return;
    setFading(true);
    setTimeout(onDone, FADE_MS);
  };

  const { isMobile, scale } = layout;
  const designW = isMobile ? MOBILE_W : DESKTOP_W;
  const designH = isMobile ? MOBILE_H : DESKTOP_H;
  const btn     = isMobile ? MOBILE_BTN : DESKTOP_BTN;

  return (
    <>
      <style>{SPLASH_FIX_CSS}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f4f4ff',
          opacity: fading ? 0 : 1,
          transition: `opacity ${FADE_MS}ms ease-out`,
          pointerEvents: fading ? 'none' : 'auto',
        }}
      >
        {/* Fixed-size design canvas, scaled to fit viewport */}
        <div
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

          {/* Transparent hit-target exactly covering Frame7 (ENTER button) */}
          <button
            onClick={handleEnter}
            aria-label="Enter"
            style={{
              position: 'absolute',
              left: btn.left,
              top: btn.top,
              width: btn.width,
              height: btn.height,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 14,
            }}
          />
        </div>
      </div>
    </>
  );
}
