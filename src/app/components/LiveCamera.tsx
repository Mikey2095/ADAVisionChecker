import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, CameraOff, FlipHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

// ── Filter definitions (mirrors App.tsx) ─────────────────────────────────────

const COLOR_FILTERS = [
  { id: 'none',         name: 'Normal Vision',   sub: 'Full color reference',          blendColor: null },
  { id: 'protanopia',   name: 'Protanopia',       sub: 'Red-blind · ~0.8% of males',    blendColor: '#ef4444' },
  { id: 'deuteranopia', name: 'Deuteranopia',     sub: 'Green-blind · ~1.0% of males',  blendColor: '#22c55e' },
  { id: 'tritanopia',   name: 'Tritanopia',       sub: 'Blue-blind · ~0.01% of pop.',   blendColor: '#3b82f6' },
  { id: 'achromatopsia',name: 'Achromatopsia',    sub: 'No color · ~0.003% of pop.',    blendColor: '#9ca3af' },
  { id: 'protanomaly',  name: 'Protanomaly',      sub: 'Reduced red · ~1.0% of males',  blendColor: '#f97316' },
  { id: 'deuteranomaly',name: 'Deuteranomaly',    sub: 'Reduced green · ~5.0% of males',blendColor: '#84cc16' },
] as const;

const CONTRAST_FILTERS = [
  { id: 'none',         name: 'Normal Contrast',          sub: 'No modification',                       css: '' },
  { id: 'low-contrast', name: 'Low Contrast',             sub: 'Compressed dynamic range',              css: 'contrast(0.45) brightness(1.06)' },
  { id: 'high-contrast',name: 'High Contrast Mode',       sub: 'OS accessibility override',             css: 'contrast(3.5) saturate(1.8)' },
  { id: 'washed-out',   name: 'Overexposed',              sub: 'Photophobia + low dynamic range',       css: 'brightness(1.9) contrast(0.35) saturate(0.55)' },
] as const;

type ColorId = (typeof COLOR_FILTERS)[number]['id'];
type ContrastId = (typeof CONTRAST_FILTERS)[number]['id'];

interface SpatialState { lowVision: boolean; glaucoma: boolean; macular: boolean; cataracts: boolean; }

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildFilter(colorId: ColorId, contrastId: ContrastId, spatial: SpatialState): string {
  const contrastCss = CONTRAST_FILTERS.find(f => f.id === contrastId)!.css;
  const blurPx = (spatial.lowVision ? 4 : 0) + (spatial.cataracts ? 2 : 0);
  return [
    colorId !== 'none' ? `url(#${colorId})` : '',
    contrastCss,
    blurPx > 0 ? `blur(${blurPx}px)` : '',
  ].filter(Boolean).join(' ') || 'none';
}

function activeLabel(colorId: ColorId, contrastId: ContrastId, spatial: SpatialState): string {
  const parts: string[] = [];
  if (colorId !== 'none') parts.push(COLOR_FILTERS.find(f => f.id === colorId)!.name);
  if (contrastId !== 'none') parts.push(CONTRAST_FILTERS.find(f => f.id === contrastId)!.name);
  if (spatial.lowVision) parts.push('Low Vision');
  if (spatial.glaucoma) parts.push('Glaucoma');
  if (spatial.macular) parts.push('Macular Degen.');
  if (spatial.cataracts) parts.push('Cataracts');
  return parts.length ? parts.join(' + ') : 'Normal Vision';
}

function activeSub(colorId: ColorId, contrastId: ContrastId): string {
  if (colorId !== 'none') return COLOR_FILTERS.find(f => f.id === colorId)!.sub;
  if (contrastId !== 'none') return CONTRAST_FILTERS.find(f => f.id === contrastId)!.sub;
  return 'No simulation active — reference view';
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FilterPill({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-none px-3 py-2 rounded-full text-[12px] font-medium whitespace-nowrap transition-all ${
        active
          ? 'bg-white text-[#0c0c0f] shadow-sm'
          : 'bg-white/15 text-white/80 hover:bg-white/25'
      }`}
    >
      {label}
    </button>
  );
}

function SpatialToggle({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`flex-none flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-medium whitespace-nowrap transition-all border ${
        checked
          ? 'bg-white text-[#0c0c0f] border-white shadow-sm'
          : 'bg-transparent text-white/80 border-white/30 hover:border-white/60'
      }`}
    >
      <div className={`w-2 h-2 rounded-full flex-none ${checked ? 'bg-[#0c0c0f]' : 'bg-white/50'}`} />
      {label}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type PermissionState = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable';

export function LiveCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [permission, setPermission] = useState<PermissionState>('idle');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [panelOpen, setPanelOpen] = useState(true);

  const [colorId, setColorId] = useState<ColorId>('none');
  const [contrastId, setContrastId] = useState<ContrastId>('none');
  const [spatial, setSpatial] = useState<SpatialState>({
    lowVision: false, glaucoma: false, macular: false, cataracts: false,
  });

  const toggleSpatial = (key: keyof SpatialState) =>
    setSpatial(prev => ({ ...prev, [key]: !prev[key] }));

  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setPermission('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setPermission('granted');
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setPermission('denied');
      } else {
        setPermission('unavailable');
      }
    }
  }, []);

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermission('unavailable');
      return;
    }
    startCamera(facingMode);
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const flipCamera = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    startCamera(next);
  };

  const cssFilter = buildFilter(colorId, contrastId, spatial);
  const label = activeLabel(colorId, contrastId, spatial);
  const sub = activeSub(colorId, contrastId);
  const hasAny = colorId !== 'none' || contrastId !== 'none' || Object.values(spatial).some(Boolean);

  // ── Permission / unavailable screens ──
  if (permission === 'unavailable') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="w-16 h-16 bg-[#f0f0f0] border border-[#e0e0e8] rounded-2xl flex items-center justify-center">
          <CameraOff className="w-7 h-7 text-[#6b7280]" />
        </div>
        <div>
          <p className="text-[16px] font-semibold text-[#0c0c0f] mb-1">Camera not available</p>
          <p className="text-sm text-[#4b5563] max-w-xs">
            Your browser or device does not support camera access. Try opening this page in a modern mobile browser.
          </p>
        </div>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="w-16 h-16 bg-[#fff3f3] border border-red-200 rounded-2xl flex items-center justify-center">
          <CameraOff className="w-7 h-7 text-red-400" />
        </div>
        <div>
          <p className="text-[16px] font-semibold text-[#0c0c0f] mb-1">Camera access denied</p>
          <p className="text-sm text-[#4b5563] max-w-xs mb-4">
            Allow camera access in your browser settings and then reload the page to use the live vision simulator.
          </p>
        </div>
        <button
          onClick={() => startCamera(facingMode)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0c0c0f] text-white text-sm font-medium rounded-[10px] hover:bg-[#1f2937] transition-colors"
        >
          <Camera className="w-4 h-4" />
          Try again
        </button>
      </div>
    );
  }

  if (permission === 'idle' || permission === 'requesting') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="w-16 h-16 bg-[#f0f0f0] border border-[#e0e0e8] rounded-2xl flex items-center justify-center">
          <Camera className="w-7 h-7 text-[#6b7280] animate-pulse" />
        </div>
        <div>
          <p className="text-[16px] font-semibold text-[#0c0c0f] mb-1">Accessing camera…</p>
          <p className="text-sm text-[#4b5563]">Please allow camera access when prompted.</p>
        </div>
      </div>
    );
  }

  // ── Live camera view ──
  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-0 gap-0 overflow-hidden bg-black rounded-xl">

      {/* ── Camera viewport ── */}
      <div className="relative flex-1 min-h-0 overflow-hidden bg-black">
        {/* Video feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: cssFilter, transform: facingMode === 'user' ? 'scaleX(-1)' : undefined }}
        />

        {/* Glaucoma vignette */}
        {spatial.glaucoma && (
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at center, transparent 22%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.97) 72%)',
          }} />
        )}

        {/* Macular degeneration scotoma */}
        {spatial.macular && (
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.90) 12%, rgba(0,0,0,0.50) 28%, transparent 52%)',
          }} />
        )}

        {/* Cataracts tint */}
        {spatial.cataracts && (
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: 'rgba(255, 230, 140, 0.22)' }} />
        )}

        {/* Active filter label — top of frame */}
        <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)' }}
        >
          <p className={`text-[15px] font-semibold text-white leading-tight tracking-[-0.2px] ${!hasAny ? 'opacity-60' : ''}`}>
            {label}
          </p>
          <p className="text-[11px] text-white/70 mt-0.5">{sub}</p>
        </div>

        {/* Camera flip button — bottom-right of video */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-2">
          <button
            onClick={flipCamera}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/70 transition-colors"
            title="Flip camera"
          >
            <FlipHorizontal className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Mobile: panel collapse toggle — bottom-center of video */}
        <button
          onClick={() => setPanelOpen(v => !v)}
          className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white text-[11px] font-medium hover:bg-black/70 transition-colors"
        >
          {panelOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          {panelOpen ? 'Hide filters' : 'Show filters'}
        </button>
      </div>

      {/* ── Filter panel ── */}
      <div
        className={`
          bg-[#0c0c0f] flex flex-col overflow-hidden
          transition-all duration-300 ease-in-out
          md:w-72 md:border-l md:border-white/10 md:max-h-full md:overflow-y-auto
          ${panelOpen
            ? 'max-h-[55vh] md:max-h-full'
            : 'max-h-0 md:max-h-full'}
        `}
      >
        <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-1">

          {/* Color Vision */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[1px] text-white/40 mb-2">Color Vision Deficiency</p>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
              {COLOR_FILTERS.map(f => (
                <FilterPill
                  key={f.id}
                  label={f.name}
                  active={colorId === f.id}
                  onClick={() => setColorId(f.id)}
                />
              ))}
            </div>
          </div>

          {/* Contrast */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[1px] text-white/40 mb-2">Contrast Sensitivity</p>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
              {CONTRAST_FILTERS.map(f => (
                <FilterPill
                  key={f.id}
                  label={f.name}
                  active={contrastId === f.id}
                  onClick={() => setContrastId(f.id)}
                />
              ))}
            </div>
          </div>

          {/* Spatial / Additional */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[1px] text-white/40 mb-2">Additional Effects</p>
            <div className="flex gap-1.5 flex-wrap">
              <SpatialToggle label="Low Vision"  checked={spatial.lowVision} onChange={() => toggleSpatial('lowVision')} />
              <SpatialToggle label="Glaucoma"    checked={spatial.glaucoma}  onChange={() => toggleSpatial('glaucoma')} />
              <SpatialToggle label="Macular Degen." checked={spatial.macular} onChange={() => toggleSpatial('macular')} />
              <SpatialToggle label="Cataracts"   checked={spatial.cataracts} onChange={() => toggleSpatial('cataracts')} />
            </div>
          </div>

          {/* Reset */}
          {hasAny && (
            <button
              onClick={() => {
                setColorId('none');
                setContrastId('none');
                setSpatial({ lowVision: false, glaucoma: false, macular: false, cataracts: false });
              }}
              className="text-[12px] text-white/40 hover:text-white/70 transition-colors text-left"
            >
              Reset all filters →
            </button>
          )}

          {/* Info note */}
          <div className="mt-auto pt-2 border-t border-white/10">
            <p className="text-[10px] text-white/30 leading-relaxed">
              Filters are applied in real-time to your camera feed. Simulations are clinical approximations for research and design evaluation.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
