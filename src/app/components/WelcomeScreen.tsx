import { useRef, useState, DragEvent } from 'react';
import { Eye, Upload, BarChart3, Layers, Users, ChevronRight } from 'lucide-react';

interface Props {
  onFile: (f: File) => void;
}

const SECTION_DATA = [
  {
    icon: <Eye className="w-[17px] h-[17px]" />,
    accentColor: '#6b7280',
    label: 'Color Vision Deficiency',
    tagline: 'How 1 in 12 men perceive color differently',
    normalView:
      'Most people see roughly 1 million distinct colors by combining signals from three cone types — L (red), M (green), and S (blue). Traffic lights, charts, error states, and call-to-action buttons rely on this full spectrum being visible.',
    impairmentView:
      'With a missing or shifted cone type, entire color dimensions collapse. A "red error banner" and a "green success banner" can look identical. Links that are only colored — not underlined — become invisible. Pie charts with only hue differences are unreadable.',
    filters: [
      { name: 'Protanopia', note: 'Red-blind · ~0.8% of males · reds appear dark gray' },
      { name: 'Deuteranopia', note: 'Green-blind · ~1% of males · most testable for WCAG 1.4.1' },
      { name: 'Tritanopia', note: 'Blue-blind · ~0.01% · blues appear green' },
      { name: 'Achromatopsia', note: 'No color at all · ~0.003% · grayscale only' },
      { name: 'Protanomaly / Deuteranomaly', note: 'Partial shifts · most common · ~6% of males combined' },
    ],
    wcagNote: 'WCAG 1.4.1 — Color must not be the only visual means of conveying information.',
  },
  {
    icon: <BarChart3 className="w-[17px] h-[17px]" />,
    accentColor: '#6b7280',
    label: 'Contrast Sensitivity',
    tagline: 'How luminance differences are perceived across conditions',
    normalView:
      'A person with normal contrast sensitivity can distinguish subtle tonal differences — light gray text on white, faint divider lines, ghost buttons. These low-contrast elements still feel readable and distinct because the visual system is detecting small luminance steps.',
    impairmentView:
      "Conditions like cataracts, glaucoma, diabetic retinopathy, and aging reduce the visual system's ability to detect these small luminance steps. A light gray label on a white card becomes invisible. 'Placeholder' text in form fields disappears. Ghost buttons look like flat boxes with no affordance.",
    filters: [
      { name: 'Low Contrast Sensitivity', note: 'Dynamic range compressed to ~45% — common in aging and eye disease' },
      { name: 'High Contrast Mode', note: 'OS-level forced colors — used by ~7% of Windows users' },
      { name: 'Overexposed / Washed Out', note: 'Photophobia (albinism, aniridia) — bright whites are blinding' },
    ],
    wcagNote: 'WCAG 1.4.3 — Normal text must achieve 4.5:1 contrast ratio. WCAG 1.4.6 — AAA requires 7:1.',
  },
  {
    icon: <Layers className="w-[17px] h-[17px]" />,
    accentColor: '#6b7280',
    label: 'Additional Effects',
    tagline: 'Structural and spatial vision conditions',
    normalView:
      'Standard vision covers roughly a 200° horizontal field with sharp detail in the center ~2° (the fovea). Peripheral vision handles motion, navigation awareness, and the sense of spatial context. Both work together to let users scan a full page layout effortlessly.',
    impairmentView:
      'Structural eye conditions selectively destroy different regions of the visual field. A user with glaucoma may not see the navigation bar at all — it falls outside their remaining tunnel. A user with macular degeneration cannot see the center of the screen where most body text sits. Cataracts make the whole world foggy and yellow-tinted.',
    filters: [
      { name: 'Low Vision', note: 'Acuity worse than 20/60 — ~246 million globally (WHO 2019)' },
      { name: 'Glaucoma', note: 'Peripheral field loss — edges of screen disappear' },
      { name: 'Macular Degeneration', note: 'Central scotoma — center of screen is a blind spot' },
      { name: 'Cataracts', note: 'Blur + yellow tint — leading cause of blindness globally' },
    ],
    wcagNote: 'WCAG 1.4.4 — Text must be resizable to 200% without loss of content.',
  },
];

function SectionCard({ section }: { section: (typeof SECTION_DATA)[number] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#f5f5f7] rounded-[12px] border border-[#e0e0e8] overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3.5 px-[18px] py-3.5 text-left hover:bg-[#ebebef] transition-colors"
      >
        <div className="bg-[#ebebef] border border-[#e0e0e8] w-9 h-9 rounded-[10px] flex items-center justify-center flex-none text-[#6b7280]">
          {section.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold tracking-[-0.2px] text-[#0c0c0f] leading-5">{section.label}</p>
          <p className="text-[13px] text-[#4b5563] leading-[17px]">{section.tagline}</p>
        </div>
        <ChevronRight
          className={`w-[13px] h-[13px] text-[#6b7280] flex-none transition-transform ${open ? 'rotate-90' : ''}`}
        />
      </button>

      {open && (
        <div className="px-[18px] pb-[18px] space-y-3 border-t border-[#e0e0e8]">
          <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white rounded-[10px] p-3.5 border border-[#e0e0e8]">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[9px] font-semibold text-[#444] uppercase tracking-[1.2px]">Average Person Sees</span>
              </div>
              <p className="text-xs text-[#4b5563] leading-relaxed">{section.normalView}</p>
            </div>
            <div className="bg-white rounded-[10px] p-3.5 border border-[#e0e0e8]">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0c0c0f]" />
                <span className="text-[9px] font-semibold text-[#444] uppercase tracking-[1.2px]">Impaired Vision Sees</span>
              </div>
              <p className="text-xs text-[#4b5563] leading-relaxed">{section.impairmentView}</p>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#374151] mb-2">Available Simulations</p>
            <div className="space-y-1">
              {section.filters.map(f => (
                <div key={f.name} className="flex items-start gap-2 px-2.5 py-2 bg-[#f0f0f0] rounded-[6px]">
                  <div className="w-1.5 h-1.5 rounded-full flex-none mt-1" style={{ backgroundColor: '#3a3a3a' }} />
                  <div>
                    <span className="text-[12px] font-medium text-[#0c0c0f]">{f.name}</span>
                    <span className="text-xs text-[#4b5563] ml-2">{f.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 px-2.5 py-2 bg-[#ebebef] border border-[#e0e0e8] rounded-[6px]">
            <span className="text-[9px] font-mono font-semibold text-[#444] flex-none">WCAG</span>
            <p className="text-xs text-[#4b5563]">{section.wcagNote}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function WelcomeScreen({ onFile }: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) onFile(file);
  };

  return (
    <div className="flex-1 flex flex-col gap-2 overflow-y-auto min-h-0">
      {/* Upload zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`bg-white rounded-[14px] border-2 border-dashed cursor-pointer transition-all h-[160px] sm:h-[180px] flex flex-col items-center justify-center gap-2.5 ${
          dragging
            ? 'border-[#0c0c0f] bg-[#f5f5f7]'
            : 'border-[#e0e0e8] hover:border-[#c0c0c8]'
        }`}
      >
        <div className="bg-[#f5f5f7] border border-[#e0e0e8] w-10 h-10 rounded-[10px] flex items-center justify-center">
          <Upload className="w-5 h-5 text-[#6b7280]" />
        </div>
        <div className="text-center">
          <p className="text-[15px] font-semibold text-[#1f2937] leading-5">Drop an image here to begin</p>
          <p className="text-[12px] text-[#4b5563] leading-[17px]">or click to browse — JPG · PNG · WebP · GIF · SVG</p>
        </div>
      </div>

      {/* How to use card */}
      <div className="bg-[#f5f5f7] rounded-[14px] border border-[#e0e0e8] p-[22px]">
        {/* Title row */}
        <div className="flex items-center gap-3 mb-2.5">
          <div className="bg-[#e1e1e8] border border-[#e0e0e8] w-10 h-10 rounded-[10px] flex items-center justify-center flex-none">
            <Eye className="w-5 h-5 text-[#6b7280]" />
          </div>
          <p className="text-[20px] font-semibold tracking-[-0.4px] text-[#0c0c0f]">How to use this tool</p>
        </div>

        <p className="text-[13px] text-[#4b5563] leading-5 mb-3.5">
          Upload any webpage screenshot, design mockup, or image — then apply filters from the
          sidebar to see it through the eyes of someone with a visual impairment. Each simulation
          is grounded in peer-reviewed clinical research and W3C WCAG 2.1 standards.
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { num: '01', title: 'Upload an image', body: 'Screenshot a webpage, drop in a UI mockup, or use any JPG, PNG, or WebP.' },
            { num: '02', title: 'Select a simulation', body: 'Pick a color vision deficiency and/or a contrast sensitivity condition from the sidebar.' },
            { num: '03', title: 'Compare side-by-side', body: 'The original and simulated views appear next to each other for direct comparison.' },
          ].map(s => (
            <div key={s.num} className="bg-[#ebebef] border border-[#e0e0e8] rounded-[10px] p-3 flex flex-col gap-1">
              <p className="text-[20px] text-[#c8c8d4] leading-[26px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.num}</p>
              <p className="text-[13px] font-semibold text-[#0c0c0f] leading-[17px]">{s.title}</p>
              <p className="text-[12px] text-[#4b5563] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-0.5 mt-3">
          {[
            { stat: '~300M', label: 'people live with color vision deficiency' },
            { stat: '~246M', label: 'people globally have low vision (WHO)' },
            { stat: '1 in 12', label: 'males are color blind in some form' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1.5">
              <Users className="w-3 h-3 text-[#9ca3af]" />
              <span className="text-[13px] font-semibold text-[#1f2937]">{s.stat}</span>
              <span className="text-[12px] text-[#4b5563]">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section cards */}
      <div className="flex flex-col gap-1.5">
        {SECTION_DATA.map(section => (
          <SectionCard key={section.label} section={section} />
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }}
      />
    </div>
  );
}
