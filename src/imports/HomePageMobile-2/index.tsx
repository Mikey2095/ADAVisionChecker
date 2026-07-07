import svgPaths from "./svg-457pg50ari";
import imgDashEllipse from "./af952d24bbd228586b1217cec728c3ee5b6602aa.png";
import imgDashEllipse1 from "./dd00989d8327425ecd101ec6ef67a26dcdaa18a7.png";
import imgDashEllipse2 from "./a05e21abd9e9693efa5a4006b97528d95313507c.png";
import imgDottedEllipse from "./990b7022d24bf64d651060093af68076abda044a.png";

function Frame1() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[17px] left-1/2 top-[calc(50%-0.38px)] w-[16px]">
      <div className="absolute h-[17px] left-0 top-0 w-[16px]" data-name="Dash Ellipse">
        <div className="absolute inset-[-16.93%_-17.99%]">
          <img alt="" className="block max-w-none size-full" height="22.757" src={imgDashEllipse} width="21.757" />
        </div>
      </div>
      <div className="absolute left-[1.52px] size-[12.953px] top-[2.11px]" data-name="Dash Ellipse">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="12.953" src={imgDashEllipse1} width="12.953" />
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="h-[17px] relative shrink-0 w-[294px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute h-0 left-1/2 top-[calc(50%+0.12px)] w-[294px]" data-name="Vector">
        <div className="absolute inset-[-0.36px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 294 0.719604">
            <path d={svgPaths.pf5bdd80} fill="var(--stroke-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
      <Frame1 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[17.27px] items-center left-[46px] top-[448px] w-[294px]">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[57.568px] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[73.4px] text-center text-white tracking-[2.8784px] w-[min-content]">
        <p className="leading-[normal]">ADA</p>
      </div>
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[18.71px] text-center text-white tracking-[5.0372px] whitespace-nowrap">
        <p className="leading-[normal]">VISION CHECKER</p>
      </div>
      <Frame2 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Light',sans-serif] font-light justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[19.332px] text-center text-white w-[min-content]">
        <p className="leading-[26px]">Simulate visual impairments, test contrst, and build inclusive digital experiences</p>
      </div>
    </div>
  );
}

function EllipseOutlines() {
  return (
    <div className="absolute contents left-[107.15px] top-[150.65px]" data-name="Ellipse outlines">
      <div className="absolute left-[107.15px] size-[178.602px] top-[150.65px]" data-name="Dash Ellipse">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="178.602" src={imgDashEllipse2} width="178.602" />
      </div>
      <div className="absolute left-[107.15px] size-[178.602px] top-[150.65px]" data-name="Dotted Ellipse">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="178.602" src={imgDottedEllipse} width="178.602" />
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[85.5px] top-[129px]">
      <div className="absolute left-[117.97px] size-[156.954px] top-[161.47px]" data-name="Solid outline">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 156.954 156.954">
          <circle cx="78.4768" cy="78.4768" id="Solid outline" r="78.1386" stroke="var(--stroke-0, #D9D9D9)" strokeWidth="0.676523" />
        </svg>
      </div>
      <div className="absolute left-[117.97px] size-[156.954px] top-[161.47px]" data-name="Pattern Refraction">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 156.954 156.954">
          <circle cx="78.4768" cy="78.4768" fill="var(--fill-0, #0BAAFF)" id="Pattern Refraction" r="78.4768" />
        </svg>
      </div>
      <EllipseOutlines />
      <div className="absolute h-[42.621px] left-[153.83px] top-[218.98px] w-[85.242px]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 85.2421 42.621">
          <g id="Vector">
            <path d={svgPaths.p117a9df0} fill="var(--fill-0, white)" />
            <path d={svgPaths.p3e760a80} fill="var(--fill-0, white)" />
            <path d={svgPaths.p2b757500} fill="var(--fill-0, white)" />
            <path d={svgPaths.p3afc7100} fill="var(--fill-0, white)" />
          </g>
        </svg>
      </div>
      <div className="absolute left-[85.5px] size-[221.9px] top-[129px]" data-name="Pattern Refraction">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 221.9 221.9">
          <circle cx="110.95" cy="110.95" fill="var(--fill-0, #0BAAFF)" fillOpacity="0.2" id="Pattern Refraction" r="110.95" />
        </svg>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="-translate-x-1/2 absolute bg-white content-stretch flex h-[56px] items-center justify-center left-1/2 p-[5.546px] rounded-[16.639px] top-[720px] w-[243px]">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24.958px] justify-center leading-[0] not-italic relative shrink-0 text-[32.906px] text-black text-center w-[184.689px]">
        <p className="leading-[14.42px]">ENTER</p>
      </div>
    </div>
  );
}

export default function HomePageMobile() {
  return (
    <div className="relative size-full" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 393 852' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-8.6193e-14 24.314 -24.314 -1.8243e-13 196.5 242.5)'><stop stop-color='rgba(42,45,53,1)' offset='0'/><stop stop-color='rgba(27,30,37,1)' offset='0.3'/><stop stop-color='rgba(12,14,20,1)' offset='0.6'/></radialGradient></defs></svg>\")" }} data-name="Home page/Mobile">
      <div className="absolute left-[195.71px] size-[1.572px] top-[499.88px]" data-name="Separator">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.572 1.572">
          <circle cx="0.786" cy="0.786" fill="var(--fill-0, #737373)" id="Separator" r="0.786" />
        </svg>
      </div>
      <Frame />
      <Group />
      <Frame3 />
    </div>
  );
}