import svgPaths from "./svg-9ejv528woq";
import imgHeroImageCard from "./2d312c489a6ab384b2b026012b85c143fc276022.png";

function TitleStack() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start not-italic relative shrink-0 whitespace-nowrap" data-name="TitleStack">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#0c0c0f] text-[18px] tracking-[-0.4px]">ADA Vision Checker</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#6b7280] text-[10px] tracking-[0.2px]">WCAG 2.1 · ADA · Section 508</p>
    </div>
  );
}

function HeaderLeft() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="HeaderLeft">
      <TitleStack />
    </div>
  );
}

function Eye() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="eye">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
        <g id="eye">
          <path d={svgPaths.p25670c80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function TabVisionSimulator() {
  return (
    <div className="bg-[#0c0c0f] content-stretch flex gap-[6px] items-center px-[14px] py-[7px] relative rounded-[20px] shrink-0" data-name="TabVisionSimulator">
      <Eye />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[13px] text-white whitespace-nowrap">Vision Simulator</p>
    </div>
  );
}

function BarChart() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="bar-chart">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
        <g id="bar-chart">
          <path d={svgPaths.p180bbc80} id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function TabContrast() {
  return (
    <div className="content-stretch flex gap-[6px] items-center px-[14px] py-[7px] relative rounded-[20px] shrink-0" data-name="TabContrast">
      <BarChart />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[13px] whitespace-nowrap">Contrast Checker</p>
    </div>
  );
}

function ExternalLink() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="external-link">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
        <g clipPath="url(#clip0_2011_693)" id="external-link">
          <path d={svgPaths.p39871400} id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_2011_693">
            <rect fill="white" height="13" width="13" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function TabSources() {
  return (
    <div className="content-stretch flex gap-[6px] items-center px-[14px] py-[7px] relative rounded-[20px] shrink-0" data-name="TabSources">
      <ExternalLink />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[13px] whitespace-nowrap">Sources</p>
    </div>
  );
}

function HeaderTabs() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="HeaderTabs">
      <TabVisionSimulator />
      <TabContrast />
      <TabSources />
    </div>
  );
}

function HeaderBar() {
  return (
    <div className="bg-[#f5f5f7] h-[56px] relative shrink-0 w-full" data-name="HeaderBar">
      <div aria-hidden className="absolute border-[#e0e0e8] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pl-[16px] pr-[20px] relative size-full">
          <HeaderLeft />
          <HeaderTabs />
        </div>
      </div>
    </div>
  );
}

function RotatedLabel() {
  return (
    <div className="content-stretch flex flex-col h-[200px] items-center justify-center relative shrink-0 w-[24px]" data-name="RotatedLabel">
      <div className="flex h-[120px] items-center justify-center relative shrink-0 w-[10px]">
        <div className="-rotate-90 flex-none">
          <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative text-[#3a3a3a] text-[8px] tracking-[2px] uppercase whitespace-nowrap">ADA VISION CHECKER</p>
        </div>
      </div>
    </div>
  );
}

function VerticalStrip() {
  return (
    <div className="bg-black relative self-stretch shrink-0 w-[40px]" data-name="VerticalStrip">
      <div aria-hidden className="absolute border-[#1c1c1c] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center justify-between py-[16px] relative size-full">
          <RotatedLabel />
        </div>
      </div>
    </div>
  );
}

function Spacer() {
  return <div className="h-[6px] relative shrink-0 w-full" data-name="Spacer" />;
}

function Frame() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px not-italic relative text-white whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[11px]">Normal Vision</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13px] relative shrink-0 text-[9px]">Reference</p>
    </div>
  );
}

function ChevronRight() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="chevron-right">
          <path d="M4.5 9L7.5 6L4.5 3" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemActive() {
  return (
    <div className="bg-[#191919] relative rounded-[6px] shrink-0 w-full" data-name="ItemActive">
      <div aria-hidden className="absolute border-[#1c1c1c] border-b border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[8px] relative size-full">
          <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
              <circle cx="3" cy="3" fill="var(--fill-0, white)" id="Ellipse" r="3" />
            </svg>
          </div>
          <Frame />
          <ChevronRight />
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px not-italic relative whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#787575] text-[11px]">Protanopia</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13px] relative shrink-0 text-[#555] text-[9px]">~0.8% of males</p>
    </div>
  );
}

function ChevronRight1() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="chevron-right">
          <path d="M4.5 9L7.5 6L4.5 3" id="Vector" stroke="var(--stroke-0, #3A3A3A)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Item() {
  return (
    <div className="bg-[#f0f0f0] relative rounded-[6px] shrink-0 w-full" data-name="Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[7px] relative size-full">
          <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
              <circle cx="3" cy="3" fill="var(--fill-0, #3A3A3A)" id="Ellipse" r="3" />
            </svg>
          </div>
          <Frame1 />
          <ChevronRight1 />
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px not-italic relative whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#787575] text-[11px]">Deuteranopia</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13px] relative shrink-0 text-[#555] text-[9px]">~1.0% of males</p>
    </div>
  );
}

function ChevronRight2() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="chevron-right">
          <path d="M4.5 9L7.5 6L4.5 3" id="Vector" stroke="var(--stroke-0, #3A3A3A)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Item1() {
  return (
    <div className="bg-[#f0f0f0] relative rounded-[6px] shrink-0 w-full" data-name="Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[7px] relative size-full">
          <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
              <circle cx="3" cy="3" fill="var(--fill-0, #3A3A3A)" id="Ellipse" r="3" />
            </svg>
          </div>
          <Frame2 />
          <ChevronRight2 />
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px not-italic relative whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#787575] text-[11px]">Tritanopia</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13px] relative shrink-0 text-[#555] text-[9px]">~0.01% of population</p>
    </div>
  );
}

function ChevronRight3() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="chevron-right">
          <path d="M4.5 9L7.5 6L4.5 3" id="Vector" stroke="var(--stroke-0, #3A3A3A)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Item2() {
  return (
    <div className="bg-[#f0f0f0] relative rounded-[6px] shrink-0 w-full" data-name="Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[7px] relative size-full">
          <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
              <circle cx="3" cy="3" fill="var(--fill-0, #3A3A3A)" id="Ellipse" r="3" />
            </svg>
          </div>
          <Frame3 />
          <ChevronRight3 />
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px not-italic relative whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#787575] text-[11px]">Achromatopsia</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13px] relative shrink-0 text-[#555] text-[9px]">~0.003% of population</p>
    </div>
  );
}

function ChevronRight4() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="chevron-right">
          <path d="M4.5 9L7.5 6L4.5 3" id="Vector" stroke="var(--stroke-0, #3A3A3A)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Item3() {
  return (
    <div className="bg-[#f0f0f0] relative rounded-[6px] shrink-0 w-full" data-name="Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[7px] relative size-full">
          <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
              <circle cx="3" cy="3" fill="var(--fill-0, #3A3A3A)" id="Ellipse" r="3" />
            </svg>
          </div>
          <Frame4 />
          <ChevronRight4 />
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px not-italic relative whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#787575] text-[11px]">Protanomaly</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13px] relative shrink-0 text-[#555] text-[9px]">~1.0% of males</p>
    </div>
  );
}

function ChevronRight5() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="chevron-right">
          <path d="M4.5 9L7.5 6L4.5 3" id="Vector" stroke="var(--stroke-0, #3A3A3A)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Item4() {
  return (
    <div className="bg-[#f0f0f0] relative rounded-[6px] shrink-0 w-full" data-name="Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[7px] relative size-full">
          <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
              <circle cx="3" cy="3" fill="var(--fill-0, #3A3A3A)" id="Ellipse" r="3" />
            </svg>
          </div>
          <Frame5 />
          <ChevronRight5 />
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px not-italic relative whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#787575] text-[11px]">Deuteranomaly</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13px] relative shrink-0 text-[#555] text-[9px]">~5.0% of males</p>
    </div>
  );
}

function ChevronRight6() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="chevron-right">
          <path d="M4.5 9L7.5 6L4.5 3" id="Vector" stroke="var(--stroke-0, #3A3A3A)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Item5() {
  return (
    <div className="bg-[#f0f0f0] relative rounded-[6px] shrink-0 w-full" data-name="Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[7px] relative size-full">
          <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
              <circle cx="3" cy="3" fill="var(--fill-0, #3A3A3A)" id="Ellipse" r="3" />
            </svg>
          </div>
          <Frame6 />
          <ChevronRight6 />
        </div>
      </div>
    </div>
  );
}

function CvdSection() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="CVDSection">
      <div className="content-stretch flex flex-col gap-[7px] items-start px-[14px] py-[10px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#444] text-[9px] tracking-[1.2px] uppercase whitespace-nowrap">Color Vision Deficiency</p>
        <Spacer />
        <ItemActive />
        <Item />
        <Item1 />
        <Item2 />
        <Item3 />
        <Item4 />
        <Item5 />
      </div>
    </div>
  );
}

function Spacer1() {
  return <div className="h-[6px] relative shrink-0 w-full" data-name="Spacer" />;
}

function Frame7() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px not-italic relative whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[11px] text-white">Normal Contrast</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13px] relative shrink-0 text-[#555] text-[9px]">No contrast modification</p>
    </div>
  );
}

function ChevronRight7() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="chevron-right">
          <path d="M4.5 9L7.5 6L4.5 3" id="Vector" stroke="var(--stroke-0, #3A3A3A)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ItemActive1() {
  return (
    <div className="bg-[#191919] relative rounded-[6px] shrink-0 w-full" data-name="ItemActive">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[8px] relative size-full">
          <Frame7 />
          <ChevronRight7 />
        </div>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px not-italic relative whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#787575] text-[11px]">Low Contrast Sensitivity</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13px] relative shrink-0 text-[#555] text-[9px]">Compressed dynamic range</p>
    </div>
  );
}

function ChevronRight8() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="chevron-right">
          <path d="M4.5 9L7.5 6L4.5 3" id="Vector" stroke="var(--stroke-0, #3A3A3A)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Item6() {
  return (
    <div className="bg-[#f0f0f0] relative rounded-[6px] shrink-0 w-full" data-name="Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[7px] relative size-full">
          <Frame8 />
          <ChevronRight8 />
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px not-italic relative whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#787575] text-[11px]">High Contrast Mode</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13px] relative shrink-0 text-[#555] text-[9px]">OS accessibility override</p>
    </div>
  );
}

function ChevronRight9() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="chevron-right">
          <path d="M4.5 9L7.5 6L4.5 3" id="Vector" stroke="var(--stroke-0, #3A3A3A)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Item7() {
  return (
    <div className="bg-[#f0f0f0] relative rounded-[6px] shrink-0 w-full" data-name="Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[7px] relative size-full">
          <Frame9 />
          <ChevronRight9 />
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px not-italic relative whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#787575] text-[11px]">Overexposed / Washed Out</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13px] relative shrink-0 text-[#555] text-[9px]">Photophobia + low dynamic range</p>
    </div>
  );
}

function ChevronRight10() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="chevron-right">
          <path d="M4.5 9L7.5 6L4.5 3" id="Vector" stroke="var(--stroke-0, #3A3A3A)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Item8() {
  return (
    <div className="bg-[#f0f0f0] relative rounded-[6px] shrink-0 w-full" data-name="Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[7px] relative size-full">
          <Frame10 />
          <ChevronRight10 />
        </div>
      </div>
    </div>
  );
}

function ContrastSection() {
  return (
    <div className="relative shrink-0 w-full" data-name="ContrastSection">
      <div className="content-stretch flex flex-col gap-[7px] items-start px-[14px] py-[10px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#444] text-[9px] tracking-[1.2px] uppercase whitespace-nowrap">Contrast Sensitivity</p>
        <Spacer1 />
        <ItemActive1 />
        <Item6 />
        <Item7 />
        <Item8 />
      </div>
    </div>
  );
}

function Spacer2() {
  return <div className="h-[6px] relative shrink-0 w-full" data-name="Spacer" />;
}

function Frame11() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px not-italic relative whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#787575] text-[11px]">Low Vision</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13px] relative shrink-0 text-[#555] text-[9px]">Reduced acuity - blur(4px)</p>
    </div>
  );
}

function Switch() {
  return (
    <div className="h-[18px] relative shrink-0 w-[32px]" data-name="Switch">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 18">
        <g id="Switch">
          <mask fill="white" id="path-1-inside-1_2011_681">
            <path d={svgPaths.p37da8600} />
          </mask>
          <path d={svgPaths.p37da8600} fill="var(--fill-0, #222222)" />
          <path d={svgPaths.p2480a070} fill="var(--stroke-0, #333333)" mask="url(#path-1-inside-1_2011_681)" />
          <circle cx="9" cy="9" fill="var(--fill-0, #3A3A3A)" id="Ellipse" r="7" />
        </g>
      </svg>
    </div>
  );
}

function SwitchItem() {
  return (
    <div className="bg-[#f0f0f0] relative rounded-[6px] shrink-0 w-full" data-name="SwitchItem">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[7px] relative size-full">
          <Frame11 />
          <Switch />
        </div>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px not-italic relative whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#787575] text-[11px]">Glaucoma</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13px] relative shrink-0 text-[#555] text-[9px]">Tunnel vision - radial vignette</p>
    </div>
  );
}

function Switch1() {
  return (
    <div className="h-[18px] relative shrink-0 w-[32px]" data-name="Switch">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 18">
        <g id="Switch">
          <mask fill="white" id="path-1-inside-1_2011_681">
            <path d={svgPaths.p37da8600} />
          </mask>
          <path d={svgPaths.p37da8600} fill="var(--fill-0, #222222)" />
          <path d={svgPaths.p2480a070} fill="var(--stroke-0, #333333)" mask="url(#path-1-inside-1_2011_681)" />
          <circle cx="9" cy="9" fill="var(--fill-0, #3A3A3A)" id="Ellipse" r="7" />
        </g>
      </svg>
    </div>
  );
}

function SwitchItem1() {
  return (
    <div className="bg-[#f0f0f0] relative rounded-[6px] shrink-0 w-full" data-name="SwitchItem">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[7px] relative size-full">
          <Frame12 />
          <Switch1 />
        </div>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px not-italic relative whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#787575] text-[11px]">Macular Degeneration</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13px] relative shrink-0 text-[#555] text-[9px]">Central scotoma - dark center</p>
    </div>
  );
}

function Switch2() {
  return (
    <div className="h-[18px] relative shrink-0 w-[32px]" data-name="Switch">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 18">
        <g id="Switch">
          <mask fill="white" id="path-1-inside-1_2011_681">
            <path d={svgPaths.p37da8600} />
          </mask>
          <path d={svgPaths.p37da8600} fill="var(--fill-0, #222222)" />
          <path d={svgPaths.p2480a070} fill="var(--stroke-0, #333333)" mask="url(#path-1-inside-1_2011_681)" />
          <circle cx="9" cy="9" fill="var(--fill-0, #3A3A3A)" id="Ellipse" r="7" />
        </g>
      </svg>
    </div>
  );
}

function SwitchItem2() {
  return (
    <div className="bg-[#f0f0f0] relative rounded-[6px] shrink-0 w-full" data-name="SwitchItem">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[7px] relative size-full">
          <Frame13 />
          <Switch2 />
        </div>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px not-italic relative whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#787575] text-[11px]">Cataracts</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13px] relative shrink-0 text-[#555] text-[9px]">Blur + yellow tint - blur(2px)</p>
    </div>
  );
}

function Switch3() {
  return (
    <div className="h-[18px] relative shrink-0 w-[32px]" data-name="Switch">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 18">
        <g id="Switch">
          <mask fill="white" id="path-1-inside-1_2011_681">
            <path d={svgPaths.p37da8600} />
          </mask>
          <path d={svgPaths.p37da8600} fill="var(--fill-0, #222222)" />
          <path d={svgPaths.p2480a070} fill="var(--stroke-0, #333333)" mask="url(#path-1-inside-1_2011_681)" />
          <circle cx="9" cy="9" fill="var(--fill-0, #3A3A3A)" id="Ellipse" r="7" />
        </g>
      </svg>
    </div>
  );
}

function SwitchItem3() {
  return (
    <div className="bg-[#f0f0f0] relative rounded-[6px] shrink-0 w-full" data-name="SwitchItem">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] py-[7px] relative size-full">
          <Frame14 />
          <Switch3 />
        </div>
      </div>
    </div>
  );
}

function AdditionalSection() {
  return (
    <div className="relative shrink-0 w-full" data-name="AdditionalSection">
      <div className="content-stretch flex flex-col gap-[7px] items-start px-[14px] py-[10px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#444] text-[9px] tracking-[1.2px] uppercase whitespace-nowrap">Additional Effects</p>
        <Spacer2 />
        <SwitchItem />
        <SwitchItem1 />
        <SwitchItem2 />
        <SwitchItem3 />
      </div>
    </div>
  );
}

function ExternalLink1() {
  return (
    <div className="relative shrink-0 size-[11px]" data-name="external-link">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g clipPath="url(#clip0_2011_690)" id="external-link">
          <path d={svgPaths.p37d362c0} id="Vector" stroke="var(--stroke-0, #444444)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_2011_690">
            <rect fill="white" height="11" width="11" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[5px] items-center relative shrink-0" data-name="Frame">
      <ExternalLink1 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[14px] not-italic relative shrink-0 text-[#444] text-[9px] whitespace-nowrap">Built for accessibility</p>
    </div>
  );
}

function BuiltNote() {
  return (
    <div className="relative shrink-0 w-full" data-name="BuiltNote">
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[8px] pt-[14px] px-[14px] relative size-full">
        <Frame15 />
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[13px] min-w-full not-italic relative shrink-0 text-[#3a3a3a] text-[8px] w-[min-content]">Simulations are approximations for design evaluation and research.</p>
      </div>
    </div>
  );
}

function FilterScroll() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip py-[12px] relative shrink-0 w-full" data-name="FilterScroll">
      <CvdSection />
      <ContrastSection />
      <AdditionalSection />
      <BuiltNote />
    </div>
  );
}

function FilterPanel() {
  return (
    <div className="bg-white relative self-stretch shrink-0 w-[248px]" data-name="FilterPanel">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <FilterScroll />
      </div>
      <div aria-hidden className="absolute border-[#1c1c1c] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Upload() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="upload">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="upload">
          <path d={svgPaths.p179eed00} id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function UploadIcon() {
  return (
    <div className="bg-[#f5f5f7] content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[40px]" data-name="UploadIcon">
      <div aria-hidden className="absolute border border-[#e0e0e8] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Upload />
    </div>
  );
}

function Frame16() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[3px] items-center not-italic relative shrink-0 text-center whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#4b5563] text-[14px]">Drop an image here to begin</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[17px] relative shrink-0 text-[#6b7280] text-[11px]">or click to browse - JPG · PNG · WebP · GIF · SVG</p>
    </div>
  );
}

function DropZone() {
  return (
    <div className="bg-white h-[221px] relative rounded-[14px] shrink-0 w-full" data-name="DropZone">
      <div aria-hidden className="absolute border-2 border-[#e0e0e8] border-dashed inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col gap-[10px] items-center justify-center p-[28px] relative size-full">
          <UploadIcon />
          <Frame16 />
        </div>
      </div>
    </div>
  );
}

function Eye1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="eye">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="eye">
          <path d={svgPaths.p7d51600} id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconBox() {
  return (
    <div className="bg-[#e1e1e8] content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[40px]" data-name="IconBox">
      <div aria-hidden className="absolute border border-[#e0e0e8] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Eye1 />
    </div>
  );
}

function TitleRow() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="TitleRow">
      <IconBox />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] not-italic relative shrink-0 text-[#0c0c0f] text-[20px] tracking-[-0.4px] whitespace-nowrap">How to use this tool</p>
    </div>
  );
}

function Desc() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[10px] relative shrink-0 w-full" data-name="Desc">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-full">Upload any webpage screenshot, design mockup, or image - then apply filters from the sidebar to see it through the eyes of someone with a visual impairment. Each simulation is grounded in peer-reviewed clinical research and W3C WCAG 2.1 standards.</p>
    </div>
  );
}

function Step() {
  return (
    <div className="bg-[#ebebef] content-stretch flex flex-col gap-[5px] items-start p-[12px] relative rounded-[10px] shrink-0 w-[138px]" data-name="Step1">
      <div aria-hidden className="absolute border border-[#e0e0e8] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[26px] relative shrink-0 text-[#c8c8d4] text-[20px] whitespace-nowrap">01</p>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[17px] min-w-full not-italic relative shrink-0 text-[#0c0c0f] text-[12px] w-[min-content]">Upload an image</p>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[15px] min-w-full not-italic relative shrink-0 text-[#6b7280] text-[10px] w-[min-content]">Screenshot a webpage, drop in a UI mockup, or use any JPG, PNG, or WebP.</p>
    </div>
  );
}

function Step1() {
  return (
    <div className="bg-[#ebebef] content-stretch flex flex-col gap-[5px] items-start p-[12px] relative rounded-[10px] shrink-0 w-[139px]" data-name="Step2">
      <div aria-hidden className="absolute border border-[#e0e0e8] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[26px] relative shrink-0 text-[#c8c8d4] text-[20px] whitespace-nowrap">02</p>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[17px] min-w-full not-italic relative shrink-0 text-[#0c0c0f] text-[12px] w-[min-content]">Select a simulation</p>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[15px] min-w-full not-italic relative shrink-0 text-[#6b7280] text-[10px] w-[min-content]">Pick a color vision deficiency and/or a contrast sensitivity condition from the sidebar.</p>
    </div>
  );
}

function Step2() {
  return (
    <div className="bg-[#ebebef] content-stretch flex flex-col gap-[5px] items-start p-[12px] relative rounded-[10px] shrink-0 w-[138px]" data-name="Step3">
      <div aria-hidden className="absolute border border-[#e0e0e8] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[26px] relative shrink-0 text-[#c8c8d4] text-[20px] whitespace-nowrap">03</p>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[17px] min-w-full not-italic relative shrink-0 text-[#0c0c0f] text-[12px] w-[min-content]">Compare side-by-side</p>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[15px] min-w-full not-italic relative shrink-0 text-[#6b7280] text-[10px] w-[min-content]">The original and simulated views appear next to each other for direct comparison.</p>
    </div>
  );
}

function Steps() {
  return (
    <div className="content-stretch flex gap-[8px] items-start pt-[14px] relative shrink-0 w-full" data-name="Steps">
      <Step />
      <Step1 />
      <Step2 />
    </div>
  );
}

function Users() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="users">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2011_687)" id="users">
          <path d={svgPaths.p35e14a00} id="Vector" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_2011_687">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Frame">
      <Users />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[17px] not-italic relative shrink-0 text-[#4b5563] text-[12px] whitespace-nowrap">~300M</p>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[15px] not-italic relative shrink-0 text-[#6b7280] text-[10px] whitespace-nowrap">people live with color vision deficiency</p>
    </div>
  );
}

function Users1() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="users">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2011_687)" id="users">
          <path d={svgPaths.p35e14a00} id="Vector" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_2011_687">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Frame">
      <Users1 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[17px] not-italic relative shrink-0 text-[#4b5563] text-[12px] whitespace-nowrap">~246M</p>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[15px] not-italic relative shrink-0 text-[#6b7280] text-[10px] whitespace-nowrap">people globally have low vision (WHO)</p>
    </div>
  );
}

function Users2() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="users">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2011_687)" id="users">
          <path d={svgPaths.p35e14a00} id="Vector" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_2011_687">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Frame">
      <Users2 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[17px] not-italic relative shrink-0 text-[#4b5563] text-[12px] whitespace-nowrap">1 in 12</p>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[15px] not-italic relative shrink-0 text-[#6b7280] text-[10px] whitespace-nowrap">males are color blind in some form</p>
    </div>
  );
}

function StatsRow() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pt-[12px] relative shrink-0 w-full" data-name="StatsRow">
      <Frame17 />
      <Frame18 />
      <Frame19 />
    </div>
  );
}

function HowToCard() {
  return (
    <div className="bg-[#f5f5f7] flex-[1_0_0] h-full min-w-px relative rounded-[14px]" data-name="HowToCard">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[22px] relative size-full">
          <TitleRow />
          <Desc />
          <Steps />
          <StatsRow />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#e0e0e8] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Frame20() {
  return <div className="flex-[1_0_0] h-[10px] min-w-px relative" data-name="Frame" />;
}

function Grid() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="grid">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2011_662)" id="grid">
          <path d={svgPaths.p22af1500} id="Vector" stroke="var(--stroke-0, #0C0C0F)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_2011_662">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function MenuBtn() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 size-[30px]" data-name="MenuBtn">
      <Grid />
    </div>
  );
}

function TopBar() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-0 p-[12px] right-0 top-0" data-name="TopBar">
      <Frame20 />
      <MenuBtn />
    </div>
  );
}

function BottomLabel() {
  return (
    <div className="absolute content-stretch flex items-center left-0 pb-[10px] px-[12px] top-[344px]" data-name="BottomLabel">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#0c0c0f] text-[8px] tracking-[1.5px] uppercase whitespace-nowrap">All rights reserved</p>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-gradient-to-b content-stretch flex flex-[1_0_0] flex-col from-[40%] from-[rgba(0,0,0,0)] items-start min-h-px relative to-[rgba(0,0,0,0.8)] w-full" data-name="Overlay">
      <TopBar />
      <BottomLabel />
    </div>
  );
}

function HeroImageCard() {
  return (
    <div className="content-stretch flex flex-col h-full items-start overflow-clip relative rounded-[14px] shrink-0 w-[390px]" data-name="HeroImageCard">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[14px] size-full" src={imgHeroImageCard} />
      <Overlay />
    </div>
  );
}

function TopRow() {
  return (
    <div className="content-stretch flex gap-[8px] h-[370px] items-start relative shrink-0 w-full" data-name="TopRow">
      <HowToCard />
      <HeroImageCard />
    </div>
  );
}

function Eye2() {
  return (
    <div className="relative shrink-0 size-[17px]" data-name="eye">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
        <g id="eye">
          <path d={svgPaths.p52b6300} id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconBox1() {
  return (
    <div className="bg-[#ebebef] content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]" data-name="IconBox">
      <div aria-hidden className="absolute border border-[#e0e0e8] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Eye2 />
    </div>
  );
}

function TextContent() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px not-italic relative whitespace-nowrap" data-name="TextContent">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#0c0c0f] text-[14px] tracking-[-0.2px]">Color Vision Deficiency</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[17px] relative shrink-0 text-[#6b7280] text-[12px]">How 1 in 12 men perceive color differently</p>
    </div>
  );
}

function ChevronRight11() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
        <g id="chevron-right">
          <path d={svgPaths.p23079900} id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function SectionCard() {
  return (
    <div className="bg-[#f5f5f7] flex-[1_0_0] min-h-px relative rounded-[12px] w-full" data-name="SectionCard1">
      <div aria-hidden className="absolute border border-[#e0e0e8] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[14px] items-center px-[18px] py-[14px] relative size-full">
          <IconBox1 />
          <TextContent />
          <ChevronRight11 />
        </div>
      </div>
    </div>
  );
}

function Sliders() {
  return (
    <div className="relative shrink-0 size-[17px]" data-name="sliders">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
        <g id="sliders">
          <path d={svgPaths.p3b53ba80} id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconBox2() {
  return (
    <div className="bg-[#ebebef] content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]" data-name="IconBox">
      <div aria-hidden className="absolute border border-[#e0e0e8] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Sliders />
    </div>
  );
}

function TextContent1() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px not-italic relative whitespace-nowrap" data-name="TextContent">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#0c0c0f] text-[14px] tracking-[-0.2px]">Contrast Sensitivity</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[17px] relative shrink-0 text-[#6b7280] text-[12px]">How luminance differences are perceived across conditions</p>
    </div>
  );
}

function ChevronRight12() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
        <g id="chevron-right">
          <path d={svgPaths.p23079900} id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function SectionCard1() {
  return (
    <div className="bg-[#f5f5f7] flex-[1_0_0] min-h-px relative rounded-[12px] w-full" data-name="SectionCard2">
      <div aria-hidden className="absolute border border-[#e0e0e8] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[14px] items-center px-[18px] py-[14px] relative size-full">
          <IconBox2 />
          <TextContent1 />
          <ChevronRight12 />
        </div>
      </div>
    </div>
  );
}

function Zap() {
  return (
    <div className="relative shrink-0 size-[17px]" data-name="zap">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
        <g id="zap">
          <path d={svgPaths.p3a5b7b00} id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconBox3() {
  return (
    <div className="bg-[#ebebef] content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]" data-name="IconBox">
      <div aria-hidden className="absolute border border-[#e0e0e8] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Zap />
    </div>
  );
}

function TextContent2() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px not-italic relative whitespace-nowrap" data-name="TextContent">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#0c0c0f] text-[14px] tracking-[-0.2px]">Additional Effects</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[17px] relative shrink-0 text-[#6b7280] text-[12px]">Structural and spatial vision conditions</p>
    </div>
  );
}

function ChevronRight13() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
        <g id="chevron-right">
          <path d={svgPaths.p23079900} id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function SectionCard2() {
  return (
    <div className="bg-[#f5f5f7] flex-[1_0_0] min-h-px relative rounded-[12px] w-full" data-name="SectionCard3">
      <div aria-hidden className="absolute border border-[#e0e0e8] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[14px] items-center px-[18px] py-[14px] relative size-full">
          <IconBox3 />
          <TextContent2 />
          <ChevronRight13 />
        </div>
      </div>
    </div>
  );
}

function SectionCards() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-h-px relative w-full" data-name="SectionCards">
      <SectionCard />
      <SectionCard1 />
      <SectionCard2 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="flex-[1_0_0] min-w-px relative self-stretch" data-name="MainContent">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start p-[12px] relative size-full">
          <DropZone />
          <TopRow />
          <SectionCards />
        </div>
      </div>
    </div>
  );
}

function Body() {
  return (
    <div className="h-[976px] relative shrink-0 w-full" data-name="Body">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start overflow-clip relative rounded-[inherit] size-full">
        <VerticalStrip />
        <FilterPanel />
        <MainContent />
      </div>
    </div>
  );
}

export default function AdaVisionChecker() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="ADA Vision Checker">
      <HeaderBar />
      <Body />
    </div>
  );
}