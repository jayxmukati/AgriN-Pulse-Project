---
name: AgriN-Pulse
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#42493e'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#72796e'
  outline-variant: '#c2c9bb'
  surface-tint: '#3b6934'
  primary: '#154212'
  on-primary: '#ffffff'
  primary-container: '#2d5a27'
  on-primary-container: '#9dd090'
  inverse-primary: '#a1d494'
  secondary: '#795900'
  on-secondary: '#ffffff'
  secondary-container: '#ffbf00'
  on-secondary-container: '#6d5000'
  tertiary: '#60233e'
  on-tertiary: '#ffffff'
  tertiary-container: '#7c3a55'
  on-tertiary-container: '#ffaac8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bcf0ae'
  primary-fixed-dim: '#a1d494'
  on-primary-fixed: '#002201'
  on-primary-fixed-variant: '#23501e'
  secondary-fixed: '#ffdfa0'
  secondary-fixed-dim: '#fbbc00'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5c4300'
  tertiary-fixed: '#ffd9e4'
  tertiary-fixed-dim: '#ffb0cc'
  on-tertiary-fixed: '#3b0520'
  on-tertiary-fixed-variant: '#71314c'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-lg:
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
  label-lg:
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
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-margin: 1.5rem
  gutter: 1rem
  touch-target-min: 48px
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style
The design system for this product is built on a foundation of **Safe Modernism**, specifically tailored for the agricultural sector. The brand personality is rooted in reliability and environmental stewardship, evoking a sense of calm authority for smallholder farmers. 

The visual identity prioritizes high legibility and systematic clarity to accommodate varying levels of digital literacy and diverse environmental lighting conditions (such as direct sunlight in the field). By utilizing a clean, white-dominant aesthetic paired with organic tones, the system builds trust and reduces cognitive load, ensuring that critical agricultural data is the primary focus.

## Colors
This design system utilizes a high-contrast palette to ensure accessibility in outdoor environments. 

- **Primary Forest Green (#2D5A27):** Used for primary actions, success states, and brand-heavy elements. It represents growth and stability.
- **Secondary Amber (#FFBF00):** Reserved for warnings, critical alerts, and time-sensitive agricultural tasks.
- **Neutral Backgrounds:** A pure white (`#FFFFFF`) or very light gray (`#F9FAFB`) background is mandatory to maintain a clean "Safe" aesthetic.
- **Typography Contrast:** All body text must meet or exceed WCAG AA standards against the white background, using deep charcoals rather than pure blacks to reduce eye strain during long periods of data entry.

## Typography
The typographic system uses **Inter** exclusively to leverage its neutral, utilitarian characteristics. The scale is intentionally oversized to ensure readability for all users.

- **Minimal Text Density:** Interfaces should avoid large blocks of text. Use `headline-md` for section titles and `body-lg` for primary information.
- **Touch-Friendly Labels:** Labels for inputs and buttons use `label-lg` to ensure they are legible even when the user is in motion.
- **Hierarchy:** Clear distinction between weights (Bold for headers, Regular for data) helps users scan complex agricultural logs quickly.

## Layout & Spacing
The layout follows a **fluid grid** model optimized for mobile-first PWA usage. 

- **Safe Areas:** A minimum margin of 24px (`1.5rem`) is maintained on the left and right edges of the screen to prevent accidental touches near the bezel.
- **Vertical Rhythm:** Elements are stacked using an 8px base unit. Component spacing should favor generous whitespace (`stack-lg`) to prevent the UI from feeling cluttered.
- **Offline Indicators:** A persistent 40px top or bottom bar should be reserved for connectivity status, ensuring users know when data is synced.
- **Breakpoints:** 
  - Mobile: < 600px (1 column)
  - Tablet: 600px - 1024px (2 columns)
  - Desktop: > 1024px (Max-width container of 1200px)

## Elevation & Depth
Elevation in this design system is used sparingly to maintain the "Safe" and systematic feel. 

- **Surface Tiers:** The background is the lowest level (Level 0). Cards and interactive modules sit at Level 1.
- **Ambient Shadows:** Level 1 elements use a soft, highly diffused shadow (e.g., `0px 4px 12px rgba(0, 0, 0, 0.05)`). This creates a subtle lift that distinguishes cards from the background without creating visual noise.
- **Flat Overlays:** Modals and bottom sheets use a 20% black backdrop blur to focus the user's attention, reinforcing the offline-first, task-oriented nature of the app.

## Shapes
The shape language is defined by a "Rounded" philosophy to feel organic and approachable.

- **Primary Containers:** Cards, buttons, and input fields use a `16px` (1rem) corner radius.
- **Large Components:** Hero sections or large image containers use a `24px` (1.5rem) radius.
- **Consistency:** All interactive elements must share the same roundedness to reinforce the mental model that "rounded corners = interactive or contained info."

## Components

### Buttons
- **Primary:** Forest Green background with White text. Minimum height of 56px for high-stress field use.
- **Secondary:** White background with Forest Green border (2px) and text.
- **Iconography:** Use thick-stroke (2px) icons to match the weight of the Inter font.

### Cards
- **Structure:** White background, 16px border radius, and Level 1 ambient shadow.
- **Padding:** Minimum 20px internal padding to ensure content does not feel cramped.

### Input Fields
- **Styling:** Large text (body-lg) with a 2px light gray border that transitions to Forest Green on focus.
- **Touch Targets:** All inputs must be at least 56px tall.

### Chips & Tags
- **Status:** Use the Amber secondary color for "Pending" or "Warning" tags, and a light tint of the Primary color for "Active" or "Synced" states.

### Lists
- **Density:** Low density. Each list item should have a minimum height of 64px with clear dividers (`1px` light gray) to prevent mis-taps.

### Progress Indicators
- **Offline Sync:** A subtle, non-intrusive progress bar at the top of the viewport to indicate data synchronization progress without interrupting the user's workflow.