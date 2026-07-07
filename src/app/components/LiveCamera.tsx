import { useRef, useState, useCallback, useEffect } from 'react';
import {
  Camera, CameraOff, FlipHorizontal,
  ChevronDown, ChevronUp, AlertTriangle, Loader2, ExternalLink,
} from 'lucide-react';

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
  { id: 'none',          name: 'Normal',        sub: 'No modification',          css: '' },
  { id: 'low-contrast',  name: 'Low Contrast',  sub: 'Compressed dynamic range', css: 'contrast(0.45) brightness(1.06)' },
  { id: 'high-contrast', name: 'High Contrast', sub: 'OS accessibility override',css: 'contrast(3.5) saturate(1.8)' },
  { id: 'washed-out',    name: 'Overexposed',   sub: 'Photophobia + low range',  css: 'brightness(1.9) contrast(0.35) saturate(0.55)' },
] as const;

type ColorId    = (typeof COLOR_FILTERS)[number]['id'];
type ContrastId = (typeof CONTRAST_FILTERS)[number]['id'];
interface SpatialState { lowVision: boolean; glaucoma: boolean; macular: boolean; cataracts: boolean }

// ── Constraint chain ──────────────────────────────────────────────────────────

const CONSTRAINT_CHAIN = (facing: 'environment' | 'user'): MediaStreamConstraints[] => [
  { video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 720 } } },
  { video: { facingMode: { ideal: facing } } },
  { video: { facingMode: facing } },
  { video: true },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

type CameraError = 'denied' | 'in-use' | 'not-found' | 'policy' | 'insecure' | 'unknown';

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
      return 'policy';
    default:
      return 'unknown';
  }
}

function isInIframe(): boolean {
  try { return window.self !== window.top; } catch { return true; }
}

function isCameraAllowedByPolicy(): boolean {
  try {
    // Chrome 74+ / Edge: document.featurePolicy
    // Chrome 88+ / Edge: document.permissionsPolicy
    const fp = (document as any).featurePolicy ?? (document as any).permissionsPolicy;
    if (fp?.allowsFeature) return fp.allowsFeature('camera');
  } catch {}
  return true; // can't determine — optimistically allow
}

function isSecureContext(): boolean {
  return window.isSecureContext === true;
}

// Prefix avoids colliding with the identical IDs in App.tsx's SvgFilters
const CAM_FILTER_PREFIX = 'cam-';

// SVG feColorMatrix filters embedded directly beside the video element.
// Referencing App.tsx's global filter IDs via url(#id) is unreliable on
// <video> elements — co-locating the defs guarantees they're always in scope.
// Matrix values: Brettel et al. (1997) / Machado et al. (2009), sRGB space.
function CameraColorFilters() {
  return (
    <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        <filter id="cam-protanopia" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.567 0.433 0     0 0
                                               0.558 0.442 0     0 0
                                               0     0.242 0.758 0 0
                                               0     0     0     1 0" />
        </filter>
        <filter id="cam-deuteranopia" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.625 0.375 0   0 0
                                               0.7   0.3   0   0 0
                                               0     0.3   0.7 0 0
                                               0     0     0   1 0" />
        </filter>
        <filter id="cam-tritanopia" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.95  0.05  0     0 0
                                               0     0.433 0.567 0 0
                                               0     0.475 0.525 0 0
                                               0     0     0     1 0" />
        </filter>
        <filter id="cam-achromatopsia" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.299 0.587 0.114 0 0
                                               0.299 0.587 0.114 0 0
                                               0.299 0.587 0.114 0 0
                                               0     0     0     1 0" />
        </filter>
        <filter id="cam-protanomaly" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.817 0.183 0     0 0
                                               0.333 0.667 0     0 0
                                               0     0.125 0.875 0 0
                                               0     0     0     1 0" />
        </filter>
        <filter id="cam-deuteranomaly" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.8   0.2   0     0 0
                                               0.258 0.742 0     0 0
                                               0     0.142 0.858 0 0
                                               0     0     0     1 0" />
        </filter>
      </defs>
    </svg>
  );
}

function buildCssFilter(colorId: ColorId, contrastId: ContrastId, spatial: SpatialState): string | undefined {
  const contrastCss = CONTRAST_FILTERS.find(f => f.id === contrastId)!.css;
  const blurPx = (spatial.lowVision ? 4 : 0) + (spatial.cataracts ? 2 : 0);
  const parts = [
    colorId !== 'none' ? `url(#${CAM_FILTER_PREFIX}${colorId})` : '',
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

// ── UI atoms ──────────────────────────────────────────────────────────────────

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex-none px-3.5 py-2.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all active:scale-95 touch-manipulation ${active ? 'bg-white text-[#0c0c0f] shadow-sm' : 'bg-white/15 text-white/80 hover:bg-white/25'}`}>
      {label}
    </button>
  );
}

function SpatialToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`flex-none flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all active:scale-95 touch-manipulation border ${checked ? 'bg-white text-[#0c0c0f] border-white shadow-sm' : 'bg-transparent text-white/80 border-white/30 hover:border-white/60'}`}>
      <div className={`w-2 h-2 rounded-full flex-none ${checked ? 'bg-[#0c0c0f]' : 'bg-white/50'}`} />
      {label}
    </button>
  );
}

// ── Status types ──────────────────────────────────────────────────────────────

type Status = 'checking' | 'idle' | 'requesting' | 'granted' | 'error';

// ── Component ─────────────────────────────────────────────────────────────────

export function LiveCamera() {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status,      setStatus]      = useState<Status>('checking');
  const [cameraError, setCameraError] = useState<CameraError | null>(null);
  const [facingMode,  setFacingMode]  = useState<'environment' | 'user'>('environment');
  const [panelOpen,   setPanelOpen]   = useState(true);

  const [colorId,    setColorId]    = useState<ColorId>('none');
  const [contrastId, setContrastId] = useState<ContrastId>('none');
  const [spatial,    setSpatial]    = useState<SpatialState>({ lowVision: false, glaucoma: false, macular: false, cataracts: false });
  const toggleSpatial = (k: keyof SpatialState) => setSpatial(p => ({ ...p, [k]: !p[k] }));

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  // Wire stream → video element AFTER React commits the render so ref is valid
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamRef.current) return;
    if (video.srcObject === streamRef.current) return;
    video.srcObject = streamRef.current;
    video.play().catch(() => {});
  }, [status]);

  // Cleanup on tab unmount
  useEffect(() => () => { stopStream(); }, [stopStream]);

  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    stopStream();
    setStatus('requesting');
    setCameraError(null);

    let lastError: CameraError = 'unknown';

    for (const constraints of CONSTRAINT_CHAIN(facing)) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        setStatus('granted'); // useEffect above wires srcObject after this render
        return;
      } catch (err) {
        const kind = classifyError(err);
        if (kind === 'denied' || kind === 'not-found' || kind === 'policy') {
          setCameraError(kind);
          setStatus('error');
          return;
        }
        lastError = kind;
      }
    }

    setCameraError(lastError);
    setStatus('error');
  }, [stopStream]);

  // ── Pre-flight: run once on mount to determine initial state ─────────────
  useEffect(() => {
    let cancelled = false;

    async function preflight() {
      // 1. Must be a secure context (HTTPS / localhost)
      if (!isSecureContext()) {
        if (!cancelled) { setCameraError('insecure'); setStatus('error'); }
        return;
      }

      // 2. Feature / Permissions Policy must allow camera
      if (!isCameraAllowedByPolicy()) {
        if (!cancelled) { setCameraError('policy'); setStatus('error'); }
        return;
      }

      // 3. getUserMedia API must exist
      if (!navigator.mediaDevices?.getUserMedia) {
        if (!cancelled) {
          setCameraError(isInIframe() ? 'policy' : 'unknown');
          setStatus('error');
        }
        return;
      }

      // 4. Query existing permission state — no prompt triggered here
      try {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        if (cancelled) return;

        if (result.state === 'denied') {
          setCameraError('denied');
          setStatus('error');
        } else if (result.state === 'granted') {
          // Already allowed — start immediately without needing a tap
          startCamera('environment');
        } else {
          // 'prompt' — need explicit user tap to trigger the browser permission dialog
          setStatus('idle');
        }

        // React live if permission changes while tab is open (e.g., user unblocks in settings)
        result.onchange = () => {
          if (cancelled) return;
          if (result.state === 'granted') startCamera('environment');
          if (result.state === 'denied') { setCameraError('denied'); setStatus('error'); }
        };
      } catch {
        // Permissions API not supported (some browsers / iframes) — show start button
        if (!cancelled) setStatus('idle');
      }
    }

    preflight();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const flipCamera = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    startCamera(next);
  };

  const cssFilter = buildCssFilter(colorId, contrastId, spatial);
  const label     = activeLabel(colorId, contrastId, spatial);
  const hasAny    = colorId !== 'none' || contrastId !== 'none' || Object.values(spatial).some(Boolean);
  const isLive    = status === 'granted';

  // ── Error copy ─────────────────────────────────────────────────────────────
  const errorContent: Record<CameraError, { icon: React.ReactNode; iconBg: string; title: string; body: string; steps?: string[]; cta?: React.ReactNode }> = {
    denied: {
      icon:   <CameraOff className="w-7 h-7 text-red-400" />,
      iconBg: 'bg-red-50 border-red-200',
      title:  'Camera access blocked',
      body:   'Your browser has blocked camera access for this page. Here\'s how to fix it:',
      steps: [
        'Look for a 🔒 or 📷 icon in your browser\'s address bar',
        'Click it and change "Camera" from Block → Allow',
        'Reload the page and try again',
      ],
      cta: <button onClick={() => startCamera(facingMode)} className="flex items-center gap-2 px-5 py-2.5 bg-[#0c0c0f] text-white text-[13px] font-semibold rounded-[10px] hover:bg-[#1f2937] active:scale-95 transition-all touch-manipulation"><Camera className="w-4 h-4" />Try again</button>,
    },
    'in-use': {
      icon:   <CameraOff className="w-7 h-7 text-orange-400" />,
      iconBg: 'bg-orange-50 border-orange-200',
      title:  'Camera is in use',
      body:   'Another app or browser tab is currently using your camera.',
      steps:  ['Close any other apps or tabs using the camera', 'Then tap Try Again below'],
      cta: <button onClick={() => startCamera(facingMode)} className="flex items-center gap-2 px-5 py-2.5 bg-[#0c0c0f] text-white text-[13px] font-semibold rounded-[10px] hover:bg-[#1f2937] active:scale-95 transition-all touch-manipulation"><Camera className="w-4 h-4" />Try again</button>,
    },
    'not-found': {
      icon:   <CameraOff className="w-7 h-7 text-red-400" />,
      iconBg: 'bg-red-50 border-red-200',
      title:  'No camera found',
      body:   'No camera hardware was detected. Make sure your device has a camera and it isn\'t disabled.',
      cta: undefined,
    },
    policy: {
      icon:   <AlertTriangle className="w-7 h-7 text-amber-400" />,
      iconBg: 'bg-amber-50 border-amber-200',
      title:  'Camera blocked by preview',
      body:   'This preview is embedded in a frame that restricts camera access. Open the app directly in a browser tab to use the camera.',
      cta: <button onClick={() => window.open(window.location.href, '_blank')} className="flex items-center gap-2 px-5 py-2.5 bg-[#0c0c0f] text-white text-[13px] font-semibold rounded-[10px] hover:bg-[#1f2937] active:scale-95 transition-all touch-manipulation"><ExternalLink className="w-4 h-4" />Open in new tab</button>,
    },
    insecure: {
      icon:   <AlertTriangle className="w-7 h-7 text-amber-400" />,
      iconBg: 'bg-amber-50 border-amber-200',
      title:  'Requires a secure connection',
      body:   'Camera access requires HTTPS. This page is being served over an insecure connection.',
      cta: <button onClick={() => window.open(window.location.href.replace('http://', 'https://'), '_blank')} className="flex items-center gap-2 px-5 py-2.5 bg-[#0c0c0f] text-white text-[13px] font-semibold rounded-[10px] hover:bg-[#1f2937] active:scale-95 transition-all touch-manipulation"><ExternalLink className="w-4 h-4" />Open over HTTPS</button>,
    },
    unknown: {
      icon:   <CameraOff className="w-7 h-7 text-red-400" />,
      iconBg: 'bg-red-50 border-red-200',
      title:  'Camera unavailable',
      body:   'Could not start the camera.',
      steps:  ['Make sure you\'re using Chrome, Safari, or Firefox', 'Open this app in a new tab (not an embedded preview)', 'Allow camera when prompted'],
      cta: <button onClick={() => startCamera(facingMode)} className="flex items-center gap-2 px-5 py-2.5 bg-[#0c0c0f] text-white text-[13px] font-semibold rounded-[10px] hover:bg-[#1f2937] active:scale-95 transition-all touch-manipulation"><Camera className="w-4 h-4" />Try again</button>,
    },
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden bg-[#0c0c0f] rounded-xl">

      {/* ── Viewport — video always in DOM so videoRef is never null ── */}
      <div className="relative flex-1 min-h-0 overflow-hidden bg-black">

        {/* Color filter defs live right beside the video so url(#cam-*) always resolves */}
        <CameraColorFilters />

        {/* Video — always mounted, invisible until live */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onLoadedMetadata={() => videoRef.current?.play().catch(() => {})}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{
            opacity:   isLive ? 1 : 0,
            filter:    isLive ? cssFilter : undefined,
            transform: facingMode === 'user' ? 'scaleX(-1)' : undefined,
          }}
        />

        {/* ── Overlay: Checking ── */}
        {status === 'checking' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#f5f5f7]">
            <Loader2 className="w-8 h-8 text-[#6b7280] animate-spin" />
            <p className="text-[13px] text-[#4b5563]">Checking camera access…</p>
          </div>
        )}

        {/* ── Overlay: Idle (permission = 'prompt') ── */}
        {status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center bg-[#f5f5f7]">
            <div className="w-20 h-20 bg-[#0c0c0f] rounded-2xl flex items-center justify-center shadow-lg">
              <Camera className="w-9 h-9 text-white" />
            </div>
            <div className="max-w-xs">
              <p className="text-[20px] font-semibold tracking-[-0.4px] text-[#0c0c0f] mb-2">Live Vision Simulator</p>
              <p className="text-[13px] text-[#4b5563] leading-relaxed">
                See the world through different eyes in real time. Apply color blindness and contrast
                conditions to your live camera feed.
              </p>
            </div>
            <button
              onClick={() => startCamera(facingMode)}
              className="flex items-center gap-2.5 px-6 py-3 bg-[#0c0c0f] text-white text-[14px] font-semibold rounded-[12px] hover:bg-[#1f2937] active:scale-95 transition-all shadow-sm touch-manipulation"
            >
              <Camera style={{ width: 18, height: 18 }} />
              Start Camera
            </button>
            <p className="text-[11px] text-[#9ca3af]">Your browser will ask for camera permission</p>
            {isInIframe() && (
              <button
                onClick={() => window.open(window.location.href, '_blank')}
                className="flex items-center gap-1.5 text-[11px] text-[#6b7280] hover:text-[#0c0c0f] transition-colors touch-manipulation"
              >
                <ExternalLink className="w-3 h-3" />
                Having trouble? Open in new tab
              </button>
            )}
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
              <p className="text-[13px] text-[#4b5563]">Tap <strong>Allow</strong> when your browser asks for camera access.</p>
            </div>
          </div>
        )}

        {/* ── Overlay: Error ── */}
        {status === 'error' && (() => {
          const ec = errorContent[cameraError ?? 'unknown'];
          return (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center bg-[#f5f5f7] overflow-y-auto">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border flex-none ${ec.iconBg}`}>
                {ec.icon}
              </div>
              <div className="max-w-sm w-full text-left">
                <p className="text-[17px] font-semibold text-[#0c0c0f] mb-2 text-center">{ec.title}</p>
                <p className="text-[13px] text-[#4b5563] leading-relaxed text-center mb-3">{ec.body}</p>
                {ec.steps && (
                  <div className="bg-white border border-[#e0e0e8] rounded-[10px] p-3 space-y-2">
                    {ec.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#f0f0f0] text-[#374151] text-[11px] font-semibold flex items-center justify-center flex-none mt-0.5">{i + 1}</span>
                        <p className="text-[12px] text-[#374151] leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {ec.cta && <div className="flex-none">{ec.cta}</div>}
            </div>
          );
        })()}

        {/* ── Live UI (overlays on top of camera) ── */}
        {isLive && (
          <>
            {spatial.glaucoma && (
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 22%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.97) 72%)' }} />
            )}
            {spatial.macular && (
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.90) 12%, rgba(0,0,0,0.50) 28%, transparent 52%)' }} />
            )}
            {spatial.cataracts && (
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: 'rgba(255,230,140,0.22)' }} />
            )}

            {/* Label */}
            <div className="absolute top-0 left-0 right-0 px-4 pt-4 pb-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)' }}>
              <p className={`text-[15px] font-semibold text-white leading-tight tracking-[-0.2px] ${!hasAny ? 'opacity-50' : ''}`}>{label}</p>
              {hasAny && colorId !== 'none' && <p className="text-[11px] text-white/65 mt-0.5">{COLOR_FILTERS.find(f => f.id === colorId)!.sub}</p>}
            </div>

            {/* Controls */}
            <div className="absolute bottom-3 left-0 right-0 flex items-end justify-between px-3 pointer-events-none">
              <button onClick={() => setPanelOpen(v => !v)} className="pointer-events-auto md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white text-[11px] font-medium touch-manipulation">
                {panelOpen ? <><ChevronDown className="w-3.5 h-3.5" />Hide</> : <><ChevronUp className="w-3.5 h-3.5" />Filters</>}
              </button>
              <div className="flex-1" />
              <button onClick={flipCamera} className="pointer-events-auto w-11 h-11 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center active:scale-95 transition-all touch-manipulation">
                <FlipHorizontal style={{ width: 18, height: 18 }} className="text-white" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Filter panel ── */}
      <div className={`bg-[#0c0c0f] flex flex-col overflow-hidden transition-all duration-300 ease-in-out md:w-72 md:border-l md:border-white/10 md:overflow-y-auto md:max-h-full ${panelOpen ? 'max-h-[52vh]' : 'max-h-0'} md:max-h-full`}>
        <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-1 min-h-0">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[1px] text-white/40 mb-2.5">Color Vision</p>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
              {COLOR_FILTERS.map(f => <FilterPill key={f.id} label={f.name} active={colorId === f.id} onClick={() => setColorId(f.id)} />)}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[1px] text-white/40 mb-2.5">Contrast</p>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
              {CONTRAST_FILTERS.map(f => <FilterPill key={f.id} label={f.name} active={contrastId === f.id} onClick={() => setContrastId(f.id)} />)}
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
            <button onClick={() => { setColorId('none'); setContrastId('none'); setSpatial({ lowVision: false, glaucoma: false, macular: false, cataracts: false }); }} className="text-[12px] text-white/40 hover:text-white/70 transition-colors text-left touch-manipulation">
              Reset all →
            </button>
          )}
          <div className="mt-auto pt-3 border-t border-white/10">
            <p className="text-[10px] text-white/30 leading-relaxed">Filters apply to your live camera feed in real time.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
