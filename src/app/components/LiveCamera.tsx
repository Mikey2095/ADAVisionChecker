import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, CameraOff, FlipHorizontal, ChevronDown, ChevronUp, AlertTriangle, Loader2 } from 'lucide-react';

// ── Filter data ───────────────────────────────────────────────────────────────

const COLOR_FILTERS = [
  { id: 'none',          name: 'Normal',        sub: 'Full color reference'            },
  { id: 'protanopia',    name: 'Protanopia',     sub: 'Red-blind · ~0.8% of males'     },
  { id: 'deuteranopia',  name: 'Deuteranopia',   sub: 'Green-blind · ~1.0% of males'   },
  { id: 'tritanopia',    name: 'Tritanopia',     sub: 'Blue-blind · ~0.01% of pop.'    },
  { id: 'achromatopsia', name: 'Achromatopsia',  sub: 'No color · ~0.003% of pop.'     },
  { id: 'protanomaly',   name: 'Protanomaly',    sub: 'Reduced red · ~1.0% of males'   },
  { id: 'deuteranomaly', name: 'Deuteranomaly',  sub: 'Reduced green · ~5.0% of males' },
] as const;

const CONTRAST_FILTERS = [
  { id: 'none',          name: 'Normal',         sub: 'No modification',               css: '' },
  { id: 'low-contrast',  name: 'Low Contrast',   sub: 'Compressed dynamic range',      css: 'contrast(0.45) brightness(1.06)' },
  { id: 'high-contrast', name: 'High Contrast',  sub: 'OS accessibility override',     css: 'contrast(3.5) saturate(1.8)' },
  { id: 'washed-out',    name: 'Overexposed',    sub: 'Photophobia + low range',       css: 'brightness(1.9) contrast(0.35) saturate(0.55)' },
] as const;

type ColorId    = (typeof COLOR_FILTERS)[number]['id'];
type ContrastId = (typeof CONTRAST_FILTERS)[number]['id'];
interface SpatialState { lowVision: boolean; glaucoma: boolean; macular: boolean; cataracts: boolean }

// ── Constraint chain — loosens progressively until getUserMedia succeeds ──────

const CONSTRAINT_CHAIN = (facing: 'environment' | 'user'): MediaStreamConstraints[] => [
  { video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 720 } } },
  { video: { facingMode: { ideal: facing } } },
  { video: { facingMode: facing } },
  { video: true },
];

// ── Error classification ──────────────────────────────────────────────────────

type CameraError = 'denied' | 'in-use' | 'not-found' | 'iframe' | 'unknown';

function classifyError(err: unknown): CameraError {
  if (!(err instanceof Error)) return 'unknown';
  switch (err.name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      return 'denied';
    case 'NotReadableError':
    case 'TrackStartError':
      return 'in-use';
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return 'not-found';
    case 'SecurityError':
      return 'iframe';
    default:
      return 'unknown';
  }
}

// ── CSS filter builder ────────────────────────────────────────────────────────

function buildCssFilter(colorId: ColorId, contrastId: ContrastId, spatial: SpatialState): string | undefined {
  const contrastCss = CONTRAST_FILTERS.find(f => f.id === contrastId)!.css;
  const blurPx = (spatial.lowVision ? 4 : 0) + (spatial.cataracts ? 2 : 0);
  const parts = [
    colorId !== 'none' ? `url(#${colorId})` : '',
    contrastCss,
    blurPx > 0 ? `blur(${blurPx}px)` : '',
  ].filter(Boolean);
  return parts.length ? parts.join(' ') : undefined;
}

function activeLabel(colorId: ColorId, contrastId: ContrastId, spatial: SpatialState): string {
  const parts = [
    colorId !== 'none'    ? COLOR_FILTERS.find(f => f.id === colorId)!.name    : null,
    contrastId !== 'none' ? CONTRAST_FILTERS.find(f => f.id === contrastId)!.name : null,
    spatial.lowVision ? 'Low Vision'     : null,
    spatial.glaucoma  ? 'Glaucoma'       : null,
    spatial.macular   ? 'Macular Degen.' : null,
    spatial.cataracts ? 'Cataracts'      : null,
  ].filter(Boolean);
  return parts.length ? parts.join(' + ') : 'Normal Vision';
}

// ── UI primitives ─────────────────────────────────────────────────────────────

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-none px-3.5 py-2.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all active:scale-95 touch-manipulation ${
        active ? 'bg-white text-[#0c0c0f] shadow-sm' : 'bg-white/15 text-white/80 hover:bg-white/25'
      }`}
    >
      {label}
    </button>
  );
}

function SpatialToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`flex-none flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all active:scale-95 touch-manipulation border ${
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

type Status = 'idle' | 'requesting' | 'granted' | 'error';

export function LiveCamera() {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status,      setStatus]      = useState<Status>('idle');
  const [cameraError, setCameraError] = useState<CameraError | null>(null);
  const [facingMode,  setFacingMode]  = useState<'environment' | 'user'>('environment');
  const [panelOpen,   setPanelOpen]   = useState(true);

  const [colorId,    setColorId]    = useState<ColorId>('none');
  const [contrastId, setContrastId] = useState<ContrastId>('none');
  const [spatial,    setSpatial]    = useState<SpatialState>({
    lowVision: false, glaucoma: false, macular: false, cataracts: false,
  });

  const toggleSpatial = (key: keyof SpatialState) =>
    setSpatial(prev => ({ ...prev, [key]: !prev[key] }));

  // ── Wire stream to video whenever the stream ref or status changes ────────
  // This fires AFTER React commits the render, so videoRef.current is always valid.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamRef.current) return;
    if (video.srcObject === streamRef.current) return; // already wired
    video.srcObject = streamRef.current;
    video.play().catch(() => {
      // AbortError is normal when play() is interrupted by a rapid flip — ignore
    });
  }, [status]); // re-runs whenever status changes to 'granted'

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    stopStream();
    setStatus('requesting');
    setCameraError(null);

    // No API → likely SecurityError from an iframe without allow="camera"
    if (!navigator.mediaDevices?.getUserMedia) {
      const inIframe = (() => { try { return window.self !== window.top; } catch { return true; } })();
      setCameraError(inIframe ? 'iframe' : 'unknown');
      setStatus('error');
      return;
    }

    let lastError: CameraError = 'unknown';

    for (const constraints of CONSTRAINT_CHAIN(facing)) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        // DON'T touch videoRef here — the video element may be unmounted right now
        // because status is still 'requesting'. The useEffect above wires it after
        // React commits the 'granted' render and videoRef.current becomes valid.
        setStatus('granted');
        return;
      } catch (err) {
        const kind = classifyError(err);
        if (kind === 'denied' || kind === 'not-found' || kind === 'iframe') {
          setCameraError(kind);
          setStatus('error');
          return;
        }
        lastError = kind;
        // OverconstrainedError / in-use → try next looser constraint set
      }
    }

    setCameraError(lastError);
    setStatus('error');
  }, [stopStream]);

  // Cleanup on unmount
  useEffect(() => () => { stopStream(); }, [stopStream]);

  const flipCamera = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    startCamera(next);
  };

  const cssFilter = buildCssFilter(colorId, contrastId, spatial);
  const label     = activeLabel(colorId, contrastId, spatial);
  const hasAny    = colorId !== 'none' || contrastId !== 'none' || Object.values(spatial).some(Boolean);
  const isLive    = status === 'granted';

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden bg-[#0c0c0f] rounded-xl">

      {/* ── Camera viewport — video is ALWAYS in the DOM so the ref is always valid ── */}
      <div className="relative flex-1 min-h-0 overflow-hidden bg-black">

        {/* Video element — always mounted, hidden behind overlays when not live */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onLoadedMetadata={() => {
            // Safari sometimes stalls; nudge play after dimensions are known
            videoRef.current?.play().catch(() => {});
          }}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{
            filter: isLive ? cssFilter : undefined,
            transform: facingMode === 'user' ? 'scaleX(-1)' : undefined,
            opacity: isLive ? 1 : 0,
          }}
        />

        {/* ── Overlay: Idle ── */}
        {status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center bg-[#f5f5f7]">
            <div className="w-20 h-20 bg-[#0c0c0f] rounded-2xl flex items-center justify-center shadow-lg">
              <Camera className="w-9 h-9 text-white" />
            </div>
            <div className="max-w-xs">
              <p className="text-[20px] font-semibold tracking-[-0.4px] text-[#0c0c0f] mb-2">Live Vision Simulator</p>
              <p className="text-[13px] text-[#4b5563] leading-relaxed">
                See the world through different eyes in real time. Apply color blindness, contrast,
                and spatial effects to your live camera feed.
              </p>
            </div>
            <button
              onClick={() => startCamera(facingMode)}
              className="flex items-center gap-2.5 px-6 py-3 bg-[#0c0c0f] text-white text-[14px] font-semibold rounded-[12px] hover:bg-[#1f2937] active:scale-95 transition-all shadow-sm touch-manipulation"
            >
              <Camera style={{ width: 18, height: 18 }} />
              Start Camera
            </button>
            <p className="text-[11px] text-[#9ca3af]">You'll be asked to allow camera access</p>
          </div>
        )}

        {/* ── Overlay: Requesting ── */}
        {status === 'requesting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center bg-[#f5f5f7]">
            <div className="w-16 h-16 bg-[#f0f0f0] border border-[#e0e0e8] rounded-2xl flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-[#6b7280] animate-spin" />
            </div>
            <div>
              <p className="text-[16px] font-semibold text-[#0c0c0f] mb-1">Starting camera…</p>
              <p className="text-[13px] text-[#4b5563]">Allow access when your browser prompts you.</p>
            </div>
          </div>
        )}

        {/* ── Overlay: Error ── */}
        {status === 'error' && (() => {
          const copy = {
            denied:     { title: 'Camera access blocked',           body: "Tap the camera icon in your browser's address bar, set it to Allow, then try again.", hint: undefined,                                         icon: <CameraOff className="w-7 h-7 text-red-400" />,          bg: 'bg-red-50 border-red-200' },
            'in-use':   { title: 'Camera is in use',                body: 'Another app or tab is using your camera. Close it and try again.',                      hint: undefined,                                         icon: <CameraOff className="w-7 h-7 text-red-400" />,          bg: 'bg-red-50 border-red-200' },
            'not-found':{ title: 'No camera found',                 body: 'No camera hardware was detected on this device.',                                        hint: undefined,                                         icon: <CameraOff className="w-7 h-7 text-red-400" />,          bg: 'bg-red-50 border-red-200' },
            iframe:     { title: 'Camera blocked by preview frame', body: 'This preview runs in an embedded frame that blocks camera access.',                     hint: 'Open this app in a new browser tab to use the camera.', icon: <AlertTriangle className="w-7 h-7 text-amber-400" />,    bg: 'bg-amber-50 border-amber-200' },
            unknown:    { title: 'Camera unavailable',              body: 'Could not start the camera. Make sure you\'re on HTTPS in a modern browser.',           hint: 'Try Chrome or Safari on your device.',                 icon: <CameraOff className="w-7 h-7 text-red-400" />,          bg: 'bg-red-50 border-red-200' },
          }[cameraError ?? 'unknown'];
          const isIframe = cameraError === 'iframe';
          return (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center bg-[#f5f5f7]">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${copy.bg}`}>{copy.icon}</div>
              <div className="max-w-sm">
                <p className="text-[17px] font-semibold text-[#0c0c0f] mb-2">{copy.title}</p>
                <p className="text-[13px] text-[#4b5563] leading-relaxed">{copy.body}</p>
                {copy.hint && (
                  <p className="text-[12px] text-[#6b7280] mt-2 px-3 py-2 bg-white border border-[#e0e0e8] rounded-[8px]">{copy.hint}</p>
                )}
              </div>
              {isIframe
                ? <button onClick={() => window.open(window.location.href, '_blank')} className="flex items-center gap-2 px-5 py-2.5 bg-[#0c0c0f] text-white text-[13px] font-semibold rounded-[10px] hover:bg-[#1f2937] active:scale-95 transition-all touch-manipulation">Open in new tab ↗</button>
                : <button onClick={() => startCamera(facingMode)} className="flex items-center gap-2 px-5 py-2.5 bg-[#0c0c0f] text-white text-[13px] font-semibold rounded-[10px] hover:bg-[#1f2937] active:scale-95 transition-all touch-manipulation"><Camera className="w-4 h-4" />Try again</button>
              }
            </div>
          );
        })()}

        {/* ── Live overlays (only when camera is running) ── */}
        {isLive && (
          <>
            {/* Glaucoma vignette */}
            {spatial.glaucoma && (
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse at center, transparent 22%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.97) 72%)',
              }} />
            )}
            {/* Macular scotoma */}
            {spatial.macular && (
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.90) 12%, rgba(0,0,0,0.50) 28%, transparent 52%)',
              }} />
            )}
            {/* Cataracts tint */}
            {spatial.cataracts && (
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: 'rgba(255,230,140,0.22)' }} />
            )}

            {/* Active filter label */}
            <div
              className="absolute top-0 left-0 right-0 px-4 pt-4 pb-10 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)' }}
            >
              <p className={`text-[15px] font-semibold text-white leading-tight tracking-[-0.2px] ${!hasAny ? 'opacity-50' : ''}`}>
                {label}
              </p>
              {hasAny && colorId !== 'none' && (
                <p className="text-[11px] text-white/65 mt-0.5">{COLOR_FILTERS.find(f => f.id === colorId)!.sub}</p>
              )}
            </div>

            {/* Controls: panel toggle (mobile) + flip button */}
            <div className="absolute bottom-3 left-0 right-0 flex items-end justify-between px-3 pointer-events-none">
              <button
                onClick={() => setPanelOpen(v => !v)}
                className="pointer-events-auto md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white text-[11px] font-medium hover:bg-black/70 transition-colors touch-manipulation"
              >
                {panelOpen
                  ? <><ChevronDown className="w-3.5 h-3.5" />Hide filters</>
                  : <><ChevronUp   className="w-3.5 h-3.5" />Show filters</>
                }
              </button>
              <div className="flex-1" />
              <button
                onClick={flipCamera}
                title="Flip camera"
                className="pointer-events-auto w-11 h-11 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/70 active:scale-95 transition-all touch-manipulation"
              >
                <FlipHorizontal style={{ width: 18, height: 18 }} className="text-white" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Filter panel ── */}
      <div
        className={`
          bg-[#0c0c0f] flex flex-col overflow-hidden
          transition-all duration-300 ease-in-out
          md:w-72 md:border-l md:border-white/10 md:overflow-y-auto md:max-h-full
          ${panelOpen ? 'max-h-[52vh]' : 'max-h-0'}
          md:max-h-full
        `}
      >
        <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-1 min-h-0">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[1px] text-white/40 mb-2.5">Color Vision</p>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
              {COLOR_FILTERS.map(f => (
                <FilterPill key={f.id} label={f.name} active={colorId === f.id} onClick={() => setColorId(f.id)} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[1px] text-white/40 mb-2.5">Contrast</p>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
              {CONTRAST_FILTERS.map(f => (
                <FilterPill key={f.id} label={f.name} active={contrastId === f.id} onClick={() => setContrastId(f.id)} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[1px] text-white/40 mb-2.5">Additional Effects</p>
            <div className="flex gap-1.5 flex-wrap">
              <SpatialToggle label="Low Vision"     checked={spatial.lowVision} onChange={() => toggleSpatial('lowVision')} />
              <SpatialToggle label="Glaucoma"       checked={spatial.glaucoma}  onChange={() => toggleSpatial('glaucoma')} />
              <SpatialToggle label="Macular Degen." checked={spatial.macular}   onChange={() => toggleSpatial('macular')} />
              <SpatialToggle label="Cataracts"      checked={spatial.cataracts} onChange={() => toggleSpatial('cataracts')} />
            </div>
          </div>

          {hasAny && (
            <button
              onClick={() => { setColorId('none'); setContrastId('none'); setSpatial({ lowVision: false, glaucoma: false, macular: false, cataracts: false }); }}
              className="text-[12px] text-white/40 hover:text-white/70 transition-colors text-left touch-manipulation"
            >
              Reset all →
            </button>
          )}

          <div className="mt-auto pt-3 border-t border-white/10">
            <p className="text-[10px] text-white/30 leading-relaxed">
              Filters apply to your live camera feed in real time. Simulations are clinical approximations for research and design evaluation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
