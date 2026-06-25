import { useState } from 'react';
import { Check, X } from 'lucide-react';

function linearize(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return [r, g, b];
}

function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function PassBadge({ passes, label }: { passes: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border ${
      passes
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
        : 'bg-red-500/10 text-red-400 border-red-500/25'
    }`}>
      {passes
        ? <Check className="w-3.5 h-3.5 flex-none" />
        : <X className="w-3.5 h-3.5 flex-none" />}
      <span className="text-xs">{label}</span>
    </div>
  );
}

export function ContrastChecker() {
  const [fg, setFg] = useState('#1a73e8');
  const [bg, setBg] = useState('#ffffff');

  const rgb1 = hexToRgb(fg);
  const rgb2 = hexToRgb(bg);

  const l1 = rgb1 ? relativeLuminance(...rgb1) : null;
  const l2 = rgb2 ? relativeLuminance(...rgb2) : null;
  const ratio = l1 !== null && l2 !== null ? getContrastRatio(l1, l2) : null;
  const r = ratio ?? 1;

  return (
    <div className="space-y-6">
      {/* Color pickers */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Foreground', value: fg, set: setFg },
          { label: 'Background', value: bg, set: setBg },
        ].map(({ label, value, set }) => (
          <div key={label}>
            <p className="text-xs text-gray-400 mb-2">{label} Color</p>
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-2 border border-gray-700">
              <div className="relative w-9 h-9 rounded-md overflow-hidden border border-gray-600 flex-none">
                <input
                  type="color"
                  value={value}
                  onChange={e => set(e.target.value)}
                  className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                />
                <div className="w-full h-full" style={{ backgroundColor: value }} />
              </div>
              <input
                type="text"
                value={value}
                maxLength={7}
                onChange={e => set(e.target.value)}
                className="flex-1 bg-transparent text-gray-200 text-sm font-mono outline-none min-w-0"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Preview */}
      <div
        className="rounded-xl p-6 border border-gray-700"
        style={{ backgroundColor: bg }}
      >
        <p className="text-xl mb-1" style={{ color: fg }}>
          Sample Heading Text
        </p>
        <p className="text-sm" style={{ color: fg }}>
          The quick brown fox jumps over the lazy dog. This is body text at normal size.
        </p>
        <p className="text-xs mt-2 opacity-80" style={{ color: fg }}>
          Small text (caption level) — harder to read at low contrast
        </p>
      </div>

      {/* Ratio display */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 text-center">
        <div className="text-5xl font-mono text-white">
          {ratio ? ratio.toFixed(2) : '—'}
          <span className="text-xl text-gray-400 ml-1">:1</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">Contrast Ratio</p>
        {ratio && (
          <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs border ${
            r >= 7 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
            : r >= 4.5 ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
            : r >= 3 ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
            : 'bg-red-500/15 text-red-400 border-red-500/30'
          }`}>
            {r >= 7 ? '★ AAA' : r >= 4.5 ? '✓ AA' : r >= 3 ? '◐ Partial' : '✗ Fail'}
          </div>
        )}
      </div>

      {/* Pass/fail badges */}
      {ratio && (
        <div className="grid grid-cols-2 gap-2">
          <PassBadge passes={r >= 4.5} label="AA — Normal Text (4.5:1)" />
          <PassBadge passes={r >= 3}   label="AA — Large Text (3:1)" />
          <PassBadge passes={r >= 7}   label="AAA — Normal Text (7:1)" />
          <PassBadge passes={r >= 4.5} label="AAA — Large Text (4.5:1)" />
          <PassBadge passes={r >= 3}   label="AA — UI Components (3:1)" />
          <PassBadge passes={r >= 3}   label="AA — Graphical Objects (3:1)" />
        </div>
      )}

      {/* Formulas */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-800 pb-2">
          WCAG 2.1 — Mathematical Formulas
        </h3>

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 space-y-4">
          <div>
            <p className="text-xs text-blue-400 uppercase tracking-wider mb-2">Step 1 — Linearize sRGB</p>
            <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs text-gray-300 space-y-1">
              <div>c_sRGB = channel / 255</div>
              <div className="text-gray-500">if c_sRGB ≤ 0.04045:</div>
              <div className="ml-4 text-green-300">c_lin = c_sRGB / 12.92</div>
              <div className="text-gray-500">else:</div>
              <div className="ml-4 text-green-300">c_lin = ((c_sRGB + 0.055) / 1.055) ^ 2.4</div>
            </div>
          </div>

          <div>
            <p className="text-xs text-blue-400 uppercase tracking-wider mb-2">Step 2 — Relative Luminance (WCAG 1.4)</p>
            <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs">
              <span className="text-green-300">L = 0.2126 × R</span>
              <span className="text-gray-400"> + </span>
              <span className="text-green-300">0.7152 × G</span>
              <span className="text-gray-400"> + </span>
              <span className="text-green-300">0.0722 × B</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-1">Coefficients match human eye sensitivity (green dominates)</p>
          </div>

          <div>
            <p className="text-xs text-blue-400 uppercase tracking-wider mb-2">Step 3 — Contrast Ratio</p>
            <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs text-green-300">
              CR = (L_lighter + 0.05) / (L_darker + 0.05)
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-1">0.05 offset prevents division by zero for pure black</p>
          </div>
        </div>

        {/* Live breakdown */}
        {l1 !== null && l2 !== null && ratio && (
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="text-xs text-blue-400 uppercase tracking-wider mb-3">Live Calculation</p>
            <div className="font-mono text-xs space-y-1">
              <div className="text-gray-400">Foreground luminance (L1) =
                <span className="text-white ml-2">{l1.toFixed(6)}</span>
              </div>
              <div className="text-gray-400">Background luminance (L2) =
                <span className="text-white ml-2">{l2.toFixed(6)}</span>
              </div>
              <div className="text-gray-700 py-1">──────────────────────────────</div>
              <div className="text-gray-300">
                CR = ({Math.max(l1, l2).toFixed(4)} + 0.05) / ({Math.min(l1, l2).toFixed(4)} + 0.05)
              </div>
              <div className="text-emerald-400">
                CR = <span className="text-white">{ratio.toFixed(4)}</span>:1
              </div>
            </div>
          </div>
        )}

        {/* Threshold table */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-xs text-blue-400 uppercase tracking-wider mb-3">WCAG Compliance Thresholds</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-500 border-b border-gray-800">
                  <th className="text-left pb-2 pr-4">Level</th>
                  <th className="text-left pb-2 pr-4">Normal Text</th>
                  <th className="text-left pb-2 pr-4">Large Text</th>
                  <th className="text-left pb-2">UI / Graphics</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-800/50">
                  <td className="py-2 pr-4">
                    <span className="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded font-medium">AA</span>
                  </td>
                  <td className="py-2 pr-4">4.5:1</td>
                  <td className="py-2 pr-4">3:1</td>
                  <td className="py-2">3:1</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-medium">AAA</span>
                  </td>
                  <td className="py-2 pr-4">7:1</td>
                  <td className="py-2 pr-4">4.5:1</td>
                  <td className="py-2 text-gray-600">—</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            Large text = ≥18pt (24px) regular  or  ≥14pt (18.67px) bold
          </p>
        </div>
      </div>
    </div>
  );
}
