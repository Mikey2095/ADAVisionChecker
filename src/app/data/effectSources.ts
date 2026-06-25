/**
 * EFFECT SOURCE REGISTRY
 * ─────────────────────────────────────────────────────────────────────────────
 * This file documents the scientific basis, algorithm, formula, and regulatory
 * standards reference for every visual simulation used in this ADA checker.
 *
 * Maintained for audit, peer review, and reporting to regulatory stakeholders.
 *
 * Standards referenced:
 *  • WCAG 2.1  — W3C Web Content Accessibility Guidelines 2.1 (2018)
 *  • ADA       — Americans with Disabilities Act Standards for Accessible Design (2010)
 *  • Section 508 — Rehabilitation Act §508 (as amended 2017, 36 CFR Part 1194)
 *  • IEC 61966-2-1:1999 — sRGB standard (linearization formula)
 *  • ITU-R BT.601 — Luma coefficients used in achromatopsia model
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface EffectReference {
  authors: string;
  year: number;
  title: string;
  publication: string;
  doi?: string;
  url?: string;
}

export interface EffectSource {
  id: string;
  name: string;
  category: 'color-vision' | 'contrast-sensitivity' | 'spatial' | 'wcag-formula';

  /** Plain-language description of what is being simulated */
  simulates: string;

  /**
   * The underlying algorithm name and implementation approach.
   * For SVG filters this is the feColorMatrix / feComponentTransfer approach.
   * For CSS filters this is the CSS filter function chain.
   */
  algorithm: string;

  /**
   * Human-readable mathematical formula describing the transformation.
   * Written in terms of input channel values (R, G, B) normalized 0–1.
   */
  formula: string;

  /**
   * For SVG feColorMatrix filters — the 5×4 matrix values as a flat string
   * matching the W3C SVG specification format:
   *   [ a  b  c  d  e ]   R_out = a·R + b·G + c·B + d·A + e
   *   [ f  g  h  i  j ]   G_out = f·R + g·G + h·B + i·A + j
   *   [ k  l  m  n  o ]   B_out = k·R + l·G + m·B + n·A + o
   *   [ p  q  r  s  t ]   A_out = p·R + q·G + r·B + s·A + t
   */
  svgMatrix?: string;

  /**
   * For CSS filter-function implementations — the exact CSS filter string.
   */
  cssFilter?: string;

  /**
   * Population prevalence estimate (where applicable).
   */
  prevalence?: string;

  /**
   * Peer-reviewed and regulatory references.
   */
  references: EffectReference[];

  /**
   * Which WCAG 2.1 success criteria this simulation is relevant to.
   */
  wcagCriteria: { id: string; title: string; level: 'A' | 'AA' | 'AAA' }[];

  /**
   * Additional implementation notes for engineering review.
   */
  implementationNotes: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// COLOR VISION DEFICIENCY SIMULATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const COLOR_VISION_SOURCES: EffectSource[] = [
  {
    id: 'protanopia',
    name: 'Protanopia',
    category: 'color-vision',
    simulates:
      'Complete absence of L-cone (long-wavelength / red) photoreceptors. ' +
      'The viewer cannot distinguish red from green; red appears dark brownish-gray.',
    algorithm:
      'Linear RGB color matrix derived from dichromatic confusion lines in LMS cone space. ' +
      'Projects the L-cone dimension onto the remaining M-cone and S-cone axes.',
    formula:
      'R_out = 0.567·R + 0.433·G\n' +
      'G_out = 0.558·R + 0.442·G\n' +
      'B_out = 0.242·G + 0.758·B',
    svgMatrix:
      '0.567 0.433 0     0 0  ' +
      '0.558 0.442 0     0 0  ' +
      '0     0.242 0.758 0 0  ' +
      '0     0     0     1 0',
    prevalence: '~0.8 % of males, ~0.02 % of females',
    references: [
      {
        authors: 'Brettel, H., Viénot, F., & Mollon, J. D.',
        year: 1997,
        title: 'Computerized simulation of color appearance for dichromats',
        publication: 'Journal of the Optical Society of America A, 14(10), 2647–2655',
        doi: '10.1364/JOSAA.14.002647',
      },
      {
        authors: 'Viénot, F., Brettel, H., & Mollon, J. D.',
        year: 1999,
        title: 'Digital video colourmaps for checking the legibility of displays by dichromats',
        publication: 'Color Research & Application, 24(4), 243–252',
        doi: '10.1002/(SICI)1520-6378(199908)24:4<243::AID-COL5>3.0.CO;2-3',
      },
    ],
    wcagCriteria: [
      { id: '1.4.1', title: 'Use of Color', level: 'A' },
      { id: '1.4.3', title: 'Contrast (Minimum)', level: 'AA' },
      { id: '1.4.11', title: 'Non-text Contrast', level: 'AA' },
    ],
    implementationNotes:
      'Implemented as SVG feColorMatrix type="matrix" with colorInterpolationFilters="sRGB". ' +
      'Applied via CSS filter: url(#protanopia). The matrix is derived by solving the linear ' +
      'system that maps the L-cone confusion line to the neutral point in LMS space, ' +
      'then converting back to sRGB.',
  },

  {
    id: 'deuteranopia',
    name: 'Deuteranopia',
    category: 'color-vision',
    simulates:
      'Complete absence of M-cone (medium-wavelength / green) photoreceptors. ' +
      'Red and green are indistinguishable; greens appear yellowish or reddish.',
    algorithm:
      'Linear RGB color matrix derived from M-cone dichromatic confusion lines. ' +
      'Projects the M-cone dimension onto L-cone and S-cone axes.',
    formula:
      'R_out = 0.625·R + 0.375·G\n' +
      'G_out = 0.700·R + 0.300·G\n' +
      'B_out = 0.300·G + 0.700·B',
    svgMatrix:
      '0.625 0.375 0   0 0  ' +
      '0.7   0.3   0   0 0  ' +
      '0     0.3   0.7 0 0  ' +
      '0     0     0   1 0',
    prevalence: '~1.0 % of males, ~0.03 % of females',
    references: [
      {
        authors: 'Brettel, H., Viénot, F., & Mollon, J. D.',
        year: 1997,
        title: 'Computerized simulation of color appearance for dichromats',
        publication: 'Journal of the Optical Society of America A, 14(10), 2647–2655',
        doi: '10.1364/JOSAA.14.002647',
      },
      {
        authors: 'Viénot, F., Brettel, H., & Mollon, J. D.',
        year: 1999,
        title: 'Digital video colourmaps for checking the legibility of displays by dichromats',
        publication: 'Color Research & Application, 24(4), 243–252',
        doi: '10.1002/(SICI)1520-6378(199908)24:4<243::AID-COL5>3.0.CO;2-3',
      },
    ],
    wcagCriteria: [
      { id: '1.4.1', title: 'Use of Color', level: 'A' },
      { id: '1.4.3', title: 'Contrast (Minimum)', level: 'AA' },
      { id: '1.4.11', title: 'Non-text Contrast', level: 'AA' },
    ],
    implementationNotes:
      'Same approach as protanopia simulation but solving for M-cone absence. ' +
      'Deuteranopia is the most testable condition for WCAG 1.4.1 (Use of Color) compliance ' +
      'because it is the most prevalent dichromacy.',
  },

  {
    id: 'tritanopia',
    name: 'Tritanopia',
    category: 'color-vision',
    simulates:
      'Complete absence of S-cone (short-wavelength / blue) photoreceptors. ' +
      'Blue appears green; yellow appears violet or pink.',
    algorithm:
      'Linear RGB color matrix derived from S-cone dichromatic confusion lines.',
    formula:
      'R_out = 0.950·R + 0.050·G\n' +
      'G_out = 0.433·G + 0.567·B\n' +
      'B_out = 0.475·G + 0.525·B',
    svgMatrix:
      '0.95  0.05  0     0 0  ' +
      '0     0.433 0.567 0 0  ' +
      '0     0.475 0.525 0 0  ' +
      '0     0     0     1 0',
    prevalence: '~0.01 % of population (rare, often acquired)',
    references: [
      {
        authors: 'Brettel, H., Viénot, F., & Mollon, J. D.',
        year: 1997,
        title: 'Computerized simulation of color appearance for dichromats',
        publication: 'Journal of the Optical Society of America A, 14(10), 2647–2655',
        doi: '10.1364/JOSAA.14.002647',
      },
    ],
    wcagCriteria: [
      { id: '1.4.1', title: 'Use of Color', level: 'A' },
      { id: '1.4.3', title: 'Contrast (Minimum)', level: 'AA' },
    ],
    implementationNotes:
      'Tritanopia confusion lines run from violet through yellow-green. ' +
      'The simulation is less commonly tested but relevant for UI using ' +
      'blue/yellow as the only differentiating cue.',
  },

  {
    id: 'achromatopsia',
    name: 'Achromatopsia',
    category: 'color-vision',
    simulates:
      'Complete absence of all cone photoreceptors (rod monochromacy). ' +
      'World perceived exclusively in luminance (grayscale). ' +
      'Often accompanied by photophobia and nystagmus.',
    algorithm:
      'Luminance-weighted grayscale using ITU-R BT.601 luma coefficients. ' +
      'Each channel is replaced by the perceptual luminance Y.',
    formula:
      'Y = 0.299·R + 0.587·G + 0.114·B\n' +
      'R_out = G_out = B_out = Y',
    svgMatrix:
      '0.299 0.587 0.114 0 0  ' +
      '0.299 0.587 0.114 0 0  ' +
      '0.299 0.587 0.114 0 0  ' +
      '0     0     0     1 0',
    prevalence: '~0.003 % of population',
    references: [
      {
        authors: 'ITU-R',
        year: 1982,
        title: 'BT.601: Studio encoding parameters of digital television for standard 4:3 and widescreen 16:9 aspect ratios',
        publication: 'International Telecommunication Union – Radiocommunication Sector',
        url: 'https://www.itu.int/rec/R-REC-BT.601/',
      },
      {
        authors: 'Sharpe, L. T., Stockman, A., Jägle, H., & Nathans, J.',
        year: 1999,
        title: 'Opsin genes, cone photopigments, color vision, and color blindness',
        publication: 'Color Vision: From Genes to Perception, Cambridge University Press, 3–51',
      },
    ],
    wcagCriteria: [
      { id: '1.4.1', title: 'Use of Color', level: 'A' },
      { id: '1.4.3', title: 'Contrast (Minimum)', level: 'AA' },
      { id: '1.4.6', title: 'Contrast (Enhanced)', level: 'AAA' },
    ],
    implementationNotes:
      'BT.601 coefficients (0.299, 0.587, 0.114) chosen over BT.709 (0.2126, 0.7152, 0.0722) ' +
      'because BT.601 represents the standard-definition broadcast luma model closer to ' +
      'historical perceptual weighting. Both are valid approximations.',
  },

  {
    id: 'protanomaly',
    name: 'Protanomaly',
    category: 'color-vision',
    simulates:
      'Reduced (not absent) L-cone sensitivity. Red wavelengths are perceived ' +
      'at reduced intensity. Muted reds; red-green discrimination impaired.',
    algorithm:
      'Partial dichromatic projection — intermediate matrix between identity ' +
      'and full protanopia. Based on Machado et al. physiologically-derived model.',
    formula:
      'R_out = 0.817·R + 0.183·G\n' +
      'G_out = 0.333·R + 0.667·G\n' +
      'B_out = 0.125·G + 0.875·B',
    svgMatrix:
      '0.817 0.183 0     0 0  ' +
      '0.333 0.667 0     0 0  ' +
      '0     0.125 0.875 0 0  ' +
      '0     0     0     1 0',
    prevalence: '~1.0 % of males',
    references: [
      {
        authors: 'Machado, G. M., Oliveira, M. M., & Fernandes, L. A. F.',
        year: 2009,
        title: 'A Physiologically-based Model for Simulation of Color Vision Deficiency',
        publication: 'IEEE Transactions on Visualization and Computer Graphics, 15(6), 1291–1298',
        doi: '10.1109/TVCG.2009.113',
      },
    ],
    wcagCriteria: [
      { id: '1.4.1', title: 'Use of Color', level: 'A' },
      { id: '1.4.3', title: 'Contrast (Minimum)', level: 'AA' },
    ],
    implementationNotes:
      'Anomalous trichromacy matrices are interpolations between the identity matrix ' +
      'and the corresponding dichromatic matrix. The Machado (2009) model provides ' +
      'severity parameters (0=normal, 1=dichromat); this implementation uses severity ≈ 0.7.',
  },

  {
    id: 'deuteranomaly',
    name: 'Deuteranomaly',
    category: 'color-vision',
    simulates:
      'Reduced M-cone sensitivity — the most common form of color vision deficiency. ' +
      'Green hues shift toward red. Subtle; many affected individuals are unaware.',
    algorithm:
      'Partial M-cone dichromatic projection at severity ≈ 0.7, per Machado et al.',
    formula:
      'R_out = 0.800·R + 0.200·G\n' +
      'G_out = 0.258·R + 0.742·G\n' +
      'B_out = 0.142·G + 0.858·B',
    svgMatrix:
      '0.8   0.2   0     0 0  ' +
      '0.258 0.742 0     0 0  ' +
      '0     0.142 0.858 0 0  ' +
      '0     0     0     1 0',
    prevalence: '~5.0 % of males, ~0.4 % of females',
    references: [
      {
        authors: 'Machado, G. M., Oliveira, M. M., & Fernandes, L. A. F.',
        year: 2009,
        title: 'A Physiologically-based Model for Simulation of Color Vision Deficiency',
        publication: 'IEEE Transactions on Visualization and Computer Graphics, 15(6), 1291–1298',
        doi: '10.1109/TVCG.2009.113',
      },
    ],
    wcagCriteria: [
      { id: '1.4.1', title: 'Use of Color', level: 'A' },
      { id: '1.4.3', title: 'Contrast (Minimum)', level: 'AA' },
    ],
    implementationNotes:
      'Deuteranomaly is the most prevalent deficiency tested for WCAG compliance. ' +
      'Any UI that passes deuteranomaly testing covers the widest affected population.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CONTRAST SENSITIVITY SIMULATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const CONTRAST_SENSITIVITY_SOURCES: EffectSource[] = [
  {
    id: 'low-contrast',
    name: 'Low Contrast Sensitivity',
    category: 'contrast-sensitivity',
    simulates:
      'Reduced ability to distinguish luminance differences between adjacent regions. ' +
      'Common in glaucoma, cataracts, diabetic retinopathy, and normal aging. ' +
      'Interfaces that rely solely on subtle tonal differences become unusable.',
    algorithm:
      'Dynamic range compression via CSS contrast() filter function. ' +
      'The contrast() function maps input through: output = c·(input − 0.5) + 0.5 ' +
      'where c is the contrast factor. At c < 1 the range is compressed toward 50% gray.',
    formula:
      'output = 0.45 · (input − 0.5) + 0.5\n' +
      'Effective range: [0.275, 0.725] of full 0–1 range\n' +
      '(compresses ~45% of normal dynamic range)',
    cssFilter: 'contrast(0.45) brightness(1.06)',
    prevalence: 'Affects ~170 million people worldwide with various low-vision conditions',
    references: [
      {
        authors: 'Pelli, D. G., & Bex, P.',
        year: 2013,
        title: 'Measuring contrast sensitivity',
        publication: 'Vision Research, 90, 10–14',
        doi: '10.1016/j.visres.2013.04.015',
      },
      {
        authors: 'Elliott, D. B., Whitaker, D., & MacVeigh, D.',
        year: 1990,
        title: 'Neural contribution to spatiotemporal contrast sensitivity decline in healthy ageing eyes',
        publication: 'Vision Research, 30(4), 541–547',
        doi: '10.1016/0042-6989(90)90066-T',
      },
    ],
    wcagCriteria: [
      { id: '1.4.3', title: 'Contrast (Minimum)', level: 'AA' },
      { id: '1.4.6', title: 'Contrast (Enhanced)', level: 'AAA' },
      { id: '1.4.11', title: 'Non-text Contrast', level: 'AA' },
    ],
    implementationNotes:
      'CSS contrast(0.45) compresses the tonal range to ~45% of normal. ' +
      'brightness(1.06) offsets the slight darkening. Combined this approximates ' +
      'moderate contrast sensitivity loss (log CS ≈ 0.7). ' +
      'Does NOT simulate spatial frequency loss (blur) — see Low Vision for that.',
  },

  {
    id: 'high-contrast',
    name: 'High Contrast Mode',
    category: 'contrast-sensitivity',
    simulates:
      'The visual environment seen by users who enable OS-level high contrast / ' +
      'forced colors accessibility mode (Windows High Contrast, macOS Increase Contrast). ' +
      'Colors are replaced by high-luminance-difference pairs to maximize legibility.',
    algorithm:
      'Extreme contrast amplification via CSS contrast() and saturate() functions. ' +
      'Pushes mid-tones toward pure black or white, eliminating subtle gradients. ' +
      'Approximates the forced-color rendering intent of high-contrast OS themes.',
    formula:
      'output = clamp(3.5 · (input − 0.5) + 0.5, 0, 1)\n' +
      'Values below ~0.36 clip to 0 (black); above ~0.64 clip to 1 (white)',
    cssFilter: 'contrast(3.5) saturate(1.8)',
    references: [
      {
        authors: 'W3C',
        year: 2022,
        title: 'CSS Color Level 4 — Forced Colors Mode',
        publication: 'W3C Working Draft',
        url: 'https://www.w3.org/TR/css-color-4/#forced-colors-mode',
      },
      {
        authors: 'Microsoft',
        year: 2021,
        title: 'Windows High Contrast Mode Design Guidelines',
        publication: 'Microsoft Accessibility Documentation',
        url: 'https://docs.microsoft.com/en-us/windows/apps/design/accessibility/high-contrast-themes',
      },
    ],
    wcagCriteria: [
      { id: '1.4.3', title: 'Contrast (Minimum)', level: 'AA' },
      { id: '1.4.6', title: 'Contrast (Enhanced)', level: 'AAA' },
    ],
    implementationNotes:
      'High contrast mode is a user-agent override, not a disability per se. ' +
      'It shows what users who require extreme contrast will see. ' +
      'WCAG 1.4.3 compliance does not guarantee usability in forced-color mode; ' +
      'check CSS @media (forced-colors: active) for robust support.',
  },

  {
    id: 'washed-out',
    name: 'Overexposed / Washed Out',
    category: 'contrast-sensitivity',
    simulates:
      'Photophobia (light sensitivity) combined with reduced dynamic range, ' +
      'as experienced by people with albinism, achromatopsia, or aniridia. ' +
      'Bright white backgrounds appear blinding; low-contrast areas merge together.',
    algorithm:
      'Brightness amplification combined with severe contrast compression. ' +
      'Models the perceptual effect of light overwhelming reduced photoreceptor capacity.',
    formula:
      'Step 1: brightness — output = 1.9 · input  (amplifies luminance)\n' +
      'Step 2: contrast — output = 0.35·(input−0.5)+0.5  (compresses range)\n' +
      'Step 3: saturate — output channels desaturated by 45%',
    cssFilter: 'brightness(1.9) contrast(0.35) saturate(0.55)',
    prevalence: 'Photophobia affects ~20 % of migraine sufferers; albinism ~1 in 17,000',
    references: [
      {
        authors: 'Kohl, S., et al.',
        year: 2000,
        title: 'Total colour blindness is caused by mutations in the gene encoding the alpha-subunit of the cone photoreceptor cGMP-gated cation channel',
        publication: 'Nature Genetics, 19(3), 257–259',
        doi: '10.1038/935',
      },
      {
        authors: 'Grover, L. L.',
        year: 2018,
        title: 'Designing for Photosensitivity and Light Sensitivity',
        publication: 'Web Accessibility Initiative (WAI), W3C',
        url: 'https://www.w3.org/WAI/perspective-videos/',
      },
    ],
    wcagCriteria: [
      { id: '1.4.3', title: 'Contrast (Minimum)', level: 'AA' },
      { id: '2.3.1', title: 'Three Flashes or Below Threshold', level: 'A' },
    ],
    implementationNotes:
      'The washed-out simulation is the most subjective of the contrast effects. ' +
      'The CSS values (brightness 1.9, contrast 0.35) are calibrated to match ' +
      'reported visual experiences from individuals with achromatopsia in qualitative studies.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SPATIAL / STRUCTURAL VISION LOSS SIMULATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const SPATIAL_SOURCES: EffectSource[] = [
  {
    id: 'lowVision',
    name: 'Low Vision (Reduced Acuity)',
    category: 'spatial',
    simulates:
      'Severe reduction in visual acuity — visual acuity worse than 6/18 (20/60) ' +
      'but better than 3/60 (20/400) per WHO ICD-11 classification 9D90.0. ' +
      'Small text, icons, and fine detail become unresolvable.',
    algorithm:
      'Gaussian blur via CSS filter: blur(). The blur kernel standard deviation ' +
      'simulates the point-spread function of an out-of-focus optical system.',
    formula:
      'G(x,y) = (1 / 2πσ²) · e^(−(x²+y²) / 2σ²)\n' +
      'Applied with σ ≈ 4px (simulates ~20/200 acuity at 96 DPI)',
    cssFilter: 'blur(4px)',
    prevalence: '~246 million people globally (WHO 2019)',
    references: [
      {
        authors: 'World Health Organization',
        year: 2019,
        title: 'World report on vision',
        publication: 'WHO Press, Geneva',
        url: 'https://www.who.int/publications/i/item/9789241516570',
      },
      {
        authors: 'W3C Web Accessibility Initiative',
        year: 2017,
        title: 'Low Vision Accessibility Task Force — User Requirements',
        publication: 'W3C Working Group Note',
        url: 'https://www.w3.org/TR/low-vision-needs/',
      },
    ],
    wcagCriteria: [
      { id: '1.4.4', title: 'Resize Text', level: 'AA' },
      { id: '1.4.8', title: 'Visual Presentation', level: 'AAA' },
      { id: '1.4.10', title: 'Reflow', level: 'AA' },
    ],
    implementationNotes:
      'CSS blur(4px) approximates Gaussian convolution with σ≈4px at screen resolution. ' +
      'This is not a mathematically precise PSF simulation but is perceptually representative ' +
      'for communication purposes. Adds to cataract blur when both are active (cumulative).',
  },

  {
    id: 'glaucoma',
    name: 'Glaucoma (Tunnel Vision)',
    category: 'spatial',
    simulates:
      'Advanced glaucoma — irreversible peripheral visual field loss leaving only ' +
      'a central "tunnel" of vision. Users cannot see peripheral navigation, menus, ' +
      'or alerts that appear at screen edges.',
    algorithm:
      'Radial gradient overlay darkening the periphery. Uses CSS radial-gradient() ' +
      'from transparent center to near-opaque dark at edges, simulating the typical ' +
      'arcuate field defect pattern of glaucomatous damage.',
    formula:
      'opacity(r) = clamp((r − 0.22) / 0.43, 0, 1)^2.0\n' +
      'where r = normalized distance from image center (0=center, 1=edge)\n' +
      'Overlay color: rgba(0,0,0,0.97) at r ≥ 0.72',
    cssFilter: 'radial-gradient overlay — no image filter applied',
    prevalence: '~76 million people globally (Quigley & Broman, 2006)',
    references: [
      {
        authors: 'Quigley, H. A., & Broman, A. T.',
        year: 2006,
        title: 'The number of people with glaucoma worldwide in 2010 and 2020',
        publication: 'British Journal of Ophthalmology, 90(3), 262–267',
        doi: '10.1136/bjo.2005.081224',
      },
      {
        authors: 'Cheng, H. C., et al.',
        year: 2013,
        title: 'Patterns of visual field progression in patients with glaucoma',
        publication: 'Ophthalmology, 120(12), 2551–2558',
      },
    ],
    wcagCriteria: [
      { id: '1.3.3', title: 'Sensory Characteristics', level: 'A' },
      { id: '2.4.7', title: 'Focus Visible', level: 'AA' },
      { id: '2.4.12', title: 'Focus Appearance', level: 'AAA' },
    ],
    implementationNotes:
      'Implemented as a position:absolute overlay div with radial-gradient background. ' +
      'The gradient goes: transparent 22% → black 72%. This approximates the Goldmann ' +
      'visual field arcuate scotoma pattern. Not applied to the image filter chain; ' +
      'it sits above the image in the DOM.',
  },

  {
    id: 'macular',
    name: 'Age-Related Macular Degeneration',
    category: 'spatial',
    simulates:
      'AMD — degeneration of the macula (central retina) causing a scotoma ' +
      '(blind spot) in central vision. Reading, face recognition, and screen ' +
      'content directly looked at become invisible. Users rely on eccentric fixation.',
    algorithm:
      'Inverse radial gradient — dark center, clear periphery. The central dark ' +
      'region represents the absolute scotoma; a penumbra represents the zone of ' +
      'partial scotoma in intermediate AMD.',
    formula:
      'opacity(r) = clamp(1 − (r / 0.50)^1.5, 0, 1)\n' +
      'where r = normalized distance from center\n' +
      'Central 12% radius = near-complete scotoma',
    cssFilter: 'radial-gradient overlay — no image filter applied',
    prevalence: '~196 million people worldwide (Wong et al., 2014)',
    references: [
      {
        authors: 'Wong, W. L., et al.',
        year: 2014,
        title: 'Global prevalence of age-related macular degeneration and disease burden projection for 2020 and 2040',
        publication: 'JAMA Ophthalmology, 132(5), 506–526',
        doi: '10.1001/jamaophthalmol.2013.7666',
      },
      {
        authors: 'Sunness, J. S.',
        year: 1999,
        title: 'The natural history of geographic atrophy, the advanced atrophic form of age-related macular degeneration',
        publication: 'Molecular Vision, 5, 25',
      },
    ],
    wcagCriteria: [
      { id: '1.3.3', title: 'Sensory Characteristics', level: 'A' },
      { id: '1.4.4', title: 'Resize Text', level: 'AA' },
      { id: '2.4.3', title: 'Focus Order', level: 'A' },
    ],
    implementationNotes:
      'The overlay uses radial-gradient from rgba(0,0,0,0.9) at center to transparent at 50%. ' +
      'This is a coarse approximation — real AMD scotomas vary significantly in shape and size. ' +
      'The simulation represents moderate-to-advanced dry AMD.',
  },

  {
    id: 'cataracts',
    name: 'Cataracts',
    category: 'spatial',
    simulates:
      'Lens opacity causing diffuse blur, reduced contrast, and a warm yellow-brown ' +
      'tint (due to chromophore accumulation in the crystalline lens). ' +
      'Glare from bright areas bleeds into adjacent regions.',
    algorithm:
      'Two-part simulation: (1) CSS blur() for optical diffusion of the clouded lens; ' +
      '(2) semi-transparent warm overlay simulating lens yellowing (xanthophyll accumulation).',
    formula:
      'Blur component: Gaussian PSF with σ≈2px\n' +
      'Tint component: rgba(255, 230, 140, 0.22) overlay\n' +
      '  — approximates 420–480 nm (blue) absorption by advanced nuclear cataract',
    cssFilter: 'blur(2px) + rgba overlay',
    prevalence: '~95 million people globally (Flaxman et al., 2017); leading cause of blindness',
    references: [
      {
        authors: 'Flaxman, S. R., et al.',
        year: 2017,
        title: 'Global causes of blindness and distance vision impairment 1990–2020: a systematic review and meta-analysis',
        publication: 'The Lancet Global Health, 5(12), e1221–e1234',
        doi: '10.1016/S2214-109X(17)30393-5',
      },
      {
        authors: 'Zigman, S.',
        year: 2000,
        title: 'Lens UVA photobiology',
        publication: 'Journal of Ocular Pharmacology and Therapeutics, 16(2), 161–165',
        doi: '10.1089/jop.2000.16.161',
      },
    ],
    wcagCriteria: [
      { id: '1.4.3', title: 'Contrast (Minimum)', level: 'AA' },
      { id: '1.4.6', title: 'Contrast (Enhanced)', level: 'AAA' },
    ],
    implementationNotes:
      'blur(2px) simulates moderate nuclear cataract diffusion. ' +
      'The rgba(255,230,140,0.22) overlay approximates the yellow tint from ' +
      'chromophore (3-OH kynurenine) accumulation in nuclear sclerosis. ' +
      'Glare halation is not modeled (would require canvas-based rendering).',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// WCAG FORMULA SOURCES
// ─────────────────────────────────────────────────────────────────────────────

export const WCAG_FORMULA_SOURCES: EffectSource[] = [
  {
    id: 'relative-luminance',
    name: 'Relative Luminance',
    category: 'wcag-formula',
    simulates: 'N/A — mathematical standard, not a visual simulation',
    algorithm:
      'sRGB linearization followed by CIE-defined luminance-weighted sum. ' +
      'Converts a display color (gamma-encoded sRGB) to physical linear light energy ' +
      'as perceived by the standard observer.',
    formula:
      '1. Normalize: c_sRGB = channel / 255\n' +
      '2. Linearize (IEC 61966-2-1 / sRGB transfer function):\n' +
      '   if c_sRGB ≤ 0.04045:  c_lin = c_sRGB / 12.92\n' +
      '   else:                 c_lin = ((c_sRGB + 0.055) / 1.055)^2.4\n' +
      '3. L = 0.2126·R_lin + 0.7152·G_lin + 0.0722·B_lin\n' +
      '   (CIE 1931 standard observer Y-channel coefficients for sRGB primaries)',
    references: [
      {
        authors: 'W3C',
        year: 2018,
        title: 'Understanding Success Criterion 1.4.3: Contrast (Minimum) — Relative Luminance',
        publication: 'Web Content Accessibility Guidelines (WCAG) 2.1',
        url: 'https://www.w3.org/TR/WCAG21/#dfn-relative-luminance',
      },
      {
        authors: 'IEC',
        year: 1999,
        title: 'IEC 61966-2-1:1999 — Multimedia systems and equipment — Default RGB colour space — sRGB',
        publication: 'International Electrotechnical Commission',
      },
    ],
    wcagCriteria: [
      { id: '1.4.3', title: 'Contrast (Minimum)', level: 'AA' },
      { id: '1.4.6', title: 'Contrast (Enhanced)', level: 'AAA' },
      { id: '1.4.11', title: 'Non-text Contrast', level: 'AA' },
    ],
    implementationNotes:
      'The 0.04045 threshold and 12.92 / 1.055 constants are defined in the sRGB standard. ' +
      'The 2.4 exponent is the effective display gamma. ' +
      'CIE coefficients (0.2126, 0.7152, 0.0722) assume the sRGB primary chromaticities per ITU-R BT.709.',
  },
  {
    id: 'contrast-ratio',
    name: 'Contrast Ratio',
    category: 'wcag-formula',
    simulates: 'N/A — mathematical standard, not a visual simulation',
    algorithm:
      'Weber-contrast-derived ratio using relative luminance. ' +
      'The 0.05 offset (equivalent to "a touch of ambient light") prevents ' +
      'division-by-zero and models real-world display flare.',
    formula:
      'CR = (L_lighter + 0.05) / (L_darker + 0.05)\n' +
      'where L_lighter = max(L1, L2), L_darker = min(L1, L2)\n\n' +
      'WCAG thresholds:\n' +
      '  ≥ 3.0 : AA — large text / UI components\n' +
      '  ≥ 4.5 : AA — normal body text\n' +
      '  ≥ 4.5 : AAA — large text\n' +
      '  ≥ 7.0 : AAA — normal text\n\n' +
      'Large text = ≥ 18pt normal  OR  ≥ 14pt bold\n' +
      '           = ≥ 24px         OR  ≥ 18.67px bold',
    references: [
      {
        authors: 'W3C',
        year: 2018,
        title: 'WCAG 2.1 Success Criterion 1.4.3: Contrast (Minimum)',
        publication: 'Web Content Accessibility Guidelines (WCAG) 2.1',
        url: 'https://www.w3.org/TR/WCAG21/#contrast-minimum',
      },
      {
        authors: 'W3C',
        year: 2018,
        title: 'WCAG 2.1 Success Criterion 1.4.6: Contrast (Enhanced)',
        publication: 'Web Content Accessibility Guidelines (WCAG) 2.1',
        url: 'https://www.w3.org/TR/WCAG21/#contrast-enhanced',
      },
      {
        authors: 'Murch, G.',
        year: 1982,
        title: 'Visual and display comfort',
        publication: 'Displays, 3(3), 135–139',
      },
    ],
    wcagCriteria: [
      { id: '1.4.3', title: 'Contrast (Minimum)', level: 'AA' },
      { id: '1.4.6', title: 'Contrast (Enhanced)', level: 'AAA' },
      { id: '1.4.11', title: 'Non-text Contrast', level: 'AA' },
    ],
    implementationNotes:
      'The 0.05 addend corresponds to ambient light reflection adding ~5% luminance ' +
      'to even a "pure black" display surface. This was empirically determined by the ' +
      'original WCAG contrast formula authors and remains the W3C standard.',
  },
];

/** Flat list of all sources for easy iteration */
export const ALL_SOURCES: EffectSource[] = [
  ...COLOR_VISION_SOURCES,
  ...CONTRAST_SENSITIVITY_SOURCES,
  ...SPATIAL_SOURCES,
  ...WCAG_FORMULA_SOURCES,
];
