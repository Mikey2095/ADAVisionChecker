import svgPaths from "./svg-lw38s7a8bl";
import imgDashEllipse from "./61db7d7ffa22309e007a6dda474c330daf8d3078.png";
import imgDashEllipse1 from "./6520b9cf7fc74f08042469fe704fd60170800e68.png";
import imgDashEllipse2 from "./53fd2f9278ee85a82cf7bc512c1707a4f78c523c.png";
import imgDottedEllipse from "./b70eb8862262604accd4e987a73dd31a92d819f6.png";

function Group1() {
  return (
    <div className="absolute contents left-[113.18px] top-[-1.18px]">
      <div className="absolute left-[113.18px] size-[7.074px] top-[-1.18px]" data-name="Dash Ellipse">
        <div className="absolute inset-[-22.22%]">
          <img alt="" className="block max-w-none size-full" height="10.218" src={imgDashEllipse} width="10.218" />
        </div>
      </div>
      <div className="absolute left-[113.18px] size-[7.074px] top-[-1.18px]" data-name="Dash Ellipse">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="7.074" src={imgDashEllipse1} width="7.074" />
      </div>
    </div>
  );
}

function Divder() {
  return (
    <div className="h-[4.716px] relative shrink-0 w-[233.442px]" data-name="Divder">
      <Group1 />
      <div className="absolute h-0 left-0 top-[2.36px] w-[233.442px]" data-name="Vector">
        <div className="absolute inset-[-0.2px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 233.442 0.393">
            <path d="M0 0.1965H233.442" id="Vector" stroke="var(--stroke-0, white)" strokeWidth="0.393" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[9.432px] items-center left-[35.37px] top-[447.61px] w-[322.26px]">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[31.44px] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[40.086px] text-center text-white tracking-[1.572px] w-[min-content]">
        <p className="leading-[normal]">ADA</p>
      </div>
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[10.218px] text-center text-white tracking-[2.751px] whitespace-nowrap">
        <p className="leading-[normal]">VISION CHECKER</p>
      </div>
      <Divder />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Light',sans-serif] font-light justify-center leading-[0] not-italic relative shrink-0 text-[12.576px] text-center text-white w-[261px]">
        <p className="leading-[22.008px]">Simulate visual impairments, test contrst, and build inclusive digital experiences</p>
      </div>
    </div>
  );
}

function EllipseOutlines() {
  return (
    <div className="absolute contents left-[117.61px] top-[174.11px]" data-name="Ellipse outlines">
      <div className="absolute left-[117.61px] size-[157.676px] top-[174.11px]" data-name="Dash Ellipse">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="157.676" src={imgDashEllipse2} width="157.676" />
      </div>
      <div className="absolute left-[117.61px] size-[157.676px] top-[174.11px]" data-name="Dotted Ellipse">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="157.676" src={imgDottedEllipse} width="157.676" />
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[98.5px] top-[155px]">
      <div className="absolute left-[127.17px] size-[138.563px] top-[183.67px]" data-name="Solid outline">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138.563 138.563">
          <circle cx="69.2817" cy="69.2817" id="Solid outline" r="68.9831" stroke="var(--stroke-0, #D9D9D9)" strokeWidth="0.597256" />
        </svg>
      </div>
      <div className="absolute left-[127.17px] size-[138.563px] top-[183.67px]" data-name="Pattern Refraction">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138.563 138.563">
          <circle cx="69.2817" cy="69.2817" fill="var(--fill-0, #0BAAFF)" id="Pattern Refraction" r="69.2817" />
        </svg>
      </div>
      <EllipseOutlines />
      <div className="absolute h-[37.627px] left-[158.82px] top-[234.43px] w-[75.254px]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 75.2543 37.6271">
          <g id="Vector">
            <path d={svgPaths.pd339680} fill="var(--fill-0, white)" />
            <path d={svgPaths.pfaefa80} fill="var(--fill-0, white)" />
            <path d={svgPaths.pf3d3600} fill="var(--fill-0, white)" />
            <path d={svgPaths.p579aa00} fill="var(--fill-0, white)" />
          </g>
        </svg>
      </div>
      <div className="absolute left-[98.5px] size-[195.9px] top-[155px]" data-name="Pattern Refraction">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 195.9 195.9">
          <circle cx="97.95" cy="97.95" fill="var(--fill-0, #0BAAFF)" fillOpacity="0.2" id="Pattern Refraction" r="97.95" />
        </svg>
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
    </div>
  );
}