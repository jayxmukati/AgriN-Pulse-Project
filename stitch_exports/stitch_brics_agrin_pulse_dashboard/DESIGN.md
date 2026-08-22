---
name: Climate Intelligence Command
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1b1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#c6c6cd'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#303032'
  outline: '#909097'
  outline-variant: '#46464c'
  surface-tint: '#c0c6de'
  primary: '#c0c6de'
  on-primary: '#2a3043'
  primary-container: '#020617'
  on-primary-container: '#72778d'
  inverse-primary: '#585e73'
  secondary: '#b9c7e0'
  on-secondary: '#233144'
  secondary-container: '#3c4a5e'
  on-secondary-container: '#abb9d2'
  tertiary: '#e4bfaa'
  on-tertiary: '#422b1d'
  tertiary-container: '#110400'
  on-tertiary-container: '#917260'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dce1fb'
  primary-fixed-dim: '#c0c6de'
  on-primary-fixed: '#151b2d'
  on-primary-fixed-variant: '#40465a'
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#ffdbc8'
  tertiary-fixed-dim: '#e4bfaa'
  on-tertiary-fixed: '#2b170a'
  on-tertiary-fixed-variant: '#5b4131'
  background: '#131315'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
typography:
  display-lg:
    fontFamily: spaceGrotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: spaceGrotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: spaceGrotesk
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.2'
  body-lg:
    fontFamily: geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
  body-sm:
    fontFamily: geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
  label-caps:
    fontFamily: geist
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.08em
  mono-data:
    fontFamily: geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: -0.01em
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 24px
  panel-gap: 1px
---

## Brand & Style

This design system establishes a technical, high-density environment for agricultural intelligence and macro-economic forecasting across BRICS nations. The aesthetic is rooted in **Experimental Brutalism**, optimized for a "Climate Intelligence Command Center" experience. It prioritizes information density and data integrity over decorative flourishes.

The brand personality is authoritative, precise, and industrial. It targets analysts and policy-makers who require rapid visual scanning of complex spatial and temporal datasets. By utilizing ultra-thin borders and monospaced influences, the system evokes a sense of cutting-edge satellite telemetry and real-time ground-truth monitoring.

## Colors

The palette is anchored in a deep slate and charcoal spectrum to minimize eye fatigue during long-duration monitoring. The core background is set to the seed color, while containers use a slightly elevated slate to create structure without relying on shadows.

Data visualization relies on a strict semantic system:
- **Emerald (#10b981):** Vigor, growth, and positive agricultural output.
- **Amber (#f59e0b):** Warnings, moisture stress, and market volatility.
- **Crimson (#ef4444):** Crop outbreaks, emergency alerts, and system failures.
- **Cyan (#06b6d4):** Climate metrics, precipitation data, and atmospheric variables.

All interactive elements and borders use a high-contrast white or silver to ensure clarity against the dark void of the workspace.

## Typography

Typography is used as a structural element. **Space Grotesk** is reserved for headlines and primary KPI values, providing a technical, geometric edge that fits the "command center" aesthetic. 

**Geist** is the workhorse for all body copy and tabular data. Its clean, developer-centric proportions allow for high-density layouts without sacrificing legibility. For data feeds and coordinate systems, use the `mono-data` role to ensure numerical alignment. Labels should frequently use `label-caps` to distinguish metadata from actionable content.

## Layout & Spacing

This design system utilizes a **Technical Grid** model. Rather than large gaps, components are often separated by ultra-thin `1px` borders (using the `border_subtle` color) to maximize screen real estate. 

The layout follows a 12-column fluid grid for desktop dashboards, but relies heavily on "Panel Containers"—nested modules that snap to the grid. Spacing is strictly based on a 4px increment system. In high-density views, internal padding is compressed to `8px` or `12px` to ensure the maximum amount of data is visible above the fold.

## Elevation & Depth

In line with the Brutalist influence, this design system eschews shadows and blurs. Depth is conveyed through **Tonal Layering** and **Structural Outlines**.

- **Level 0 (Base):** Seed color (#020617) for the main application background.
- **Level 1 (Panels):** Surface Container (#0f172a) for KPI cards, maps, and feed containers.
- **Level 2 (Inlays):** Darker slate (#020617) used inside panels for input fields or nested data lists to create a "punched-out" effect.

Contrast is created through high-visibility borders (`1px solid #1e293b`) rather than Z-axis elevation. Active states should use a direct color swap or a high-contrast white border rather than a shadow.

## Shapes

The shape language is strictly **Sharp (0px)**. 

Every element—from buttons and cards to input fields and tabs—must have hard 90-degree corners. This reinforces the industrial, data-driven nature of the dashboard and allows panels to sit flush against one another, creating a seamless "command console" appearance.

## Components

### Buttons & Inputs
- **Primary Action:** Solid white background with black (#020617) text. Sharp corners.
- **Secondary Action:** Ghost style with `1px` border of `border_subtle`.
- **Inputs:** Darker background (#020617) with a `1px` slate border. On focus, the border turns white.

### KPI Cards
KPI cards feature a `label-caps` header, a large `display-lg` value in the center, and a bottom-aligned sparkline or trend indicator. Use semantic colors (Emerald/Crimson) for the trend text only.

### Tabbed Interfaces
Tabs are presented as a row of sharp-edged boxes. The active tab is indicated by a white top-border or a solid white fill with inverted text.

### Data Feeds
Compact rows using `body-sm` typography. Each row is separated by a `1px` horizontal line. Use monospaced numbers for all numerical columns to ensure vertical alignment.

### Spatial Map Containers
Maps should be framed in a `1px` white border to distinguish them from the UI. UI overlays on maps (zoom controls, legends) should use a semi-opaque `#0f172a` background to maintain legibility without fully obscuring the map data.