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
    <div className={`flex items-center gap-2 px-3 py-2 rounded-[8px] text-sm border ${
      passes
        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
        : 'bg-red-50 text-red-500 border-red-200'
    }`}>
      {passes
        ? <Check className="w-3.5 h-3.5 flex-none" />
        : <X className="w-3.5 h-3.5 flex-none" />}
      <span className="text-xs font-medium">{label}</span>
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
    <div className="space-y-4">
      {/* Color pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: 'Foreground', value: fg, set: setFg },
          { label: 'Background', value: bg, set: setBg },
        ].map(({ label, value, set }) => (
          <div key={label}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#374151] mb-1.5">{label} Color</p>
            <div className="flex items-center gap-2 bg-white rounded-[10px] p-2 border border-[#e0e0e8]">
              <div className="relative w-9 h-9 rounded-[8px] overflow-hidden border border-[#e0e0e8] flex-none">
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
                className="flex-1 bg-transparent text-[#0c0c0f] text-sm font-mono outline-none min-w-0"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Preview */}
      <div className="rounded-[10px] p-5 border border-[#e0e0e8]" style={{ backgroundColor: bg }}>
        <p className="text-xl mb-1 font-semibold" style={{ color: fg }}>Sample Heading Text</p>
        <p className="text-sm" style={{ color: fg }}>
          The quick brown fox jumps over the lazy dog. This is body text at normal size.
        </p>
        <p className="text-xs mt-2 opacity-80" style={{ color: fg }}>
          Small text (caption level) — harder to read at low contrast
        </p>
      </div>

      {/* Ratio display */}
      <div className="bg-white rounded-[10px] p-5 border border-[#e0e0e8] text-center">
        <div className="text-5xl font-mono text-[#0c0c0f]">
          {ratio ? ratio.toFixed(2) : '—'}
          <span className="text-xl text-[#6b7280] ml-1">:1</span>
        </div>
        <p className="text-xs text-[#4b5563] mt-1">Contrast Ratio</p>
        {ratio && (
          <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs border font-medium ${
            r >= 7 ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
            : r >= 4.5 ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
            : r >= 3 ? 'bg-orange-50 text-orange-500 border-orange-200'
            : 'bg-red-50 text-red-500 border-red-200'
          }`}>
            {r >= 7 ? '★ AAA' : r >= 4.5 ? '✓ AA' : r >= 3 ? '◐ Partial' : '✗ Fail'}
          </div>
        )}
      </div>

      {/* Pass/fail badges */}
      {ratio && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#374151] border-b border-[#e0e0e8] pb-2">
          WCAG 2.1 — Mathematical Formulas
        </h3>

        <div className="bg-white rounded-[10px] p-4 border border-[#e0e0e8] space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#374151] mb-2">Step 1 — Linearize sRGB</p>
            <div className="bg-[#f5f5f7] rounded-[8px] p-3 font-mono text-xs text-[#3a3a3a] space-y-1 border border-[#e0e0e8]">
              <div>c_sRGB = channel / 255</div>
              <div className="text-[#6b7280]">if c_sRGB ≤ 0.04045:</div>
              <div className="ml-4 text-emerald-600">c_lin = c_sRGB / 12.92</div>
              <div className="text-[#6b7280]">else:</div>
              <div className="ml-4 text-emerald-600">c_lin = ((c_sRGB + 0.055) / 1.055) ^ 2.4</div>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#374151] mb-2">Step 2 — Relative Luminance (WCAG 1.4)</p>
            <div className="bg-[#f5f5f7] rounded-[8px] p-3 font-mono text-xs border border-[#e0e0e8]">
              <span className="text-emerald-600">L = 0.2126 × R</span>
              <span className="text-[#6b7280]"> + </span>
              <span className="text-emerald-600">0.7152 × G</span>
              <span className="text-[#6b7280]"> + </span>
              <span className="text-emerald-600">0.0722 × B</span>
            </div>
            <p className="text-xs text-[#4b5563] mt-1 ml-1">Coefficients match human eye sensitivity (green dominates)</p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#374151] mb-2">Step 3 — Contrast Ratio</p>
            <div className="bg-[#f5f5f7] rounded-[8px] p-3 font-mono text-xs text-emerald-600 border border-[#e0e0e8]">
              CR = (L_lighter + 0.05) / (L_darker + 0.05)
            </div>
            <p className="text-xs text-[#4b5563] mt-1 ml-1">0.05 offset prevents division by zero for pure black</p>
          </div>
        </div>

        {/* Live breakdown */}
        {l1 !== null && l2 !== null && ratio && (
          <div className="bg-white rounded-[10px] p-4 border border-[#e0e0e8]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#374151] mb-3">Live Calculation</p>
            <div className="font-mono text-xs space-y-1">
              <div className="text-[#6b7280]">Foreground luminance (L1) =
                <span className="text-[#0c0c0f] ml-2">{l1.toFixed(6)}</span>
              </div>
              <div className="text-[#6b7280]">Background luminance (L2) =
                <span className="text-[#0c0c0f] ml-2">{l2.toFixed(6)}</span>
              </div>
              <div className="text-[#c8c8d4] py-1">──────────────────────────────</div>
              <div className="text-[#3a3a3a]">
                CR = ({Math.max(l1, l2).toFixed(4)} + 0.05) / ({Math.min(l1, l2).toFixed(4)} + 0.05)
              </div>
              <div className="text-emerald-600">
                CR = <span className="text-[#0c0c0f]">{ratio.toFixed(4)}</span>:1
              </div>
            </div>
          </div>
        )}

        {/* Threshold table */}
        <div className="bg-white rounded-[10px] p-4 border border-[#e0e0e8]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#374151] mb-3">WCAG Compliance Thresholds</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[#6b7280] border-b border-[#e0e0e8]">
                  <th className="text-left pb-2 pr-4 font-medium">Level</th>
                  <th className="text-left pb-2 pr-4 font-medium">Normal Text</th>
                  <th className="text-left pb-2 pr-4 font-medium">Large Text</th>
                  <th className="text-left pb-2 font-medium">UI / Graphics</th>
                </tr>
              </thead>
              <tbody className="text-[#3a3a3a]">
                <tr className="border-b border-[#f0f0f0]">
                  <td className="py-2 pr-4">
                    <span className="bg-yellow-50 text-yellow-600 border border-yellow-200 px-2 py-0.5 rounded text-xs font-semibold">AA</span>
                  </td>
                  <td className="py-2 pr-4">4.5:1</td>
                  <td className="py-2 pr-4">3:1</td>
                  <td className="py-2">3:1</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded text-xs font-semibold">AAA</span>
                  </td>
                  <td className="py-2 pr-4">7:1</td>
                  <td className="py-2 pr-4">4.5:1</td>
                  <td className="py-2 text-[#6b7280]">—</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#6b7280] mt-3">
            Large text = ≥18pt (24px) regular  or  ≥14pt (18.67px) bold
          </p>
        </div>
      </div>
    </div>
  );
}
