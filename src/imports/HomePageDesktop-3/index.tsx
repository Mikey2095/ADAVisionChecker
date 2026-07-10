import { motion } from "motion/react";
import svgPaths from "./svg-s29ps78p52";

function Frame1() {
  return (
    <motion.div className="relative shrink-0 size-[108px]" data-name="Frame">
      <div className="absolute inset-[-11.11%_-14.81%_-18.52%_-14.81%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 140 140">
          <g filter="url(#filter0_d_2218_966)" id="Frame">
            <rect fill="url(#paint0_radial_2218_966)" height="108" rx="28" shapeRendering="crispEdges" width="108" x="16" y="12" />
            <g id="Vector">
              <path d={svgPaths.p2d878600} fill="var(--fill-0, #7C6FF7)" />
              <path d={svgPaths.p3192cd00} fill="var(--fill-0, #7C6FF7)" />
              <path d={svgPaths.p1a8fb300} fill="var(--fill-0, #7C6FF7)" />
              <path d={svgPaths.p2af6e780} fill="var(--fill-0, #7C6FF7)" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="140" id="filter0_d_2218_966" width="140" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="8" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.47 0 0 0 0 0.44 0 0 0 0 0.97 0 0 0 0.2 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2218_966" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2218_966" mode="normal" result="shape" />
            </filter>
            <radialGradient cx="0" cy="0" gradientTransform="matrix(0 97.2 54 43.2 70 22.8)" gradientUnits="userSpaceOnUse" id="paint0_radial_2218_966" r="1">
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
  return <motion.div className="bg-[rgba(0,0,0,0)] h-[36px] relative shrink-0 w-px" data-name="Frame" />;
}

function Frame4() {
  return <div className="bg-[#e5e3f7] flex-[1_0_0] h-px min-w-px relative" data-name="Frame" />;
}

function Frame5() {
  return <div className="bg-[#e5e3f7] flex-[1_0_0] h-px min-w-px relative" data-name="Frame" />;
}

function Frame3() {
  return (
    <motion.div className="content-stretch flex gap-[12px] items-center justify-center py-[20px] relative shrink-0 w-full" data-name="Frame">
      <Frame4 />
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, #C4C0F0)" id="Ellipse" r="4" />
        </svg>
      </div>
      <Frame5 />
    </motion.div>
  );
}

function Frame6() {
  return <motion.div className="bg-[rgba(0,0,0,0)] h-[36px] relative shrink-0 w-px" data-name="Frame" />;
}

function Frame7() {
  return (
    <motion.div className="bg-[#1a1a2e] content-stretch drop-shadow-[0px_4px_8px_rgba(26,26,46,0.2)] flex h-[58px] items-center justify-center relative rounded-[16px] shrink-0 w-full" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[15px] text-white tracking-[3px] uppercase whitespace-nowrap">ENTER</p>
    </motion.div>
  );
}

function Frame() {
  return (
    <motion.div className="absolute bg-white content-stretch flex flex-col items-center left-1/2 px-[64px] py-[56px] rounded-[32px] shadow-[0px_2px_16px_0px_rgba(0,0,0,0.06),0px_8px_40px_0px_rgba(120,112,247,0.1)] top-1/2 transform-[translateY(-50%)] w-[640px]" data-name="Frame">
      <Frame1 />
      <Frame2 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[#1a1a2e] text-[88px] text-center tracking-[-2px] w-[min-content]">ADA</p>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] min-w-full not-italic relative shrink-0 text-[#9c97c0] text-[13px] text-center tracking-[6px] uppercase w-[min-content]">VISION CHECKER</p>
      <Frame3 />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[28px] min-w-full not-italic relative shrink-0 text-[#6b7280] text-[17px] text-center w-[min-content]">Simulate visual impairments, test contrast, and build inclusive digital experiences</p>
      <Frame6 />
      <Frame7 />
    </motion.div>
  );
}

export default function HomePageDesktop() {
  return (
    <div className="relative size-full" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0 65 35 0 500 200)'><stop stop-color='rgba(237,238,255,1)' offset='0'/><stop stop-color='rgba(248,248,255,1)' offset='0.5'/><stop stop-color='rgba(255,255,255,1)' offset='1'/></radialGradient></defs></svg>\")" }} data-name="Home page/Desktop">
      <motion.div className="absolute left-[-80px] size-[400px] top-[-80px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 400 400">
          <circle cx="200" cy="200" fill="url(#paint0_radial_2218_1019)" id="Ellipse" r="200" />
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(200 200) rotate(90) scale(200)" gradientUnits="userSpaceOnUse" id="paint0_radial_2218_1019" r="1">
              <stop stopColor="#C7C3F5" stopOpacity="0.2" />
              <stop offset="1" stopColor="#C7C3F5" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>
      <motion.div className="absolute left-[880px] size-[6px] top-[200px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
          <circle cx="3" cy="3" fill="var(--fill-0, #C4C0F0)" id="Ellipse" opacity="0.6" r="3" />
        </svg>
      </motion.div>
      <motion.div className="absolute left-[600px] size-[300px] top-[-60px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 300 300">
          <circle cx="150" cy="150" fill="url(#paint0_radial_2218_1061)" id="Ellipse" r="150" />
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(150 150) rotate(90) scale(150)" gradientUnits="userSpaceOnUse" id="paint0_radial_2218_1061" r="1">
              <stop stopColor="#DDD9FB" stopOpacity="0.266667" />
              <stop offset="1" stopColor="#DDD9FB" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>
      <motion.div className="absolute left-[80px] size-[4px] top-[300px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #C4C0F0)" id="Ellipse" opacity="0.4" r="2" />
        </svg>
      </motion.div>
      <motion.div className="absolute left-[120px] size-[6px] top-[800px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
          <circle cx="3" cy="3" fill="var(--fill-0, #C4C0F0)" id="Ellipse" opacity="0.6" r="3" />
        </svg>
      </motion.div>
      <Frame />
      <motion.div className="absolute left-[700px] size-[380px] top-[600px]" data-name="Ellipse">
        
      </motion.div>
      <motion.div className="absolute left-[920px] size-[4px] top-[760px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #C4C0F0)" id="Ellipse" opacity="0.4" r="2" />
        </svg>
      </motion.div>
    </div>
  );
}