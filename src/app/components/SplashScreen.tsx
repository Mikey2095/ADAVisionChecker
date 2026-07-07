/**
 * SplashScreen
 *
 * Desktop — HomePageDesktop (1000×1000 canvas)
 * Mobile  — HomePageMobile-1 (393×852 canvas, larger typography)
 *           The orb / Group element is replaced with Loader.mp4
 *
 * Motion context — "Pattern Refraction" (ELLIPSE) node (mobile: 2185:273)
 *   REFRACTION_INTENSITY approximated as opacity on [data-name="Pattern Refraction"]
 *
 *   Desktop (4 000 ms):  0 % → 1   |  20.025 % → 0  |  50 % → 1  |  100 % → 1
 *   Mobile  (2 000 ms):  0 % → 1   |  40.05 %  → 0  |  100 % → 1
 *   Easing: cubic-bezier(0.5, 0, 0.5, 1)
 *
 * Note: Pattern Refraction elements on mobile are visually covered by the video,
 * but the animation still runs underneath (harmless).
 */

import { useState, useEffect } from 'react';
import HomePageDesktop from '../../imports/HomePageDesktop/index';
import HomePageMobile  from '../../imports/HomePageMobile-1/index';
import loaderVideo     from '../../imports/Loader-1.mp4';

// ── Canvas sizes (taken from each design's background SVG viewBox) ────────────
const DESKTOP_W = 1000;
const DESKTOP_H = 1000;
const MOBILE_W  = 393;
const MOBILE_H  = 852;

// Video covers the full orb group extent in the 393×852 design space.
// Outer glow circle: left=85.5 top=129 size=221.9 (from HomePageMobile-1 Group)
const VIDEO_LEFT = 85.5;
const VIDEO_TOP  = 129;
const VIDEO_SIZE = 221.9;

// ── Timing ────────────────────────────────────────────────────────────────────
const FADE_MS = 700;    // ms for fade-out transition after ENTER is pressed

// ── CSS keyframe animation ────────────────────────────────────────────────────
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
  .splash-desktop [data-name="Pattern Refraction"] {
    animation: refraction-desktop 4s cubic-bezier(0.5,0,0.5,1) 1 forwards;
  }
  .splash-mobile [data-name="Pattern Refraction"] {
    animation: refraction-mobile 2s cubic-bezier(0.5,0,0.5,1) 1 forwards;
  }
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

  // ENTER button is the only gate — no auto-dismiss timer
  const handleEnter = () => {
    if (fading) return;
    setFading(true);
    setTimeout(onDone, FADE_MS);
  };

  const { isMobile, scale } = layout;
  const designW = isMobile ? MOBILE_W : DESKTOP_W;
  const designH = isMobile ? MOBILE_H : DESKTOP_H;

  return (
    <>
      <style>{SPLASH_CSS}</style>

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
        {/* Scaled design canvas */}
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

          {/*
            Mobile only: Loader.mp4 replaces the orb / Group element.
            Positioned in design-space coordinates to exactly cover the
            outer glow circle (left=85.5, top=129, size=221.9).
            The underlying Pattern Refraction SVG circles are hidden beneath.
          */}
          {isMobile && (
            <div
              style={{
                position: 'absolute',
                left: VIDEO_LEFT,
                top: VIDEO_TOP,
                width: VIDEO_SIZE,
                height: VIDEO_SIZE,
                borderRadius: '50%',
                overflow: 'hidden',
              }}
            >
              <video
                src={loaderVideo}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          {/*
            ENTER button — from Frame1 (desktop) / Frame3 (mobile) in the imports.
            Positioned in design-space so it sits exactly where Figma placed it.
            Clicking immediately dismisses the splash.

            Desktop (Frame1):
              left: calc(50% + 0.5px), top: calc(50% + 404px)
              translate: -50% -50%  →  center ≈ (500, 904)
              w: 629px  h: 50px  rounded: 16.639px

            Mobile (Frame3):
              left: 50%, top: 720px
              translate: -50%
              w: 243px  h: 56px  rounded: 16.639px
          */}
          {!isMobile ? (
            <button
              onClick={handleEnter}
              style={{
                position: 'absolute',
                left: 'calc(50% + 0.5px)',
                top: 'calc(50% + 404px)',
                transform: 'translate(-50%, -50%)',
                width: 629,
                height: 50,
                backgroundColor: 'white',
                borderRadius: 16.639,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 5.546,
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: 32.906,
                lineHeight: '14.42px',
                color: 'black',
                letterSpacing: 0,
              }}>
                ENTER
              </span>
            </button>
          ) : (
            <button
              onClick={handleEnter}
              style={{
                position: 'absolute',
                left: '50%',
                top: 720,
                transform: 'translateX(-50%)',
                width: 243,
                height: 56,
                backgroundColor: 'white',
                borderRadius: 16.639,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 5.546,
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: 32.906,
                lineHeight: '14.42px',
                color: 'black',
                letterSpacing: 0,
              }}>
                ENTER
              </span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
