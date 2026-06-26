import { useState } from 'react';
import { BookOpen, FlaskConical, Eye, BarChart3, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import {
  ALL_SOURCES,
  COLOR_VISION_SOURCES,
  CONTRAST_SENSITIVITY_SOURCES,
  SPATIAL_SOURCES,
  WCAG_FORMULA_SOURCES,
  type EffectSource,
} from '../data/effectSources';

type CategoryTab = 'all' | 'color-vision' | 'contrast-sensitivity' | 'spatial' | 'wcag-formula';

const CATEGORY_META: Record<CategoryTab, { label: string; icon: React.ReactNode; count: number }> = {
  all: { label: 'All Sources', icon: <BookOpen className="w-3.5 h-3.5" />, count: ALL_SOURCES.length },
  'color-vision': { label: 'Color Vision', icon: <Eye className="w-3.5 h-3.5" />, count: COLOR_VISION_SOURCES.length },
  'contrast-sensitivity': { label: 'Contrast', icon: <BarChart3 className="w-3.5 h-3.5" />, count: CONTRAST_SENSITIVITY_SOURCES.length },
  spatial: { label: 'Spatial / Structural', icon: <Eye className="w-3.5 h-3.5" />, count: SPATIAL_SOURCES.length },
  'wcag-formula': { label: 'WCAG Formulas', icon: <FlaskConical className="w-3.5 h-3.5" />, count: WCAG_FORMULA_SOURCES.length },
};

const CATEGORY_COLORS: Record<EffectSource['category'], string> = {
  'color-vision': '#3b82f6',
  'contrast-sensitivity': '#a78bfa',
  spatial: '#f97316',
  'wcag-formula': '#10b981',
};

function WcagBadge({ id, title, level }: { id: string; title: string; level: string }) {
  const colors = {
    A: 'bg-blue-50 text-blue-600 border-blue-200',
    AA: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    AAA: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border font-medium ${colors[level as keyof typeof colors]}`}
      title={title}
    >
      <span className="font-mono">{id}</span>
      <span className="text-[#6b7280] hidden sm:inline">— {title}</span>
      <span>{level}</span>
    </span>
  );
}

function SourceCard({ source }: { source: EffectSource }) {
  const [expanded, setExpanded] = useState(false);
  const catColor = CATEGORY_COLORS[source.category];

  return (
    <div className="bg-white rounded-[10px] border border-[#e0e0e8] overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-start gap-4 p-4 text-left hover:bg-[#f5f5f7] transition-colors"
      >
        <div className="w-1 self-stretch rounded-full flex-none" style={{ backgroundColor: catColor }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-sm font-semibold text-[#0c0c0f]">{source.name}</h3>
            <span
              className="text-xs px-2 py-0.5 rounded-full border font-medium"
              style={{ color: catColor, backgroundColor: catColor + '15', borderColor: catColor + '40' }}
            >
              {source.category.replace('-', ' ')}
            </span>
          </div>
          <p className="text-xs text-[#4b5563] line-clamp-2">{source.simulates}</p>
          {source.prevalence && (
            <p className="text-xs text-[#6b7280] mt-1">Population: {source.prevalence}</p>
          )}
        </div>
        <div className="flex-none text-[#6b7280] mt-0.5">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[#e0e0e8] px-4 pb-4 pt-3 space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#374151] mb-1.5">Algorithm</p>
            <p className="text-xs text-[#3a3a3a]">{source.algorithm}</p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#374151] mb-1.5">Mathematical Formula</p>
            <div className="bg-[#f5f5f7] border border-[#e0e0e8] rounded-[8px] p-3 font-mono text-xs text-emerald-600 whitespace-pre-wrap leading-relaxed">
              {source.formula}
            </div>
          </div>

          {source.svgMatrix && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#374151] mb-1.5">
                SVG feColorMatrix Values
                <span className="text-[#6b7280] font-normal normal-case tracking-normal ml-2">
                  (W3C SVG 1.1 §15.10 — 5×4 RGBA matrix)
                </span>
              </p>
              <div className="bg-[#f5f5f7] border border-[#e0e0e8] rounded-[8px] p-3 font-mono text-xs text-amber-600 whitespace-pre-wrap break-all">
                {source.svgMatrix.split('  ').join('\n')}
              </div>
            </div>
          )}

          {source.cssFilter && !source.svgMatrix && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#374151] mb-1.5">CSS Filter Value</p>
              <div className="bg-[#f5f5f7] border border-[#e0e0e8] rounded-[8px] p-3 font-mono text-xs text-amber-600">
                filter: {source.cssFilter}
              </div>
            </div>
          )}

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#374151] mb-1.5">Implementation Notes</p>
            <p className="text-xs text-[#4b5563]">{source.implementationNotes}</p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#374151] mb-1.5">WCAG 2.1 Success Criteria</p>
            <div className="flex flex-wrap gap-1.5">
              {source.wcagCriteria.map(c => (
                <WcagBadge key={c.id} id={c.id} title={c.title} level={c.level} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#374151] mb-2">Peer-Reviewed References</p>
            <div className="space-y-2">
              {source.references.map((ref, i) => (
                <div key={i} className="bg-[#f5f5f7] border border-[#e0e0e8] rounded-[8px] p-3">
                  <p className="text-xs text-[#3a3a3a] leading-snug">
                    {ref.authors} ({ref.year}). <em className="text-[#0c0c0f]">{ref.title}</em>.{' '}
                    <span className="text-[#6b7280]">{ref.publication}</span>
                    {ref.doi && (
                      <span className="text-[#6b7280] block mt-0.5 font-mono">DOI: {ref.doi}</span>
                    )}
                  </p>
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#4b5563] hover:text-[#0c0c0f] mt-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View source
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SourcesPanel() {
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');

  const visibleSources =
    activeTab === 'all'
      ? ALL_SOURCES
      : ALL_SOURCES.filter(s => s.category === activeTab);

  const tabs: CategoryTab[] = ['all', 'color-vision', 'contrast-sensitivity', 'spatial', 'wcag-formula'];

  return (
    <div className="max-w-3xl mx-auto w-full pb-6">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-[#6b7280]" />
          <h2 className="text-[18px] sm:text-[20px] font-semibold tracking-[-0.4px] text-[#0c0c0f]">Algorithm Sources & References</h2>
        </div>
        <p className="text-sm text-[#374151]">
          Every visual simulation in this tool is derived from peer-reviewed research and
          W3C / ADA regulatory standards. Expand any entry to view the exact formula,
          matrix values, and citations used.
        </p>
      </div>

      {/* Regulatory banner */}
      <div className="bg-[#f5f5f7] border border-[#e0e0e8] rounded-[10px] p-4 mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#374151] mb-1">Regulatory Basis</p>
        <p className="text-xs text-[#4b5563] leading-relaxed">
          All simulations align with <strong className="text-[#3a3a3a]">WCAG 2.1</strong> (W3C, 2018),{' '}
          <strong className="text-[#3a3a3a]">ADA Standards for Accessible Design</strong> (2010),
          and <strong className="text-[#3a3a3a]">Section 508 of the Rehabilitation Act</strong> (as amended 2017).
          Color blindness matrices are sourced from Brettel et al. (1997), Viénot et al. (1999),
          and Machado et al. (2009). Spatial simulations reference WHO ICD-11 clinical definitions.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 flex-wrap mb-4 -mx-0.5">
        {tabs.map(tab => {
          const meta = CATEGORY_META[tab];
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-[7px] rounded-[20px] text-[13px] border transition-all font-medium ${
                active
                  ? 'bg-[#0c0c0f] border-[#0c0c0f] text-white'
                  : 'border-[#e0e0e8] text-[#374151] hover:text-[#0c0c0f] hover:border-[#c0c0c8] bg-white'
              }`}
            >
              {meta.icon}
              {meta.label}
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${active ? 'bg-white/20' : 'bg-[#f0f0f0] text-[#444]'}`}>
                {meta.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Source cards */}
      <div className="space-y-2">
        {visibleSources.map(source => (
          <SourceCard key={source.id} source={source} />
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-5 p-4 bg-white rounded-[10px] border border-[#e0e0e8]">
        <p className="text-xs text-[#4b5563] leading-relaxed">
          <strong className="text-[#3a3a3a]">Note for reviewers:</strong> SVG feColorMatrix
          values are applied per the W3C SVG Specification §15.10 using{' '}
          <code className="font-mono text-[#444]">colorInterpolationFilters="sRGB"</code>.
          All matrix arithmetic operates in the sRGB color space as defined by IEC 61966-2-1:1999.
          CSS filter functions (blur, contrast, brightness) are per the W3C Filter Effects Module Level 1
          specification. No third-party simulation libraries are used — all effects are implemented
          natively via SVG and CSS standards.
        </p>
      </div>
    </div>
  );
}
