/**
 * ADA Vision Checker — App.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Main application shell.
 *
 * Visual simulation pipeline (applied left → right in CSS filter chain):
 *   1. Color vision filter  — SVG feColorMatrix  (Brettel 1997 / Machado 2009)
 *   2. Contrast filter      — CSS contrast() / brightness()  (WCAG 1.4.3)
 *   3. Blur / spatial       — CSS blur()  (WHO ICD-11 acuity definitions)
 *   4. Overlay              — DOM div radial-gradient  (glaucoma / AMD / cataracts)
 *
 * All source references live in src/app/data/effectSources.ts.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useRef, useCallback } from 'react';
import { Eye, Upload, Check, BookOpen, BarChart3, RefreshCw, ImagePlus, Trash2, X, Camera } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import { ContrastChecker } from './components/ContrastChecker';
import { SourcesPanel } from './components/SourcesPanel';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LiveCamera } from './components/LiveCamera';
import { SplashScreen } from './components/SplashScreen';

// ─── Types ────────────────────────────────────────────────────────────────────

type ColorFilterId =
  | 'none'
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'achromatopsia'
  | 'protanomaly'
  | 'deuteranomaly';

/**
 * Contrast sensitivity simulation IDs.
 * CSS filter values are documented in src/app/data/effectSources.ts
 * under CONTRAST_SENSITIVITY_SOURCES.
 */
type ContrastFilterId = 'none' | 'low-contrast' | 'high-contrast' | 'washed-out';

interface SpatialState {
  lowVision: boolean;
  glaucoma: boolean;
  macular: boolean;
  cataracts: boolean;
}

// ─── Color Vision Filter Data ─────────────────────────────────────────────────
// Matrix values source: effectSources.ts → COLOR_VISION_SOURCES
// Algorithm: Brettel et al. (1997) & Machado et al. (2009)

const COLOR_FILTERS: {
  id: ColorFilterId;
  name: string;
  description: string;
  detail: string;
  prevalence: string;
  dot: string;
}[] = [
  {
    id: 'none',
    name: 'Normal Vision',
    description: 'Full color perception',
    detail: 'Reference baseline — no color transformation applied.',
    prevalence: 'Reference',
    dot: '#10b981',
  },
  {
    id: 'protanopia',
    name: 'Protanopia',
    description: 'Red-blind (L-cone absent)',
    detail:
      'Reds appear dark brownish-gray. Red/green discrimination is severely impaired. ' +
      'Error indicators, danger states, and links colored red-only become invisible.',
    prevalence: '~0.8% of males',
    dot: '#ef4444',
  },
  {
    id: 'deuteranopia',
    name: 'Deuteranopia',
    description: 'Green-blind (M-cone absent)',
    detail:
      'Most common dichromacy. Green appears yellowish-red; red and green are confused. ' +
      'Most color-coded charts and maps fail for deuteranopes.',
    prevalence: '~1.0% of males',
    dot: '#22c55e',
  },
  {
    id: 'tritanopia',
    name: 'Tritanopia',
    description: 'Blue-blind (S-cone absent)',
    detail:
      'Blue appears green; yellow appears violet. Rare but relevant for blue-heavy UIs.',
    prevalence: '~0.01% of population',
    dot: '#3b82f6',
  },
  {
    id: 'achromatopsia',
    name: 'Achromatopsia',
    description: 'No color vision (rod monochromacy)',
    detail:
      'World seen entirely in grayscale. Luminance contrast is the only visual cue. ' +
      'UI relying solely on hue to convey information is completely inaccessible.',
    prevalence: '~0.003% of population',
    dot: '#9ca3af',
  },
  {
    id: 'protanomaly',
    name: 'Protanomaly',
    description: 'Reduced red sensitivity',
    detail: 'Partial L-cone shift. Reds appear muted; many affected are unaware.',
    prevalence: '~1.0% of males',
    dot: '#f97316',
  },
  {
    id: 'deuteranomaly',
    name: 'Deuteranomaly',
    description: 'Reduced green sensitivity',
    detail:
      'Most prevalent color vision deficiency globally. Green hues shift toward red. ' +
      'Testing for this covers the largest affected population.',
    prevalence: '~5.0% of males',
    dot: '#84cc16',
  },
];

// ─── Contrast Sensitivity Filter Data ────────────────────────────────────────
// CSS filter values source: effectSources.ts → CONTRAST_SENSITIVITY_SOURCES
// Algorithm: Pelli & Bex (2013); W3C CSS Filter Effects Module Level 1

const CONTRAST_FILTERS: {
  id: ContrastFilterId;
  name: string;
  description: string;
  detail: string;
  /**
   * The CSS filter string applied to the image.
   * Documented in detail in effectSources.ts.
   */
  cssValue: string;
  dot: string;
}[] = [
  {
    id: 'none',
    name: 'Normal Contrast',
    description: 'No contrast modification',
    detail: 'Reference — full contrast range.',
    cssValue: '',
    dot: '#10b981',
  },
  {
    id: 'low-contrast',
    name: 'Low Contrast Sensitivity',
    description: 'Compressed dynamic range',
    detail:
      'Simulates reduced contrast sensitivity common in glaucoma, cataracts, ' +
      'diabetic retinopathy, and aging. contrast(0.45) compresses tonal range to ~45%.',
    cssValue: 'contrast(0.45) brightness(1.06)',
    dot: '#a78bfa',
  },
  {
    id: 'high-contrast',
    name: 'High Contrast Mode',
    description: 'OS accessibility override',
    detail:
      'Approximates Windows High Contrast / forced colors mode. ' +
      'Mid-tones clip to black or white. contrast(3.5) saturate(1.8).',
    cssValue: 'contrast(3.5) saturate(1.8)',
    dot: '#facc15',
  },
  {
    id: 'washed-out',
    name: 'Overexposed / Washed Out',
    description: 'Photophobia + low dynamic range',
    detail:
      'Simulates photophobia (albinism, achromatopsia, aniridia). ' +
      'Bright backgrounds overwhelm; subtle contrasts vanish. brightness(1.9) contrast(0.35).',
    cssValue: 'brightness(1.9) contrast(0.35) saturate(0.55)',
    dot: '#fb923c',
  },
];

// ─── Spatial Effect Data ──────────────────────────────────────────────────────
// Source: effectSources.ts → SPATIAL_SOURCES
// Clinical definitions: WHO ICD-11

const SPATIAL_EFFECTS: {
  id: keyof SpatialState;
  name: string;
  description: string;
  detail: string;
  color: string;
}[] = [
  {
    id: 'lowVision',
    name: 'Low Vision',
    description: 'Reduced acuity — blur(4px)',
    detail:
      'WHO ICD-11 category 9D90.0. Gaussian blur (σ≈4px) approximates visual acuity ' +
      'worse than 6/18. Small text and fine detail become unresolvable.',
    color: '#a78bfa',
  },
  {
    id: 'glaucoma',
    name: 'Glaucoma',
    description: 'Tunnel vision — radial vignette',
    detail:
      'Peripheral field loss. Radial-gradient overlay: transparent 22% → black 72%. ' +
      'Users cannot see peripheral navigation, edge alerts, or sidebars.',
    color: '#fb923c',
  },
  {
    id: 'macular',
    name: 'Macular Degeneration',
    description: 'Central scotoma — dark center',
    detail:
      'AMD absolute scotoma modeled as dark radial gradient at image center. ' +
      'Users rely on eccentric (peripheral) fixation to read.',
    color: '#f43f5e',
  },
  {
    id: 'cataracts',
    name: 'Cataracts',
    description: 'Blur + yellow tint — blur(2px)',
    detail:
      'Nuclear cataract: blur(2px) + rgba(255,230,140,0.22) overlay simulating ' +
      'xanthophyll lens yellowing (blue-channel absorption).',
    color: '#fbbf24',
  },
];

// ─── SVG Filter Definitions ───────────────────────────────────────────────────
/**
 * Hidden SVG containing feColorMatrix filter definitions.
 *
 * Format: W3C SVG 1.1 §15.10 feColorMatrix type="matrix"
 *   [ a  b  c  d  e ]
 *   [ f  g  h  i  j ]   ← one row per output channel (R, G, B, A)
 *   [ k  l  m  n  o ]
 *   [ p  q  r  s  t ]
 *
 * colorInterpolationFilters="sRGB" keeps calculations in display-space sRGB,
 * matching the WCAG luminance formula's sRGB assumption.
 *
 * Full source citations → src/app/data/effectSources.ts
 */
function SvgFilters() {
  return (
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        {/*
          PROTANOPIA — L-cone (red) absence
          Source: Brettel, Viénot & Mollon (1997) JOSA A 14(10):2647-2655
                  Viénot, Brettel & Mollon (1999) Color Res Appl 24(4):243-252
          Matrix: Projects L-cone axis onto M-cone and S-cone in LMS space,
                  then converts back to sRGB.
        */}
        <filter id="protanopia" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.567 0.433 0     0 0
                    0.558 0.442 0     0 0
                    0     0.242 0.758 0 0
                    0     0     0     1 0"
          />
        </filter>

        {/*
          DEUTERANOPIA — M-cone (green) absence
          Source: Brettel, Viénot & Mollon (1997) JOSA A 14(10):2647-2655
                  Viénot, Brettel & Mollon (1999) Color Res Appl 24(4):243-252
          Matrix: Projects M-cone axis onto L-cone and S-cone in LMS space.
        */}
        <filter id="deuteranopia" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.625 0.375 0   0 0
                    0.7   0.3   0   0 0
                    0     0.3   0.7 0 0
                    0     0     0   1 0"
          />
        </filter>

        {/*
          TRITANOPIA — S-cone (blue) absence
          Source: Brettel, Viénot & Mollon (1997) JOSA A 14(10):2647-2655
          Matrix: Projects S-cone axis onto L-cone and M-cone.
        */}
        <filter id="tritanopia" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.95  0.05  0     0 0
                    0     0.433 0.567 0 0
                    0     0.475 0.525 0 0
                    0     0     0     1 0"
          />
        </filter>

        {/*
          ACHROMATOPSIA — rod monochromacy (no cone function)
          Source: ITU-R BT.601 luma coefficients (Y = 0.299R + 0.587G + 0.114B)
          All three output channels equal the perceptual luminance Y,
          producing a true grayscale with perceptual weighting.
        */}
        <filter id="achromatopsia" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0     0     0     1 0"
          />
        </filter>

        {/*
          PROTANOMALY — reduced L-cone sensitivity (severity ≈ 0.7)
          Source: Machado, Oliveira & Fernandes (2009)
                  IEEE TVCG 15(6):1291-1298  DOI:10.1109/TVCG.2009.113
          Matrix: Interpolation between identity and protanopia at severity 0.7.
          Physiology: L-cone peak shifts ~20 nm toward M-cone peak.
        */}
        <filter id="protanomaly" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.817 0.183 0     0 0
                    0.333 0.667 0     0 0
                    0     0.125 0.875 0 0
                    0     0     0     1 0"
          />
        </filter>

        {/*
          DEUTERANOMALY — reduced M-cone sensitivity (severity ≈ 0.7)
          Source: Machado, Oliveira & Fernandes (2009)
                  IEEE TVCG 15(6):1291-1298  DOI:10.1109/TVCG.2009.113
          Most prevalent color vision deficiency: ~5% of males globally.
          Matrix: Interpolation between identity and deuteranopia at severity 0.7.
        */}
        <filter id="deuteranomaly" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.8   0.2   0     0 0
                    0.258 0.742 0     0 0
                    0     0.142 0.858 0 0
                    0     0     0     1 0"
          />
        </filter>
      </defs>
    </svg>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function ActiveBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs border font-medium"
      style={{ backgroundColor: color + '18', color, borderColor: color + '40' }}
    >
      {label}
    </span>
  );
}

function SwitchRow({
  label,
  sublabel,
  checked,
  color,
  onChange,
}: {
  label: string;
  sublabel: string;
  checked: boolean;
  color: string;
  onChange: () => void;
}) {
  return (
    <div
      className={`flex items-center justify-between px-2.5 py-2 rounded-[6px] transition-all ${
        checked ? 'bg-[#191919]' : 'bg-[#f0f0f0]'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className="w-1.5 h-1.5 rounded-full flex-none transition-colors"
          style={{ backgroundColor: checked ? '#ffffff' : '#3a3a3a' }}
        />
        <div className="min-w-0">
          <p className={`text-[12px] font-medium leading-4 ${checked ? 'text-white' : 'text-[#1f2937]'}`}>{label}</p>
          <p className={`text-[11px] leading-[14px] ${checked ? 'text-[#aaa]' : 'text-[#6b7280]'}`}>{sublabel}</p>
        </div>
      </div>
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        className={`relative w-8 h-[18px] rounded-full outline-none cursor-pointer transition-colors flex-none ml-3 ${
          checked ? 'bg-[#444]' : 'bg-[#222]'
        }`}
      >
        <Switch.Thumb
          className="block w-3.5 h-3.5 rounded-full shadow transition-transform data-[state=checked]:translate-x-[18px] translate-x-0.5"
          style={{ backgroundColor: checked ? '#fff' : '#3a3a3a' }}
        />
      </Switch.Root>
    </div>
  );
}


// ─── Vision Simulator Panel ───────────────────────────────────────────────────

interface SimulatorProps {
  image: string;
  colorFilter: ColorFilterId;
  contrastFilter: ContrastFilterId;
  spatial: SpatialState;
  onReplace: () => void;
  onClear: () => void;
  onColorFilter: (id: ColorFilterId) => void;
  onContrastFilter: (id: ContrastFilterId) => void;
  onToggleSpatial: (key: keyof SpatialState) => void;
}

function VisionSimulator({ image, colorFilter, contrastFilter, spatial, onReplace, onClear, onColorFilter, onContrastFilter, onToggleSpatial }: SimulatorProps) {
  /**
   * Compose the CSS filter chain.
   * Order matters — applied left to right:
   *   1. url(#svgId)         — color matrix transform   (Brettel/Machado)
   *   2. contrast() / etc.   — contrast sensitivity     (Pelli & Bex 2013)
   *   3. blur()              — spatial acuity loss      (WHO ICD-11)
   *
   * Reference: W3C Filter Effects Module Level 1
   *   https://www.w3.org/TR/filter-effects-1/
   */
  const contrastData = CONTRAST_FILTERS.find(c => c.id === contrastFilter)!;
  const blurPx = (spatial.lowVision ? 4 : 0) + (spatial.cataracts ? 2 : 0);

  const cssFilterChain = [
    colorFilter !== 'none' ? `url(#${colorFilter})` : '',
    contrastFilter !== 'none' ? contrastData.cssValue : '',
    blurPx > 0 ? `blur(${blurPx}px)` : '',
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  const activeColorData = COLOR_FILTERS.find(f => f.id === colorFilter)!;
  const activeSpatial = SPATIAL_EFFECTS.filter(e => spatial[e.id]);
  const hasAny = colorFilter !== 'none' || contrastFilter !== 'none' || activeSpatial.length > 0;

  return (
    // Mobile: natural scroll column so images never compress when cards appear/disappear.
    // Desktop (sm+): height-filling flex so images stretch to fill the panel.
    <div className="flex flex-col gap-3 overflow-y-auto sm:overflow-hidden sm:flex-1 sm:min-h-0 pb-2 sm:pb-0">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-none">
        {/* Active badges — desktop only */}
        <span className="hidden sm:inline text-xs text-[#374151] font-medium flex-none">Simulating:</span>
        {!hasAny && <span className="hidden sm:inline text-xs text-[#6b7280] italic">None — select a filter from the sidebar</span>}
        {colorFilter !== 'none' && <span className="hidden sm:inline"><ActiveBadge label={activeColorData.name} color={activeColorData.dot} /></span>}
        {contrastFilter !== 'none' && <span className="hidden sm:inline"><ActiveBadge label={contrastData.name} color={contrastData.dot} /></span>}
        {activeSpatial.map(e => <span key={e.id} className="hidden sm:inline"><ActiveBadge label={e.name} color={e.color} /></span>)}

        {/* Mobile: single-line stable label — same height whether a filter is active or not */}
        <span className="sm:hidden text-xs text-[#374151] font-medium truncate flex-1">
          {[
            colorFilter !== 'none' ? activeColorData.name : null,
            contrastFilter !== 'none' ? contrastData.name : null,
            ...activeSpatial.map(e => e.name),
          ].filter(Boolean).join(' + ') || 'Select a filter below'}
        </span>

        <div className="flex items-center gap-1.5 flex-none ml-auto">
          <button
            onClick={onReplace}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-[#f0f0f0] border border-[#e0e0e8] text-[#444] hover:bg-[#e5e5e8] transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Replace image</span>
          </button>
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-[#f0f0f0] border border-[#e0e0e8] text-[#6b7280] hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Start over</span>
          </button>
        </div>
      </div>

      {/* Image pair
          Mobile:  fixed-height boxes stacked — size never changes on filter tap
          Desktop: flex-1 grid that stretches to fill remaining panel height          */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-none sm:flex-1 sm:min-h-0">
        {/* Original */}
        <div className="flex flex-col sm:min-h-0">
          <div className="flex items-center gap-2 mb-1.5 flex-none">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-none" />
            <span className="text-sm text-[#1f2937] font-semibold">Normal Vision</span>
            <span className="text-xs text-[#6b7280]">Reference</span>
          </div>
          <div className="h-[220px] sm:h-auto sm:flex-1 sm:min-h-0 bg-white rounded-xl overflow-hidden border border-[#e0e0e8] flex items-center justify-center">
            <img src={image} alt="Original" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Simulated */}
        <div className="flex flex-col sm:min-h-0">
          <div className="flex items-center gap-2 mb-1.5 flex-none">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0c0c0f] flex-none" />
            <span className="text-sm text-[#1f2937] font-semibold">Simulated View</span>
            <span className="text-xs text-[#6b7280] truncate">
              {hasAny && activeColorData.name !== 'Normal Vision' ? activeColorData.name : ''}
            </span>
          </div>
          {/* Same fixed height as original — always identical, never shifts */}
          <div className="h-[220px] sm:h-auto sm:flex-1 sm:min-h-0 bg-white rounded-xl overflow-hidden border border-[#e0e0e8] relative flex items-center justify-center">
            {/* Primary image with filter chain */}
            <img
              src={image}
              alt="Simulated view"
              className="w-full h-full object-contain"
              style={{ filter: cssFilterChain }}
            />

            {/*
              GLAUCOMA overlay — radial vignette
              Source: Quigley & Broman (2006) Br J Ophthalmol 90(3):262-267
              Model: transparent 22% → opaque black 72% (arcuate scotoma approximation)
            */}
            {spatial.glaucoma && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at center, transparent 22%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.97) 72%)',
                }}
              />
            )}

            {/*
              MACULAR DEGENERATION overlay — central scotoma
              Source: Wong et al. (2014) JAMA Ophthalmol 132(5):506-526
              Model: dark center (absolute scotoma) fading to clear at 50% radius
            */}
            {spatial.macular && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(0,0,0,0.90) 12%, rgba(0,0,0,0.50) 28%, transparent 52%)',
                }}
              />
            )}

            {/*
              CATARACTS tint overlay — xanthophyll lens yellowing
              Source: Zigman (2000) J Ocul Pharmacol Ther 16(2):161-165
              Model: rgba(255,230,140,0.22) approximates blue-channel absorption
              by 3-OH kynurenine in nuclear sclerotic cataract
            */}
            {spatial.cataracts && (
              <div
                className="absolute inset-0 pointer-events-none rounded-xl"
                style={{ backgroundColor: 'rgba(255, 230, 140, 0.22)' }}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile inline filter picker — flex-none keeps it out of the flex sizing pool ── */}
      <div className="sm:hidden flex-none bg-white border border-[#e0e0e8] rounded-xl overflow-hidden">
        {/* Color Vision */}
        <div className="px-3 pt-3 pb-2 border-b border-[#f0f0f0]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#374151] mb-2">Color Vision</p>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {COLOR_FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => onColorFilter(f.id)}
                className={`flex-none flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-medium whitespace-nowrap transition-all ${
                  colorFilter === f.id
                    ? 'bg-[#191919] text-white'
                    : 'bg-[#f0f0f0] text-[#1f2937] hover:bg-[#e8e8e8]'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-none"
                  style={{ backgroundColor: colorFilter === f.id ? '#fff' : f.dot }}
                />
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* Contrast Sensitivity */}
        <div className="px-3 pt-2.5 pb-2 border-b border-[#f0f0f0]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#374151] mb-2">Contrast</p>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {CONTRAST_FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => onContrastFilter(f.id)}
                className={`flex-none px-3 py-2 rounded-full text-[12px] font-medium whitespace-nowrap transition-all ${
                  contrastFilter === f.id
                    ? 'bg-[#191919] text-white'
                    : 'bg-[#f0f0f0] text-[#1f2937] hover:bg-[#e8e8e8]'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* Spatial / Additional effects */}
        <div className="px-3 pt-2.5 pb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#374151] mb-2">Additional Effects</p>
          <div className="flex gap-1.5 flex-wrap">
            {SPATIAL_EFFECTS.map(e => (
              <button
                key={e.id}
                onClick={() => onToggleSpatial(e.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-medium transition-all border ${
                  spatial[e.id]
                    ? 'bg-[#191919] text-white border-[#191919]'
                    : 'bg-transparent text-[#374151] border-[#e0e0e8] hover:border-[#c0c0c8]'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-none"
                  style={{ backgroundColor: spatial[e.id] ? '#fff' : e.color }}
                />
                {e.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail info cards — flex-none so they never compress the image grid */}
      {hasAny && (
        <div className="flex-none grid grid-cols-1 sm:grid-cols-2 gap-3">
          {colorFilter !== 'none' && (
            <div className="bg-white border border-[#e0e0e8] rounded-xl p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#374151] mb-1">Color Vision Filter</p>
              <p className="text-sm font-semibold text-[#0c0c0f] mb-0.5">{activeColorData.name}</p>
              <p className="text-xs text-[#4b5563] mb-1">{activeColorData.detail}</p>
              <p className="text-xs font-mono text-[#6b7280]">url(#{colorFilter})</p>
              <p className="text-xs text-[#374151] font-medium mt-1">Affects {activeColorData.prevalence}</p>
            </div>
          )}
          {contrastFilter !== 'none' && (
            <div className="bg-white border border-[#e0e0e8] rounded-xl p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#374151] mb-1">Contrast Simulation</p>
              <p className="text-sm font-semibold text-[#0c0c0f] mb-0.5">{contrastData.name}</p>
              <p className="text-xs text-[#4b5563] mb-1">{contrastData.detail}</p>
              <p className="text-xs font-mono text-[#6b7280]">{contrastData.cssValue}</p>
            </div>
          )}
          {activeSpatial.map(e => (
            <div key={e.id} className="bg-white border border-[#e0e0e8] rounded-xl p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#374151] mb-1">Spatial Effect</p>
              <p className="text-sm font-semibold text-[#0c0c0f] mb-0.5">{e.name}</p>
              <p className="text-xs text-[#4b5563]">{e.detail}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────

type AppTab = 'vision' | 'camera' | 'contrast' | 'sources';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [colorFilter, setColorFilter] = useState<ColorFilterId>('none');
  const [contrastFilter, setContrastFilter] = useState<ContrastFilterId>('none');
  const [spatial, setSpatial] = useState<SpatialState>({
    lowVision: false,
    glaucoma: false,
    macular: false,
    cataracts: false,
  });
  const [showSplash, setShowSplash] = useState(true);
  const [tab, setTab] = useState<AppTab>('vision');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = e => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const toggleSpatial = (key: keyof SpatialState) =>
    setSpatial(prev => ({ ...prev, [key]: !prev[key] }));

  const resetAll = () => {
    setColorFilter('none');
    setContrastFilter('none');
    setSpatial({ lowVision: false, glaucoma: false, macular: false, cataracts: false });
  };

  const clearImage = () => {
    setImage(null);
    resetAll();
    // Reset file input so the same file can be re-selected after clearing
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const activeSpatialCount = Object.values(spatial).filter(Boolean).length;
  const hasAnyEffect =
    colorFilter !== 'none' || contrastFilter !== 'none' || activeSpatialCount > 0;

  const TAB_DEFS: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    { id: 'vision',   label: 'Vision Simulator', icon: <Eye className="w-3.5 h-3.5" /> },
    { id: 'camera',   label: 'Live Camera',       icon: <Camera className="w-3.5 h-3.5" /> },
    { id: 'contrast', label: 'Contrast Checker',  icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'sources',  label: 'Sources',           icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  // Close sidebar on filter selection on mobile
  const selectColorFilter = (id: ColorFilterId) => {
    setColorFilter(id);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };
  const selectContrastFilter = (id: ContrastFilterId) => {
    setContrastFilter(id);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const SidebarContent = () => (
    <div className="py-3 flex flex-col flex-1 min-h-0">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 mb-1 border-b border-[#e0e0e8]">
        <span className="text-[14px] font-semibold text-[#0c0c0f]">Filters</span>
        <button
          onClick={() => setSidebarOpen(false)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f0f0f0] transition-colors"
        >
          <X className="w-4 h-4 text-[#374151]" />
        </button>
      </div>

      {/* Upload */}
      <div className="px-3.5 pb-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#1f2937] mb-2">Image</p>
        {image ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-2.5 py-2 rounded-[6px] bg-emerald-50 border border-emerald-200">
              <Check className="w-3 h-3 text-emerald-500 flex-none" />
              <span className="text-[12px] text-emerald-600 font-medium truncate">Image loaded</span>
            </div>
            <button
              onClick={() => { fileInputRef.current?.click(); setSidebarOpen(false); }}
              className="w-full flex items-center gap-2 px-2.5 py-2.5 rounded-[6px] bg-[#f0f0f0] text-[12px] font-medium text-[#1f2937] hover:bg-[#e5e5e8] transition-all"
            >
              <ImagePlus className="w-3.5 h-3.5 flex-none text-[#4b5563]" />
              Load new image
            </button>
            <button
              onClick={clearImage}
              className="w-full flex items-center gap-2 px-2.5 py-2.5 rounded-[6px] bg-[#f0f0f0] text-[12px] font-medium text-[#4b5563] hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5 flex-none" />
              Clear &amp; start over
            </button>
          </div>
        ) : (
          <button
            onClick={() => { fileInputRef.current?.click(); setSidebarOpen(false); }}
            className="w-full flex items-center gap-2 px-2.5 py-2.5 rounded-[6px] bg-[#f0f0f0] text-[12px] font-medium text-[#374151] hover:bg-[#e5e5e8] transition-all"
          >
            <Upload className="w-3.5 h-3.5 flex-none" />
            Upload image
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); }}
        />
      </div>

      {/* Color Vision Deficiency */}
      <div className="px-3.5 py-2.5 border-t border-[#f0f0f0]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#1f2937] mb-2">Color Vision Deficiency</p>
        <div className="space-y-1">
          {COLOR_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => selectColorFilter(f.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-[6px] text-left transition-all ${
                colorFilter === f.id ? 'bg-[#191919]' : 'bg-[#f0f0f0] hover:bg-[#e8e8e8]'
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full flex-none" style={{ backgroundColor: colorFilter === f.id ? '#fff' : '#3a3a3a' }} />
              <div className="min-w-0 flex-1">
                <span className={`text-[12px] font-medium block truncate ${colorFilter === f.id ? 'text-white' : 'text-[#1f2937]'}`}>{f.name}</span>
                <span className={`text-[11px] block ${colorFilter === f.id ? 'text-[#aaa]' : 'text-[#6b7280]'}`}>{f.prevalence}</span>
              </div>
              <svg className="w-3 h-3 flex-none" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 9L7.5 6L4.5 3" stroke={colorFilter === f.id ? 'white' : '#3A3A3A'} strokeLinecap="round" strokeWidth="2"/>
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Contrast Sensitivity */}
      <div className="px-3.5 py-2.5 border-t border-[#f0f0f0]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#1f2937] mb-2">Contrast Sensitivity</p>
        <div className="space-y-1">
          {CONTRAST_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => selectContrastFilter(f.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-[6px] text-left transition-all ${
                contrastFilter === f.id ? 'bg-[#191919]' : 'bg-[#f0f0f0] hover:bg-[#e8e8e8]'
              }`}
            >
              <div className="min-w-0 flex-1">
                <span className={`text-[12px] font-medium block truncate ${contrastFilter === f.id ? 'text-white' : 'text-[#1f2937]'}`}>{f.name}</span>
                <span className={`text-[11px] block ${contrastFilter === f.id ? 'text-[#aaa]' : 'text-[#6b7280]'}`}>{f.description}</span>
              </div>
              <svg className="w-3 h-3 flex-none" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 9L7.5 6L4.5 3" stroke={contrastFilter === f.id ? 'white' : '#3A3A3A'} strokeLinecap="round" strokeWidth="2"/>
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Spatial Effects */}
      <div className="px-3.5 py-2.5 border-t border-[#f0f0f0]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#1f2937] mb-2">Additional Effects</p>
        <div className="space-y-1">
          {SPATIAL_EFFECTS.map(e => (
            <SwitchRow
              key={e.id}
              label={e.name}
              sublabel={e.description}
              checked={spatial[e.id]}
              color={e.color}
              onChange={() => toggleSpatial(e.id)}
            />
          ))}
        </div>
      </div>

      {/* Reset */}
      {hasAnyEffect && (
        <div className="px-3.5 pt-2 border-t border-[#f0f0f0]">
          <div className="bg-[#f0f0f0] rounded-[6px] px-2.5 py-2">
            <p className="text-[11px] font-medium text-[#374151] mb-1">
              {[colorFilter !== 'none' ? 1 : 0, contrastFilter !== 'none' ? 1 : 0, activeSpatialCount].reduce((a, b) => a + b, 0)} simulation{hasAnyEffect ? 's' : ''} active
            </p>
            <button onClick={resetAll} className="text-[11px] text-[#6b7280] hover:text-[#0c0c0f] transition-colors">
              Reset all →
            </button>
          </div>
        </div>
      )}

      {/* Footer note */}
      <div className="px-3.5 pt-3 mt-auto border-t border-[#f0f0f0]">
        <p className="text-[11px] text-[#374151] leading-[15px]">Simulations are approximations for design evaluation and research.</p>
      </div>
    </div>
  );

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      <div className="h-[100dvh] bg-[#f5f5f7] text-[#0c0c0f] flex flex-col overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SvgFilters />

      {/* ── Header ── */}
      <header className="flex-none h-14 bg-[#f5f5f7] border-b border-[#e0e0e8] px-3 sm:px-4 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 flex-none">
          {/* Mobile filter toggle */}
          <div className="flex flex-col gap-0.5">
            <h1 className="text-[17px] sm:text-[19px] font-semibold leading-6 tracking-[-0.4px] text-[#0c0c0f]">ADA Vision Checker</h1>
            <p className="hidden sm:block text-[11px] text-[#4b5563] tracking-[0.2px] leading-none">WCAG 2.1 · ADA · Section 508</p>
          </div>
        </div>

        {/* Tabs — scroll on small screens */}
        <nav className="flex gap-1 overflow-x-auto scrollbar-none flex-none max-w-full">
          {TAB_DEFS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-[7px] rounded-[20px] text-[12px] sm:text-[13px] whitespace-nowrap transition-all flex-none ${
                tab === t.id
                  ? 'bg-[#0c0c0f] text-white font-semibold'
                  : 'text-[#374151] font-medium hover:text-[#0c0c0f]'
              }`}
            >
              {t.icon}
              <span className="hidden xs:inline sm:inline">{t.label}</span>
            </button>
          ))}
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Mobile backdrop ── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Black decorative strip — desktop only, hidden on camera tab ── */}
        <div className={`hidden w-10 flex-none bg-black border-r border-[#1c1c1c] flex-col items-center py-4 shrink-0 ${tab !== 'camera' ? 'md:flex' : ''}`}>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[9px] font-medium text-[#555] tracking-[2px] uppercase whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              ADA VISION CHECKER
            </p>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <aside
          className={`
            fixed md:relative inset-y-0 left-0 z-50
            w-[280px] md:w-[248px]
            bg-white border-r border-[#1c1c1c]
            overflow-y-auto flex flex-col shrink-0
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            ${tab === 'camera' ? 'md:-translate-x-full md:w-0 md:overflow-hidden md:border-0' : 'md:translate-x-0'}
          `}
        >
          <SidebarContent />
        </aside>

        {/* ── Main Content ── */}
        <main className={`flex-1 flex flex-col min-h-0 overflow-hidden ${tab === 'camera' ? 'p-0 bg-black' : 'p-2.5 sm:p-3 bg-[#f5f5f7]'}`}>
          {tab === 'camera' && <LiveCamera />}

          {tab === 'vision' && (
            image
              ? <VisionSimulator
                  image={image}
                  colorFilter={colorFilter}
                  contrastFilter={contrastFilter}
                  spatial={spatial}
                  onReplace={() => fileInputRef.current?.click()}
                  onClear={clearImage}
                  onColorFilter={setColorFilter}
                  onContrastFilter={setContrastFilter}
                  onToggleSpatial={toggleSpatial}
                />
              : <div className="flex-1 min-h-0 overflow-y-auto"><WelcomeScreen onFile={loadFile} /></div>
          )}

          {tab === 'contrast' && (
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="max-w-2xl mx-auto w-full py-1">
                <div className="mb-4">
                  <h2 className="text-[18px] sm:text-[20px] font-semibold tracking-[-0.4px] text-[#0c0c0f]">WCAG Contrast Checker</h2>
                  <p className="text-sm text-[#4b5563] mt-1">
                    Test color pairs against WCAG 2.1 AA and AAA thresholds
                  </p>
                </div>
                <ContrastChecker />
              </div>
            </div>
          )}

          {tab === 'sources' && (
            <div className="flex-1 min-h-0 overflow-y-auto">
              <SourcesPanel />
            </div>
          )}
        </main>
      </div>
    </div>
    </>
  );
}
