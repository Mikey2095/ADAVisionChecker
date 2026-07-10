/**
 * SplashScreen — fully native rebuild.
 *
 * Animations sourced from motion context:
 *   HomePageDesktop-3/motion-context.json  (nodes 2218:923-943)
 *   HomePageMobile-4/motion-context.json   (nodes 2218:945-963)
 *
 * Background ellipses: scale 0.5→1 (spring) + opacity stagger, repeat Infinity.
 * Card wrapper:        opacity/y/scale enter, play once.
 * Card content:        8-element staggered fade-up (opacity + y), play once.
 *
 * Card is centered via flexbox — no absolute-position transform bugs.
 * ENTER button is the only gate; clicking triggers a fade-out then onDone().
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

// ── Canvas sizes ──────────────────────────────────────────────────────────────
const DESKTOP_W = 1000;
const DESKTOP_H = 1000;
const MOBILE_W  = 393;
const MOBILE_H  = 852;

const FADE_MS = 700;

// ── Shared spring easing from motion context (3-keyframe scale tracks) ────────
const SPRING_EASE = (t: number) =>
  1 - Math.exp(-t * 7.6657) * (Math.cos(t * 6.7605) + 1.1339 * Math.sin(t * 6.7605));

// ── Layout helper ─────────────────────────────────────────────────────────────
function calcLayout() {
  if (typeof window === 'undefined') return { isMobile: false, scale: 1 };
  const isMobile = window.innerWidth < 768;
  const dw = isMobile ? MOBILE_W : DESKTOP_W;
  const dh = isMobile ? MOBILE_H : DESKTOP_H;
  return { isMobile, scale: Math.min(window.innerWidth / dw, window.innerHeight / dh) };
}

// ── ADA icon — inline SVG, sizes from Figma Frame1 components ────────────────
function ADAIcon({ mobile }: { mobile: boolean }) {
  const s  = mobile ? 88 : 108;    // icon rect size
  const vb = mobile ? 116 : 140;   // svg viewBox (includes shadow bleed)
  const x  = mobile ? 14 : 16;
  const y  = mobile ? 10 : 12;
  const rx = mobile ? 22 : 28;
  const blur = mobile ? 7 : 8;
  const spread = mobile ? 14 : 16;
  const fid = mobile ? 'f-m' : 'f-d';
  const gid = mobile ? 'g-m' : 'g-d';
  // Gradient transform for rect: matrix(0 h*0.9 h*0.5 h*0.4 cx cy)
  const h = s;
  const gm = mobile
    ? `matrix(0 79.2 44 35.2 58 18.8)`
    : `matrix(0 97.2 54 43.2 70 22.8)`;

  // paths: desktop uses svg-s29ps78p52, mobile uses svg-qifya27mft
  const paths = mobile
    ? [
        'M49.7948 53.4451L58 38H35.7056C35.1462 38 34.6318 38.3065 34.3655 38.7985L26 54.254H48.4491C49.0128 54.254 49.5304 53.9428 49.7948 53.4451Z',
        'M49.7989 69.2089L58 54.254H35.6919C35.1398 54.254 34.6309 54.5526 34.3616 55.0345L26 70H48.4628C49.0192 70 49.5314 69.6967 49.7989 69.2089Z',
        'M66.2052 53.4451L58 38H80.2944C80.8538 38 81.3682 38.3065 81.6345 38.7985L90 54.254H67.5509C66.9872 54.254 66.4696 53.9428 66.2052 53.4451Z',
        'M66.2011 69.2089L58 54.254H80.3081C80.8602 54.254 81.3691 54.5526 81.6384 55.0345L90 70H67.5372C66.9808 70 66.4686 69.6967 66.2011 69.2089Z',
      ]
    : [
        'M60.2563 65.341L70 47H43.5254C42.8612 47 42.2503 47.364 41.9341 47.9482L32 66.3016H58.6583C59.3277 66.3016 59.9423 65.9321 60.2563 65.341Z',
        'M60.2612 84.0606L70 66.3016H43.5091C42.8535 66.3016 42.2492 66.6562 41.9294 67.2285L32 85H58.6746C59.3353 85 59.9435 84.6399 60.2612 84.0606Z',
        'M79.7437 65.341L70 47H96.4746C97.1388 47 97.7497 47.364 98.0659 47.9482L108 66.3016H81.3417C80.6723 66.3016 80.0577 65.9321 79.7437 65.341Z',
        'M79.7388 84.0606L70 66.3016H96.4909C97.1465 66.3016 97.7508 66.6562 98.0706 67.2285L108 85H81.3254C80.6647 85 80.0565 84.6399 79.7388 84.0606Z',
      ];

  return (
    <div style={{ width: s, height: s, flexShrink: 0, position: 'relative' }}>
      {/* negative bleed for the drop-shadow filter */}
      <div style={{ position: 'absolute', inset: `${-spread * 0.4}px ${-spread * 0.5}px ${-spread * 0.7}px ${-spread * 0.5}px` }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${vb} ${vb}`} fill="none" preserveAspectRatio="none">
          <defs>
            <filter id={fid} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"
              x="0" y="0" width={vb} height={vb}>
              <feFlood floodOpacity="0" result="bg" />
              <feColorMatrix in="SourceAlpha" result="alpha" type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation={blur} />
              <feComposite in2="alpha" operator="out" />
              <feColorMatrix type="matrix"
                values="0 0 0 0 0.47 0 0 0 0 0.44 0 0 0 0 0.97 0 0 0 0.2 0" />
              <feBlend in2="bg" mode="normal" result="shadow" />
              <feBlend in="SourceGraphic" in2="shadow" mode="normal" />
            </filter>
            <radialGradient id={gid} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1"
              gradientTransform={gm}>
              <stop stopColor="#EAE8FD" />
              <stop offset="1" stopColor="#D6D2FB" />
            </radialGradient>
          </defs>
          <g filter={`url(#${fid})`}>
            <rect x={x} y={y} width={s} height={s} rx={rx} fill={`url(#${gid})`} shapeRendering="crispEdges" />
            {paths.map((d, i) => <path key={i} d={d} fill="#7C6FF7" />)}
          </g>
        </svg>
      </div>
    </div>
  );
}

// ── Animated background ellipse (scale + opacity stagger) ─────────────────────
interface EllipseProps {
  left: number; top: number; size: number;
  fill: string;       // CSS gradient or color string
  opacityTarget: number;
  delay: number;      // seconds
  repeat?: number | 'Infinity';
  repeatType?: 'reverse' | 'loop';
}
function BgEllipse({ left, top, size, fill, opacityTarget, delay, repeat = Infinity, repeatType = 'reverse' }: EllipseProps) {
  const repeatVal = repeat === 'Infinity' ? Infinity : repeat as number;
  return (
    <motion.div
      style={{
        position: 'absolute', left, top,
        width: size, height: size,
        borderRadius: '50%',
        background: fill,
        transformOrigin: 'center center',
      }}
      initial={{ opacity: 0, scaleX: 0.5, scaleY: 0.5 }}
      animate={{
        opacity: [0, 0, opacityTarget, opacityTarget],
        scaleX:  [0.5, 0.5, 1, 1],
        scaleY:  [0.5, 0.5, 1, 1],
      }}
      transition={{
        opacity: { duration: 2, times: [0, delay / 2, delay / 2 + 0.5, 1], ease: ['linear', 'easeOut', 'linear'], repeat: repeatVal, repeatType },
        scaleX:  { duration: 2, times: [0, delay / 2, delay / 2 + 0.5, 1], ease: ['linear', SPRING_EASE, 'linear'], repeat: repeatVal, repeatType },
        scaleY:  { duration: 2, times: [0, delay / 2, delay / 2 + 0.5, 1], ease: ['linear', SPRING_EASE, 'linear'], repeat: repeatVal, repeatType },
      }}
    />
  );
}

// ── Staggered card-content row ────────────────────────────────────────────────
function FadeUp({ times, children, style }: {
  times: [number, number, number, number];
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      style={{ width: '100%', ...style }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: [0, 0, 1, 1], y: [20, 20, 0, 0] }}
      transition={{
        opacity: { duration: 2, times, ease: ['linear', 'easeOut', 'linear'] },
        y:       { duration: 2, times, ease: ['linear', [0.16, 1, 0.3, 1] as any, 'linear'] },
      }}
    />
  );
}

// ── Card content — same for desktop/mobile, different metrics ────────────────
interface CardProps {
  mobile: boolean;
  onEnter: () => void;
}
function SplashCard({ mobile, onEnter }: CardProps) {
  const px = mobile ? 40 : 64;
  const py = mobile ? 44 : 56;
  const rounded = mobile ? 28 : 32;
  const adaSize = mobile ? 68 : 88;
  const vcSize  = mobile ? 11 : 13;
  const vcTrack = mobile ? 5 : 6;
  const descSize = mobile ? 14 : 17;
  const descLH   = mobile ? '22px' : '28px';
  const spacer   = mobile ? 28 : 36;
  const dotSize  = mobile ? 6 : 8;
  const btnH     = mobile ? 52 : 58;
  const btnR     = mobile ? 14 : 16;
  const cardW    = mobile ? 345 : 640;
  const shadow   = mobile
    ? '0px 2px 12px 0px rgba(0,0,0,0.05), 0px 8px 32px 0px rgba(120,112,247,0.1)'
    : '0px 2px 16px 0px rgba(0,0,0,0.06), 0px 8px 40px 0px rgba(120,112,247,0.1)';

  // Stagger times from motion context (desktop 2218:929-940 / mobile 2218:947-958)
  const t = (d: number): [number, number, number, number] => [0, d, d + 0.25, 1];

  return (
    <motion.div
      style={{
        background: 'white',
        borderRadius: rounded,
        boxShadow: shadow,
        width: cardW,
        paddingLeft: px,
        paddingRight: px,
        paddingTop: py,
        paddingBottom: py,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexShrink: 0,
      }}
      initial={{ opacity: 0, scaleX: 0.95, scaleY: 0.95, y: 40 }}
      animate={{ opacity: [0, 1, 1], scaleX: [0.95, 1, 1], scaleY: [0.95, 1, 1], y: [40, 0, 0] }}
      transition={{
        opacity: { duration: 2, times: [0, 0.4, 1], ease: ['easeOut', 'linear'] },
        scaleX:  { duration: 2, times: [0, 0.4, 1], ease: [[0.16, 1, 0.3, 1] as any, 'linear'] },
        scaleY:  { duration: 2, times: [0, 0.4, 1], ease: [[0.16, 1, 0.3, 1] as any, 'linear'] },
        y:       { duration: 2, times: [0, 0.4, 1], ease: [[0.16, 1, 0.3, 1] as any, 'linear'] },
      }}
    >
      {/* Icon — stagger 0.15 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: [0, 0, 1, 1], y: [20, 20, 0, 0] }}
        transition={{ opacity: { duration: 2, times: t(0.15), ease: ['linear', 'easeOut', 'linear'] }, y: { duration: 2, times: t(0.15), ease: ['linear', [0.16, 1, 0.3, 1] as any, 'linear'] } }}
      >
        <ADAIcon mobile={mobile} />
      </motion.div>

      {/* Spacer — stagger 0.21 */}
      <motion.div
        style={{ height: spacer }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1] }}
        transition={{ opacity: { duration: 2, times: t(0.21), ease: ['linear', 'easeOut', 'linear'] } }}
      />

      {/* ADA — stagger 0.27 */}
      <motion.p
        style={{ fontSize: adaSize, fontWeight: 700, color: '#1a1a2e', letterSpacing: '-2px', lineHeight: 1, textAlign: 'center', width: '100%' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: [0, 0, 1, 1], y: [20, 20, 0, 0] }}
        transition={{ opacity: { duration: 2, times: t(0.27), ease: ['linear', 'easeOut', 'linear'] }, y: { duration: 2, times: t(0.27), ease: ['linear', [0.16, 1, 0.3, 1] as any, 'linear'] } }}
      >
        ADA
      </motion.p>

      {/* VISION CHECKER — stagger 0.33 */}
      <motion.p
        style={{ fontSize: vcSize, fontWeight: 600, color: '#9c97c0', letterSpacing: `${vcTrack}px`, textTransform: 'uppercase', textAlign: 'center', width: '100%' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: [0, 0, 1, 1], y: [20, 20, 0, 0] }}
        transition={{ opacity: { duration: 2, times: t(0.33), ease: ['linear', 'easeOut', 'linear'] }, y: { duration: 2, times: t(0.33), ease: ['linear', [0.16, 1, 0.3, 1] as any, 'linear'] } }}
      >
        VISION CHECKER
      </motion.p>

      {/* Divider — stagger 0.39 */}
      <motion.div
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: mobile ? 10 : 12, paddingTop: mobile ? 18 : 20, paddingBottom: mobile ? 18 : 20 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: [0, 0, 1, 1], y: [20, 20, 0, 0] }}
        transition={{ opacity: { duration: 2, times: t(0.39), ease: ['linear', 'easeOut', 'linear'] }, y: { duration: 2, times: t(0.39), ease: ['linear', [0.16, 1, 0.3, 1] as any, 'linear'] } }}
      >
        <div style={{ flex: 1, height: 1, background: '#e5e3f7' }} />
        <div style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: '#C4C0F0', flexShrink: 0 }} />
        <div style={{ flex: 1, height: 1, background: '#e5e3f7' }} />
      </motion.div>

      {/* Description — stagger 0.45 */}
      <motion.p
        style={{ fontSize: descSize, fontWeight: 400, color: '#6b7280', lineHeight: descLH, textAlign: 'center', width: '100%' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: [0, 0, 1, 1], y: [20, 20, 0, 0] }}
        transition={{ opacity: { duration: 2, times: t(0.45), ease: ['linear', 'easeOut', 'linear'] }, y: { duration: 2, times: t(0.45), ease: ['linear', [0.16, 1, 0.3, 1] as any, 'linear'] } }}
      >
        Simulate visual impairments, test contrast, and build inclusive digital experiences
      </motion.p>

      {/* Spacer — stagger 0.51 */}
      <motion.div
        style={{ height: spacer }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1] }}
        transition={{ opacity: { duration: 2, times: t(0.51), ease: ['linear', 'easeOut', 'linear'] } }}
      />

      {/* ENTER button — stagger 0.57 */}
      <motion.button
        onClick={onEnter}
        style={{
          width: '100%',
          height: btnH,
          background: '#1a1a2e',
          borderRadius: btnR,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0px 4px ${mobile ? 7 : 8}px rgba(26,26,46,0.2)`,
          flexShrink: 0,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: [0, 0, 1, 1], y: [20, 20, 0, 0] }}
        transition={{ opacity: { duration: 2, times: t(0.57), ease: ['linear', 'easeOut', 'linear'] }, y: { duration: 2, times: t(0.57), ease: ['linear', [0.16, 1, 0.3, 1] as any, 'linear'] } }}
      >
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: mobile ? 13 : 15,
          fontWeight: 600,
          color: 'white',
          letterSpacing: '3px',
          textTransform: 'uppercase',
        }}>
          ENTER
        </span>
      </motion.button>
    </motion.div>
  );
}

// ── Background scene for desktop ──────────────────────────────────────────────
function DesktopBackground() {
  const grad = (color: string, opacity: number) =>
    `radial-gradient(circle, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 100%)`;

  return (
    <>
      {/* SVG background gradient */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0 65 35 0 500 200)'><stop stop-color='rgba(237,238,255,1)' offset='0'/><stop stop-color='rgba(248,248,255,1)' offset='0.5'/><stop stop-color='rgba(255,255,255,1)' offset='1'/></radialGradient></defs></svg>\")" }} />

      {/* 2218:923 — top-left large, opacity→1, delay~0.05 */}
      <BgEllipse left={-80} top={-80} size={400} opacityTarget={1} delay={0.05}
        fill="radial-gradient(circle, rgba(199,195,245,0.20) 0%, transparent 70%)" />
      {/* 2218:924 — right tiny dot, opacity→0.6, delay~0.25 */}
      <BgEllipse left={880} top={200} size={6} opacityTarget={0.6} delay={0.25}
        fill="#C4C0F0" />
      {/* 2218:925 — top-right large, opacity→1, delay~0.4 */}
      <BgEllipse left={600} top={-60} size={300} opacityTarget={1} delay={0.4}
        fill="radial-gradient(circle, rgba(221,217,251,0.27) 0%, transparent 70%)" />
      {/* 2218:926 — left tiny dot, opacity→0.4, delay~0.55 */}
      <BgEllipse left={80} top={300} size={4} opacityTarget={0.4} delay={0.55}
        fill="#C4C0F0" />
      {/* 2218:927 — bottom-left dot, opacity→0.6, delay~0.7 */}
      <BgEllipse left={120} top={800} size={6} opacityTarget={0.6} delay={0.7}
        fill="#C4C0F0" />
      {/* 2218:942 — bottom-right large, opacity→1, delay~0.85 */}
      <BgEllipse left={700} top={600} size={380} opacityTarget={1} delay={0.85}
        fill="radial-gradient(circle, rgba(184,212,245,0.20) 0%, transparent 70%)" />
      {/* 2218:943 — right tiny dot, opacity→0.4, delay~1.0 */}
      <BgEllipse left={920} top={760} size={4} opacityTarget={0.4} delay={1.0}
        fill="#C4C0F0" />
    </>
  );
}

// ── Background scene for mobile ───────────────────────────────────────────────
function MobileBackground() {
  return (
    <>
      {/* SVG background gradient */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 393 852' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0 59.64 15.72 0 196.5 127.8)'><stop stop-color='rgba(237,238,255,1)' offset='0'/><stop stop-color='rgba(244,244,255,1)' offset='0.55'/><stop stop-color='rgba(255,255,255,1)' offset='1'/></radialGradient></defs></svg>\")" }} />

      {/* 2218:945 — top-left large, opacity→1, delay~0.05 */}
      <BgEllipse left={-60} top={-40} size={280} opacityTarget={1} delay={0.05}
        fill="radial-gradient(circle, rgba(199,195,245,0.25) 0%, transparent 70%)"
        repeat={Infinity} repeatType="loop" />
      {/* 2218:960 — bottom-left dot, opacity→0.5, delay~0.25 */}
      <BgEllipse left={36} top={700} size={5} opacityTarget={0.5} delay={0.25}
        fill="#C4C0F0" repeat={Infinity} repeatType="loop" />
      {/* 2218:961 — left tiny dot, opacity→0.4, delay~0.4 */}
      <BgEllipse left={24} top={200} size={3} opacityTarget={0.4} delay={0.4}
        fill="#C4C0F0" repeat={Infinity} repeatType="loop" />
      {/* 2218:962 — right dot, opacity→0.5, delay~0.55 */}
      <BgEllipse left={355} top={140} size={5} opacityTarget={0.5} delay={0.55}
        fill="#C4C0F0" repeat={Infinity} repeatType="loop" />
      {/* 2218:963 — bottom-right large, opacity→1, delay~0.7 */}
      <BgEllipse left={220} top={560} size={240} opacityTarget={1} delay={0.7}
        fill="radial-gradient(circle, rgba(184,212,245,0.25) 0%, transparent 70%)"
        repeat={Infinity} repeatType="loop" />
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
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

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100, overflow: 'hidden',
        backgroundColor: '#f4f4ff',
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease-out`,
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      {/* Fixed-size design canvas, scaled to fit viewport */}
      <div
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: designW, height: designH,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Background decorative layer */}
        {isMobile ? <MobileBackground /> : <DesktopBackground />}

        {/* Card — centered with flexbox, no absolute-position transform bugs */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <SplashCard mobile={isMobile} onEnter={handleEnter} />
        </div>
      </div>
    </div>
  );
}
