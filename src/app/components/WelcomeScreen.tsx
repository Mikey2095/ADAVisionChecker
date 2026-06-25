import { useRef, useState, DragEvent } from 'react';
import { Eye, Upload, Contrast, Layers, Users, ChevronRight } from 'lucide-react';

interface Props {
  onFile: (f: File) => void;
}

const SECTION_DATA = [
  {
    icon: <Eye className="w-5 h-5" />,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/15 border-blue-500/25',
    accentColor: '#3b82f6',
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
    icon: <Contrast className="w-5 h-5" />,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/15 border-purple-500/25',
    accentColor: '#a78bfa',
    label: 'Contrast Sensitivity',
    tagline: 'How luminance differences are perceived across conditions',
    normalView:
      'A person with normal contrast sensitivity can distinguish subtle tonal differences — light gray text on white, faint divider lines, ghost buttons. These low-contrast elements still feel readable and distinct because the visual system is detecting small luminance steps.',
    impairmentView:
      'Conditions like cataracts, glaucoma, diabetic retinopathy, and aging reduce the visual system\'s ability to detect these small luminance steps. A light gray label on a white card becomes invisible. "Placeholder" text in form fields disappears. Ghost buttons look like flat boxes with no affordance.',
    filters: [
      { name: 'Low Contrast Sensitivity', note: 'Dynamic range compressed to ~45% — common in aging and eye disease' },
      { name: 'High Contrast Mode', note: 'OS-level forced colors — used by ~7% of Windows users' },
      { name: 'Overexposed / Washed Out', note: 'Photophobia (albinism, aniridia) — bright whites are blinding' },
    ],
    wcagNote: 'WCAG 1.4.3 — Normal text must achieve 4.5:1 contrast ratio. WCAG 1.4.6 — AAA requires 7:1.',
  },
  {
    icon: <Layers className="w-5 h-5" />,
    iconColor: 'text-orange-400',
    iconBg: 'bg-orange-500/15 border-orange-500/25',
    accentColor: '#f97316',
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

function SectionCard({
  section,
}: {
  section: (typeof SECTION_DATA)[number];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
      style={{ borderTopColor: section.accentColor + '60', borderTopWidth: 2 }}
    >
      {/* Header (always visible) */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start gap-4 p-5 text-left hover:bg-gray-800/40 transition-colors"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-none ${section.iconBg}`}>
          <span style={{ color: section.accentColor }}>{section.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-gray-100">{section.label}</h3>
          </div>
          <p className="text-sm text-gray-400">{section.tagline}</p>
        </div>
        <ChevronRight
          className={`w-4 h-4 text-gray-500 flex-none mt-1 transition-transform ${open ? 'rotate-90' : ''}`}
        />
      </button>

      {/* Expanded body */}
      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-800">
          <div className="pt-4 grid grid-cols-2 gap-3">
            {/* Normal vision */}
            <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-400 uppercase tracking-wider">Average Person Sees</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{section.normalView}</p>
            </div>

            {/* Impaired vision */}
            <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: section.accentColor }} />
                <span className="text-xs uppercase tracking-wider" style={{ color: section.accentColor }}>
                  Impaired Vision Sees
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{section.impairmentView}</p>
            </div>
          </div>

          {/* Filter list */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Available Simulations</p>
            <div className="space-y-1.5">
              {section.filters.map(f => (
                <div key={f.name} className="flex items-start gap-2.5 px-3 py-2 bg-gray-800/40 rounded-lg">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-none mt-1.5"
                    style={{ backgroundColor: section.accentColor }}
                  />
                  <div>
                    <span className="text-sm text-gray-200">{f.name}</span>
                    <span className="text-xs text-gray-500 ml-2">{f.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WCAG note */}
          <div className="flex items-start gap-2 px-3 py-2.5 bg-blue-500/8 border border-blue-500/20 rounded-lg">
            <span className="text-xs font-mono text-blue-400 flex-none">WCAG</span>
            <p className="text-xs text-gray-400">{section.wcagNote}</p>
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
    <div className="flex-1 flex flex-col gap-5 overflow-y-auto min-h-0">
      {/* Hero intro */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-none">
            <Eye className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-gray-100 mb-1">How to use this tool</h2>
            <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
              Upload any webpage screenshot, design mockup, or image — then apply filters from the
              sidebar to see it through the eyes of someone with a visual impairment. Each simulation
              is grounded in peer-reviewed clinical research and W3C WCAG 2.1 standards.
            </p>
          </div>
        </div>

        {/* Step flow */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            {
              step: '1',
              title: 'Upload an image',
              body: 'Screenshot a webpage, drop in a UI mockup, or use any JPG, PNG, or WebP.',
              color: 'text-blue-300',
              bg: 'bg-blue-500/10 border-blue-300/20',
            },
            {
              step: '2',
              title: 'Select a simulation',
              body: 'Pick a color vision deficiency and/or a contrast sensitivity condition from the sidebar.',
              color: 'text-blue-400',
              bg: 'bg-blue-500/10 border-blue-400/20',
            },
            {
              step: '3',
              title: 'Compare side-by-side',
              body: 'The original and simulated views appear next to each other for direct comparison.',
              color: 'text-blue-500',
              bg: 'bg-blue-500/10 border-blue-500/20',
            },
          ].map(s => (
            <div key={s.step} className={`rounded-xl border p-4 ${s.bg}`}>
              <div className={`text-2xl font-mono mb-2 ${s.color}`}>{s.step}</div>
              <p className={`text-sm mb-1 ${s.color}`}>{s.title}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Population stat bar */}
        <div className="mt-5 flex items-center gap-4 flex-wrap">
          {[
            { icon: <Users className="w-3.5 h-3.5" />, stat: '~300M', label: 'people live with color vision deficiency' },
            { icon: <Users className="w-3.5 h-3.5" />, stat: '~246M', label: 'people globally have low vision (WHO)' },
            { icon: <Users className="w-3.5 h-3.5" />, stat: '1 in 12', label: 'males are color blind in some form' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2 text-xs text-gray-500">
              <span className="text-gray-600">{s.icon}</span>
              <span className="text-gray-300">{s.stat}</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Educational cards */}
      <div className="grid grid-cols-1 gap-3">
        {SECTION_DATA.map(section => (
          <SectionCard key={section.label} section={section} />
        ))}
      </div>

      {/* Upload zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed cursor-pointer transition-all p-8 flex flex-col items-center justify-center gap-3 ${
          dragging
            ? 'border-blue-500 bg-blue-500/8'
            : 'border-gray-700 hover:border-gray-500 hover:bg-gray-900/40'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
          <Upload className="w-6 h-6 text-gray-400" />
        </div>
        <div className="text-center">
          <p className="text-gray-300 mb-1">Drop an image here to begin</p>
          <p className="text-sm text-gray-500">or click to browse — JPG · PNG · WebP · GIF · SVG</p>
        </div>
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
