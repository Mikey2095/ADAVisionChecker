import svgPaths from "./svg-vi3gxr3679";
import imgDashEllipse from "./d2b7f64cb036db1a69b9efbc47c5716ceb2e3165.png";
import imgDashEllipse1 from "./af21a0760bab6de2de801af44b539b611e7faffa.png";
import imgDashEllipse2 from "./85c2d577ed5283b49827f62b6c4ca6da5369fda8.png";
import imgDottedEllipse from "./2244c39c51f19ffb6678ff21223cb8afa6ef6192.png";

function Group1() {
  return (
    <div className="absolute contents left-[288px] top-[-3px]">
      <div className="absolute left-[288px] size-[18px] top-[-3px]" data-name="Dash Ellipse">
        <div className="absolute inset-[-22.22%]">
          <img alt="" className="block max-w-none size-full" height="26" src={imgDashEllipse} width="26" />
        </div>
      </div>
      <div className="absolute left-[288px] size-[18px] top-[-3px]" data-name="Dash Ellipse">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="18" src={imgDashEllipse1} width="18" />
      </div>
    </div>
  );
}

function Divder() {
  return (
    <div className="h-[12px] relative shrink-0 w-[594px]" data-name="Divder">
      <Group1 />
      <div className="absolute h-0 left-0 top-[6px] w-[594px]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 594 1">
            <path d="M0 0.5H594" id="Vector" stroke="var(--stroke-0, white)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] items-center left-[90px] top-[555px] w-[820px]">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[80px] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[102px] text-center text-white tracking-[4px] w-[min-content]">
        <p className="leading-[normal]">ADA</p>
      </div>
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[26px] text-center text-white tracking-[7px] whitespace-nowrap">
        <p className="leading-[normal]">VISION CHECKER</p>
      </div>
      <Divder />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Light',sans-serif] font-light justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[32px] text-center text-white w-[min-content]">
        <p className="leading-[56px]">Simulate visual impairments, test contrst, and build inclusive digital experiences</p>
      </div>
    </div>
  );
}

function EllipseOutlines() {
  return (
    <div className="absolute contents left-[370px] top-[186px]" data-name="Ellipse outlines">
      <div className="absolute left-[370px] size-[264px] top-[186px]" data-name="Dash Ellipse">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="264" src={imgDashEllipse2} width="264" />
      </div>
      <div className="absolute left-[370px] size-[264px] top-[186px]" data-name="Dotted Ellipse">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="264" src={imgDottedEllipse} width="264" />
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[338px] top-[154px]">
      <div className="absolute left-[386px] size-[232px] top-[202px]" data-name="Solid outline">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 232 232">
          <circle cx="116" cy="116" id="Solid outline" r="115.5" stroke="var(--stroke-0, #D9D9D9)" />
        </svg>
      </div>
      <div className="absolute left-[386px] size-[232px] top-[202px]" data-name="Pattern Refraction">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 232 232">
          <circle cx="116" cy="116" fill="var(--fill-0, #0BAAFF)" id="Pattern Refraction" r="116" />
        </svg>
      </div>
      <EllipseOutlines />
      <div className="absolute h-[63px] left-[439px] top-[287px] w-[126px]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 126 63">
          <g id="Vector">
            <path d={svgPaths.p21b0c80} fill="var(--fill-0, white)" />
            <path d={svgPaths.p1616c400} fill="var(--fill-0, white)" />
            <path d={svgPaths.p36ccb780} fill="var(--fill-0, white)" />
            <path d={svgPaths.p9cdf080} fill="var(--fill-0, white)" />
          </g>
        </svg>
      </div>
      <div className="absolute left-[338px] size-[328px] top-[154px]" data-name="Pattern Refraction">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 328 328">
          <circle cx="164" cy="164" fill="var(--fill-0, #0BAAFF)" fillOpacity="0.2" id="Pattern Refraction" r="164" />
        </svg>
      </div>
    </div>
  );
}

export default function HomePageDesktop() {
  return (
    <div className="relative size-full" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-1.1567e-14 25.2 -25.2 -1.4589e-14 500 318)'><stop stop-color='rgba(42,45,53,1)' offset='0'/><stop stop-color='rgba(27,30,37,1)' offset='0.5'/><stop stop-color='rgba(12,14,20,1)' offset='1'/></radialGradient></defs></svg>\")" }} data-name="Home page/Desktop">
      <div className="absolute left-[498px] size-[4px] top-[688px]" data-name="Separator">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #737373)" id="Separator" r="2" />
        </svg>
      </div>
      <Frame />
      <Group />
    </div>
  );
}