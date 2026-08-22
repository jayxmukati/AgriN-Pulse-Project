---
name: AgriScan Diagnostic
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#ba0035'
  on-secondary: '#ffffff'
  secondary-container: '#e21e49'
  on-secondary-container: '#fffbff'
  tertiary: '#825100'
  on-tertiary: '#ffffff'
  tertiary-container: '#a36700'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#ffdada'
  secondary-fixed-dim: '#ffb3b6'
  on-secondary-fixed: '#40000c'
  on-secondary-fixed-variant: '#920028'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  data-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 16px
  gutter: 12px
---

## Brand & Style

This design system is engineered for high-stakes agricultural diagnostics, blending the precision of a medical laboratory with the rugged utility required for field operations. The brand personality is **Systematic, Authoritative, and Urgent**. It prioritizes clarity over decoration, ensuring that farmers and agronomists can make critical decisions under varying light conditions and high-stress scenarios.

The visual style follows a **Corporate / Modern** aesthetic with a heavy emphasis on **Functional Minimalism**. By utilizing a "Safe" visual identity, the system leverages industry-standard patterns to reduce cognitive load, allowing the user's focus to remain entirely on the crop data and pathology alerts. The interface should feel like a professional tool—reliable, data-driven, and scientifically sound.

## Colors

The palette is rooted in a diagnostic logic where color serves as the primary indicator of crop health.

- **Primary (#059669):** An Emerald Green used for "Healthy" states, high-confidence results, and primary action buttons. It signifies growth and success.
- **Secondary (#E11D48):** A clinical soft red used exclusively for high-severity pathology alerts and critical failures.
- **Tertiary (#F59E0B):** An amber/orange used for warning states, moderate severity, or inconclusive scans.
- **Neutral/Background:** A foundation of clean whites and cool grays (#F8FAFC) ensures a clinical feel and provides maximum contrast for scan imagery and data visualizations.

Avoid using the primary green for non-essential decorative elements to maintain its functional meaning as a "Success/Healthy" signal.

## Typography

The design system utilizes **Inter** across all levels to guarantee maximum legibility in outdoor environments where screen glare is a factor. 

- **Hierarchical Clarity:** Use `display-lg` strictly for primary diagnostic results (e.g., "Blight Detected"). 
- **Readability:** Body text uses a generous 1.5x line height to ensure advisory content is easily digestible while standing in a field.
- **Labels:** `label-sm` should be used for metadata and confidence score headers, often paired with neutral grays to recede behind primary data.
- **Data:** While Inter is a sans-serif, its tabular numeric properties should be leveraged for confidence percentages and area measurements to ensure vertical alignment in lists.

## Layout & Spacing

This design system employs a **Fluid Grid** optimized for mobile-first field use. The spacing rhythm is based on a **4px baseline**, ensuring all elements scale predictably.

- **Margins:** A standard 16px lateral margin is maintained for all mobile screens to prevent thumb-overlap on edge-to-edge hardware.
- **Touch Targets:** All interactive elements (buttons, accordion headers) must maintain a minimum height of 48px to accommodate gloved or weathered hands.
- **Information Density:** Use `lg` (24px) spacing between distinct data groups (e.g., between the scan image and the diagnostic report) and `sm` (8px) for internal card elements.

## Elevation & Depth

To maintain a scientific and clean aesthetic, the system uses **Tonal Layers** and **Low-contrast Outlines** rather than heavy shadows.

- **Surface Levels:** The primary background is #F8FAFC. Cards and containers use #FFFFFF with a subtle 1px border (#E2E8F0).
- **Interactive Depth:** Only the primary "Scan" button and active diagnostic cards use a soft, ambient shadow (Y: 4, Blur: 12, Opacity: 0.05, Color: Neutral) to indicate interactability.
- **Z-Index Strategy:** Diagnostic overlays and camera viewfinders sit on the highest elevation, using a semi-transparent dark scrim to focus the user's attention on the crop capture.

## Shapes

The shape language is **Professional and Controlled**. A `roundedness` level of **1** (0.25rem / 4px) is applied to most UI components to strike a balance between modern friendliness and clinical precision.

- **Primary Components:** Buttons, Input fields, and Accordions use the base 4px radius.
- **Large Containers:** Diagnostic cards and image previews use `rounded-lg` (8px) to soften the visual impact of high-density data.
- **Status Indicators:** Confidence meters and progress bars use fully rounded caps (pill-shaped) to distinguish them from structural layout elements.

## Components

- **Diagnostic Cards:** White backgrounds with 1px light gray borders. Use a color-coded top-border (4px thickness) matching the pathology severity (Green, Amber, or Red).
- **Confidence Meters:** Horizontal bar components. The "fill" should use the Primary Green, while the "track" is a light gray (#F1F5F9). Labels for the percentage should use `data-mono` typography.
- **Buttons:**
    - *Primary:* Solid Green (#059669) with white text. High contrast, 48px height.
    - *Secondary:* Ghost style with a 1px Neutral border. Used for "Add Notes" or "History."
- **Advisory Accordions:** Used for long-form treatment instructions. Headers must be high-contrast with a clear chevron icon. Internal padding should be `md` (16px).
- **Pathology Badges:** Small chips with low-opacity background tints of the severity colors (e.g., 10% Red background with 100% Red text) for quick scanning in list views.
- **Camera Viewfinder:** A specialized component with a centered focus bracket and real-time "Stability" indicators using the primary green when the image is sharp enough for analysis.