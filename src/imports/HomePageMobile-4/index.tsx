import { motion } from "motion/react";
import svgPaths from "./svg-qifya27mft";

function Frame1() {
  return (
    <motion.div className="relative shrink-0 size-[88px]" data-name="Frame">
      <div className="absolute inset-[-11.36%_-15.91%_-20.45%_-15.91%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 116 116">
          <g filter="url(#filter0_d_2218_1106)" id="Frame">
            <rect fill="url(#paint0_radial_2218_1106)" height="88" rx="22" shapeRendering="crispEdges" width="88" x="14" y="10" />
            <g id="Vector">
              <path d={svgPaths.p1110cfb0} fill="var(--fill-0, #7C6FF7)" />
              <path d={svgPaths.p3d606400} fill="var(--fill-0, #7C6FF7)" />
              <path d={svgPaths.p38b86040} fill="var(--fill-0, #7C6FF7)" />
              <path d={svgPaths.p3a31cc00} fill="var(--fill-0, #7C6FF7)" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="116" id="filter0_d_2218_1106" width="116" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="7" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.47 0 0 0 0 0.44 0 0 0 0 0.97 0 0 0 0.18 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2218_1106" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2218_1106" mode="normal" result="shape" />
            </filter>
            <radialGradient cx="0" cy="0" gradientTransform="matrix(0 79.2 44 35.2 58 18.8)" gradientUnits="userSpaceOnUse" id="paint0_radial_2218_1106" r="1">
              <stop stopColor="#EAE8FD" />
              <stop offset="1" stopColor="#D6D2FB" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </motion.div>
  );
}

function Frame2() {
  return <motion.div className="bg-[rgba(0,0,0,0)] h-[28px] relative shrink-0 w-px" data-name="Frame" />;
}

function Frame4() {
  return <div className="bg-[#e5e3f7] flex-[1_0_0] h-px min-w-px relative" data-name="Frame" />;
}

function Frame5() {
  return <div className="bg-[#e5e3f7] flex-[1_0_0] h-px min-w-px relative" data-name="Frame" />;
}

function Frame3() {
  return (
    <motion.div className="content-stretch flex gap-[10px] items-center justify-center py-[18px] relative shrink-0 w-full" data-name="Frame">
      <Frame4 />
      <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
          <circle cx="3" cy="3" fill="var(--fill-0, #C4C0F0)" id="Ellipse" r="3" />
        </svg>
      </div>
      <Frame5 />
    </motion.div>
  );
}

function Frame6() {
  return <motion.div className="bg-[rgba(0,0,0,0)] h-[28px] relative shrink-0 w-px" data-name="Frame" />;
}

function Frame7() {
  return (
    <motion.div className="bg-[#1a1a2e] content-stretch drop-shadow-[0px_4px_7px_rgba(26,26,46,0.2)] flex h-[52px] items-center justify-center relative rounded-[14px] shrink-0 w-full" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[13px] text-white tracking-[3px] uppercase whitespace-nowrap">ENTER</p>
    </motion.div>
  );
}

function Frame() {
  return (
    <motion.div className="absolute bg-white content-stretch flex flex-col items-center left-1/2 px-[40px] py-[44px] rounded-[28px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.05),0px_8px_32px_0px_rgba(120,112,247,0.1)] top-1/2 transform-[translateY(-50%)] w-[345px]" data-name="Frame">
      <Frame1 />
      <Frame2 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[#1a1a2e] text-[68px] text-center tracking-[-1.5px] w-[min-content]">ADA</p>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] min-w-full not-italic relative shrink-0 text-[#9c97c0] text-[11px] text-center tracking-[5px] uppercase w-[min-content]">VISION CHECKER</p>
      <Frame3 />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[22px] min-w-full not-italic relative shrink-0 text-[#6b7280] text-[14px] text-center w-[min-content]">Simulate visual impairments, test contrast, and build inclusive digital experiences</p>
      <Frame6 />
      <Frame7 />
    </motion.div>
  );
}

export default function HomePageMobile() {
  return (
    <div className="relative size-full" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 393 852' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0 59.64 15.72 0 196.5 127.8)'><stop stop-color='rgba(237,238,255,1)' offset='0'/><stop stop-color='rgba(244,244,255,1)' offset='0.55'/><stop stop-color='rgba(255,255,255,1)' offset='1'/></radialGradient></defs></svg>\")" }} data-name="Home page/Mobile">
      <motion.div className="absolute left-[-60px] size-[280px] top-[-40px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 280 280">
          <circle cx="140" cy="140" fill="url(#paint0_radial_2218_1145)" id="Ellipse" r="140" />
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(140 140) rotate(90) scale(140)" gradientUnits="userSpaceOnUse" id="paint0_radial_2218_1145" r="1">
              <stop stopColor="#C7C3F5" stopOpacity="0.25098" />
              <stop offset="1" stopColor="#C7C3F5" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>
      <Frame />
      <motion.div className="absolute left-[36px] size-[5px] top-[700px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
          <circle cx="2.5" cy="2.5" fill="var(--fill-0, #C4C0F0)" id="Ellipse" opacity="0.5" r="2.5" />
        </svg>
      </motion.div>
      <motion.div className="absolute left-[24px] size-[3px] top-[200px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
          <circle cx="1.5" cy="1.5" fill="var(--fill-0, #C4C0F0)" id="Ellipse" opacity="0.4" r="1.5" />
        </svg>
      </motion.div>
      <motion.div className="absolute left-[355px] size-[5px] top-[140px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
          <circle cx="2.5" cy="2.5" fill="var(--fill-0, #C4C0F0)" id="Ellipse" opacity="0.5" r="2.5" />
        </svg>
      </motion.div>
      <motion.div className="absolute left-[220px] size-[240px] top-[560px]" data-name="Ellipse">
        
      </motion.div>
    </div>
  );
}