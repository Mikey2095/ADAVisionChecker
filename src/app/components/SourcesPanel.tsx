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

const CATEGORY_META: Record<CategoryTab, { label: string; icon: React.ReactNode; color: string; count: number }> = {
  all: {
    label: 'All Sources',
    icon: <BookOpen className="w-3.5 h-3.5" />,
    color: '#94a3b8',
    count: ALL_SOURCES.length,
  },
  'color-vision': {
    label: 'Color Vision',
    icon: <Eye className="w-3.5 h-3.5" />,
    color: '#60a5fa',
    count: COLOR_VISION_SOURCES.length,
  },
  'contrast-sensitivity': {
    label: 'Contrast',
    icon: <BarChart3 className="w-3.5 h-3.5" />,
    color: '#a78bfa',
    count: CONTRAST_SENSITIVITY_SOURCES.length,
  },
  spatial: {
    label: 'Spatial / Structural',
    icon: <Eye className="w-3.5 h-3.5" />,
    color: '#f97316',
    count: SPATIAL_SOURCES.length,
  },
  'wcag-formula': {
    label: 'WCAG Formulas',
    icon: <FlaskConical className="w-3.5 h-3.5" />,
    color: '#34d399',
    count: WCAG_FORMULA_SOURCES.length,
  },
};

const CATEGORY_COLORS: Record<EffectSource['category'], string> = {
  'color-vision': '#3b82f6',
  'contrast-sensitivity': '#a78bfa',
  spatial: '#f97316',
  'wcag-formula': '#10b981',
};

function WcagBadge({ id, title, level }: { id: string; title: string; level: string }) {
  const colors = {
    A: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    AA: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    AAA: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${colors[level as keyof typeof colors]}`}
      title={title}
    >
      <span className="font-mono">{id}</span>
      <span className="text-gray-400 hidden sm:inline">— {title}</span>
      <span className="font-medium">{level}</span>
    </span>
  );
}

function SourceCard({ source }: { source: EffectSource }) {
  const [expanded, setExpanded] = useState(false);
  const catColor = CATEGORY_COLORS[source.category];

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-start gap-4 p-4 text-left hover:bg-gray-800/50 transition-colors"
      >
        <div
          className="w-1 self-stretch rounded-full flex-none"
          style={{ backgroundColor: catColor }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-sm text-gray-100">{source.name}</h3>
            <span
              className="text-xs px-2 py-0.5 rounded-full border"
              style={{ color: catColor, backgroundColor: catColor + '15', borderColor: catColor + '40' }}
            >
              {source.category.replace('-', ' ')}
            </span>
          </div>
          <p className="text-xs text-gray-400 line-clamp-2">{source.simulates}</p>
          {source.prevalence && (
            <p className="text-xs text-gray-600 mt-1">Population: {source.prevalence}</p>
          )}
        </div>
        <div className="flex-none text-gray-600 mt-0.5">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-gray-800 px-4 pb-4 pt-3 space-y-4">

          {/* Algorithm */}
          <div>
            <p className="text-xs text-blue-400 uppercase tracking-wider mb-1.5">Algorithm</p>
            <p className="text-xs text-gray-300">{source.algorithm}</p>
          </div>

          {/* Formula */}
          <div>
            <p className="text-xs text-blue-400 uppercase tracking-wider mb-1.5">Mathematical Formula</p>
            <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs text-green-300 whitespace-pre-wrap leading-relaxed">
              {source.formula}
            </div>
          </div>

          {/* Implementation values */}
          {source.svgMatrix && (
            <div>
              <p className="text-xs text-blue-400 uppercase tracking-wider mb-1.5">
                SVG feColorMatrix Values
                <span className="text-gray-600 font-normal normal-case tracking-normal ml-2">
                  (W3C SVG 1.1 §15.10 — 5×4 RGBA matrix)
                </span>
              </p>
              <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs text-amber-300 whitespace-pre-wrap break-all">
                {source.svgMatrix.split('  ').join('\n')}
              </div>
            </div>
          )}

          {source.cssFilter && !source.svgMatrix && (
            <div>
              <p className="text-xs text-blue-400 uppercase tracking-wider mb-1.5">CSS Filter Value</p>
              <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs text-amber-300">
                filter: {source.cssFilter}
              </div>
            </div>
          )}

          {/* Implementation notes */}
          <div>
            <p className="text-xs text-blue-400 uppercase tracking-wider mb-1.5">Implementation Notes</p>
            <p className="text-xs text-gray-400">{source.implementationNotes}</p>
          </div>

          {/* WCAG criteria */}
          <div>
            <p className="text-xs text-blue-400 uppercase tracking-wider mb-1.5">WCAG 2.1 Success Criteria</p>
            <div className="flex flex-wrap gap-1.5">
              {source.wcagCriteria.map(c => (
                <WcagBadge key={c.id} id={c.id} title={c.title} level={c.level} />
              ))}
            </div>
          </div>

          {/* References */}
          <div>
            <p className="text-xs text-blue-400 uppercase tracking-wider mb-2">Peer-Reviewed References</p>
            <div className="space-y-2.5">
              {source.references.map((ref, i) => (
                <div key={i} className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/50">
                  <p className="text-xs text-gray-200 leading-snug">
                    {ref.authors} ({ref.year}). <em className="text-gray-300">{ref.title}</em>.{' '}
                    <span className="text-gray-400">{ref.publication}</span>
                    {ref.doi && (
                      <span className="text-gray-600 block mt-0.5 font-mono">DOI: {ref.doi}</span>
                    )}
                  </p>
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-1 transition-colors"
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
    <div className="max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <h2 className="text-gray-100">Algorithm Sources & References</h2>
        </div>
        <p className="text-sm text-gray-400">
          Every visual simulation in this tool is derived from peer-reviewed research and
          W3C / ADA regulatory standards. Expand any entry to view the exact formula,
          matrix values, and citations used.
        </p>
      </div>

      {/* Regulatory banner */}
      <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4 mb-6">
        <p className="text-xs text-emerald-400 font-medium mb-1">Regulatory Basis</p>
        <p className="text-xs text-gray-400 leading-relaxed">
          All simulations align with <strong className="text-gray-300">WCAG 2.1</strong> (W3C, 2018),{' '}
          <strong className="text-gray-300">ADA Standards for Accessible Design</strong> (2010),
          and <strong className="text-gray-300">Section 508 of the Rehabilitation Act</strong> (as amended 2017).
          Color blindness matrices are sourced from Brettel et al. (1997), Viénot et al. (1999),
          and Machado et al. (2009). Spatial simulations reference WHO ICD-11 clinical definitions.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 flex-wrap mb-5">
        {tabs.map(tab => {
          const meta = CATEGORY_META[tab];
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${
                active
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200'
              }`}
            >
              {meta.icon}
              {meta.label}
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${active ? 'bg-gray-600' : 'bg-gray-800'}`}>
                {meta.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Source cards */}
      <div className="space-y-3">
        {visibleSources.map(source => (
          <SourceCard key={source.id} source={source} />
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-gray-800">
        <p className="text-xs text-gray-500 leading-relaxed">
          <strong className="text-gray-400">Note for reviewers:</strong> SVG feColorMatrix
          values are applied per the W3C SVG Specification §15.10 using{' '}
          <code className="font-mono text-gray-400">colorInterpolationFilters="sRGB"</code>.
          All matrix arithmetic operates in the sRGB color space as defined by IEC 61966-2-1:1999.
          CSS filter functions (blur, contrast, brightness) are per the W3C Filter Effects Module Level 1
          specification. No third-party simulation libraries are used — all effects are implemented
          natively via SVG and CSS standards.
        </p>
      </div>
    </div>
  );
}
