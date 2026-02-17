# Pristine Data AI - Design Guide

> Visual design specifications and brand guidelines for designers working on the Pristine Data AI website.

---

## Table of Contents

1. [Brand Identity](#brand-identity)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Grid](#spacing--grid)
5. [Components](#components)
6. [Visual Effects](#visual-effects)
7. [Iconography](#iconography)
8. [Responsive Behavior](#responsive-behavior)
9. [Accessibility](#accessibility)
10. [Logo Usage](#logo-usage)

---

## Brand Identity

### Brand Personality

| Trait | How It's Expressed |
|-------|-------------------|
| **Trustworthy** | Verification badges, accuracy metrics, clean professional design |
| **Intelligent** | AI-powered messaging, natural language interfaces |
| **Premium** | Dark mode polish, attention to detail, subtle animations |
| **Efficient** | Streamlined workflows, "all-in-one" positioning |
| **Modern** | Contemporary typography, glassmorphism, dark theme |
| **Confident** | Bold statistics, direct comparisons, strong calls-to-action |

### Design Principles

1. **Data-Driven Authority**
   - Emphasize scale and accuracy through prominent statistics
   - Use large, bold numbers to communicate data volume
   - Verification badges reinforce trustworthiness

2. **Simplicity Through Sophistication**
   - Clean interfaces that convey powerful capabilities
   - Minimal clutter with purposeful visual hierarchy
   - Let content breathe with generous whitespace

3. **Professional Minimalism**
   - Restrained color palette
   - Generous whitespace
   - Subtle visual effects (avoid flashy animations)

4. **Technology Forward**
   - AI imagery and messaging
   - Real-time validation indicators
   - Modern interaction patterns

### Voice & Tone

- Confident but not arrogant
- Technical but accessible
- Professional but approachable
- Direct and action-oriented

---

## Color System

### Primary Palette - Light Mode

| Role | Hex Code | Usage |
|------|----------|-------|
| **Background Primary** | `#FFFFFF` | Page background |
| **Background Secondary** | `#F8FAFC` | Cards, inputs, subtle sections |
| **Background Tertiary** | `#F1F5F9` | Hover states, toggles |
| **Text Primary** | `#020617` | Headlines, emphasis |
| **Text Secondary** | `#334155` | Body text |
| **Text Muted** | `#64748B` | Labels, captions, placeholders |
| **Border** | `#E2E8F0` | Dividers, card borders |

### Primary Palette - Dark Mode

| Role | Hex Code | Usage |
|------|----------|-------|
| **Background Primary** | `#020617` | Page background |
| **Background Secondary** | `#0F172A` | Cards, sections |
| **Background Tertiary** | `#1E293B` | Hover states, elevated surfaces |
| **Text Primary** | `#FFFFFF` | Headlines, emphasis |
| **Text Secondary** | `#94A3B8` | Body text |
| **Text Muted** | `#64748B` | Labels, captions |
| **Border** | `#1E293B` | Dividers, subtle separations |

### Accent Colors

| Purpose | Hex Code | When to Use |
|---------|----------|-------------|
| **Primary (Indigo)** | `#6366F1` | Focus states, AI features, links, primary actions |
| **Success (Emerald)** | `#10B981` | Verification, positive states, check marks |
| **Warning (Amber)** | `#F59E0B` | Input sources, alerts, attention |
| **Info (Blue)** | `#3B82F6` | Secondary features, informational elements |
| **Brand/Live (Rose)** | `#F43F5E` | Live indicators, urgent actions, errors |

### Gradients

| Name | Colors | Usage |
|------|--------|-------|
| **Impact Numbers** | Indigo `#818CF8` → Cyan `#67E8F9` | Large statistics, emphasis |
| **Pristine Glow** | Indigo `#6366F1` → Purple `#A855F7` → Pink `#EC4899` | Section highlights, special emphasis |
| **Dark Card** | Slate `#1E293B` → Slate `#0F172A` | Card backgrounds in dark sections |
| **Fade Overlay** | Transparent → White (or Slate 950) | Section transitions, hero overlays |

### Selection Colors

| Mode | Background | Text |
|------|------------|------|
| Light | Rose `#FFE4E6` (rose-100) | Rose `#881337` (rose-900) |
| Dark | Indigo `#312E81` (indigo-900) | White `#FFFFFF` |

---

## Typography

### Font Family

**Manrope** - A modern, geometric sans-serif with excellent readability

- Available weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (Extrabold)
- Source: Google Fonts

### Type Scale

| Element | Size (Desktop) | Size (Mobile) | Weight | Letter Spacing | Line Height |
|---------|----------------|---------------|--------|----------------|-------------|
| **H1 Hero** | 60px (3.75rem) | 36px (2.25rem) | 600 (Semibold) | -0.05em (tight) | 1.15 |
| **H2 Section** | 36px (2.25rem) | 30px (1.875rem) | 600 (Semibold) | -0.025em | Default |
| **H3 Card** | 18px (1.125rem) | 18px | 600 (Semibold) | Default | Default |
| **Body Large** | 18px (1.125rem) | 16px (1rem) | 500 (Medium) | Default | 1.625 (relaxed) |
| **Body** | 14px (0.875rem) | 14px | 400 (Regular) | Default | 1.625 (relaxed) |
| **Label** | 10-12px | 10-12px | 700 (Bold) | 0.1em (wide) | Default |
| **Button** | 12px (0.75rem) | 12px | 600 (Semibold) | Default | Default |
| **Monospace/Data** | 14px (0.875rem) | 14px | 400 (Regular) | Default | Default |

### Typography Guidelines

- **Headlines**: Use semibold (600) with tight letter-spacing for impact
- **Body text**: Keep at regular (400) or medium (500) weight for readability
- **Labels/Badges**: Use bold (700) with wide letter-spacing, uppercase
- **Never use regular weight for headlines**
- **Avoid font sizes smaller than 10px**

---

## Spacing & Grid

### Container Widths

| Context | Max Width | Purpose |
|---------|-----------|---------|
| Navigation | 1280px | Full-width nav bar |
| Content Sections | 1152px | Main content areas |
| Tables | 1024px | Comparison tables |
| Hero Content | 896px | Centered hero text |
| Search/Forms | 672px | Input fields, search bars |

### Spacing Scale

| Size | Pixels | Usage |
|------|--------|-------|
| **XS** | 12px | Component gaps, icon margins |
| **SM** | 16px | Standard element gaps |
| **MD** | 24px | Section inner gaps, horizontal padding |
| **LG** | 32px | Card padding |
| **XL** | 48px | Large section gaps |
| **2XL** | 64px | Major section separations |
| **3XL** | 96px | Section vertical padding |

### Grid System

- **Base grid unit**: 24px (for background patterns)
- **Column layouts**: 1 → 2 → 3 columns (mobile → tablet → desktop)
- **Gutter**: 24px between grid items

### Layout Patterns

| Layout | Mobile | Tablet (768px+) | Desktop (1024px+) |
|--------|--------|-----------------|-------------------|
| Feature cards | 1 column | 2 columns | 2-3 columns |
| Contact page | 1 column | 1 column | 2 columns |
| Stats | 2 columns | 2 columns | 4 columns |
| Footer | Stacked | Horizontal | Horizontal |

---

## Components

### Navigation Bar

**Specifications:**
- Height: 64px
- Position: Fixed to top
- Background: Semi-transparent with blur effect (glassmorphism)
- Logo height: 32px
- Link text: 12px, medium weight

**States:**
- Default: Semi-transparent background
- On scroll: Slightly more opaque
- Light/Dark mode: Automatically switches logo and colors

### Buttons

#### Primary Button
- **Size**: 48px height (large), 32px height (small)
- **Padding**: 32px horizontal (large), 14px horizontal (small)
- **Border radius**: 12px (large), 8px (small)
- **Font**: 12px semibold
- **Light mode**: Dark background (`#0F172A`), white text
- **Dark mode**: White background, dark text
- **Hover**: Slightly lighter background, subtle upward movement
- **Shadow**: Soft shadow in light mode, none in dark mode

#### Secondary Button (Ghost)
- Same dimensions as primary
- Transparent background
- Border: 1px, subtle color
- Text color matches surrounding context

### Form Controls

#### Text Input
- **Height**: 42px
- **Padding**: 12px horizontal
- **Border radius**: 8px
- **Border**: 1px, subtle (slate-200/slate-800)
- **Background**: Slight tint (slate-50/slate-950)
- **Focus state**: Indigo border, subtle ring
- **Placeholder**: Muted color (slate-400)

#### With Icon
- Icon positioned 12px from left edge
- Input text indented 40px to accommodate icon
- Icon color: Muted (slate-400)

#### Select Dropdown
- Same styling as text input
- Custom dropdown arrow icon on right
- Cursor: Pointer

#### Textarea
- Minimum 4 rows
- No resize (resize: none)
- Otherwise same as text input

### Cards

#### Feature Card
- **Background**: White (dark: slate-950)
- **Border**: 1px, subtle
- **Border radius**: 16px
- **Padding**: 32px
- **Shadow**: Subtle in light mode
- **Hover**: Slightly darker border, elevated shadow

#### Glass Card (for dark sections)
- **Background**: Semi-transparent dark with blur
- **Border**: 1px, white at 10% opacity
- **Border radius**: 16px
- **Padding**: 32px
- **Shadow**: Deep shadow (2xl)

### Badges

#### Status Badge
- **Shape**: Pill (fully rounded)
- **Padding**: 12px horizontal, 4px vertical
- **Background**: Subtle tint
- **Border**: 1px, subtle
- **Text**: 10px, bold, uppercase, wide tracking
- **Optional**: Pulsing dot indicator

#### Tag Badge
- **Shape**: Rounded rectangle (6px radius)
- **Padding**: 10px horizontal, 4px vertical
- **Background**: Accent color at 10% opacity
- **Border**: 1px, accent at 20% opacity
- **Text**: 10px, bold, uppercase

### Tables

- **Border radius**: 16px on container
- **Header**: Subtle background tint
- **Rows**: Alternating hover state
- **Dividers**: 1px between rows
- **Cell padding**: 24px
- **Highlighted column**: Distinct background, bordered

---

## Visual Effects

### Shadows

| Type | Usage | Intensity |
|------|-------|-----------|
| **Subtle** | Small buttons, cards at rest | Light |
| **Standard** | Primary CTAs, active cards | Medium |
| **Elevated** | Floating elements, modals | Strong |
| **Glow** | Special emphasis, interactive states | Colored |

### Blur Effects

| Type | Amount | Usage |
|------|--------|-------|
| **Navigation** | 12px | Fixed nav glassmorphism |
| **Decorative** | 80px | Background decorations |
| **Card glass** | 24px | Glass card backgrounds |

### Animations

| Animation | Duration | Usage |
|-----------|----------|-------|
| **Theme transition** | 300ms | Color changes between modes |
| **Hover lift** | Instant | Button hover (1-2px up) |
| **Pulse** | 2s loop | Live indicators, status dots |
| **Scale** | 200ms | Button/card hover (1.02x) |

### Guidelines
- Keep animations subtle and purposeful
- Avoid distracting motion
- Respect reduced motion preferences
- Use ease-out timing for most transitions

---

## Iconography

### Icon Library

- **Library**: Solar Icon Set (via Iconify)
- **Style**: Linear for UI elements, Bold for status/decorative

### Size Guide

| Context | Size | Style |
|---------|------|-------|
| Navigation | 16-18px | Linear |
| Feature icons | 20px | Linear |
| Status indicators | 12-14px | Bold |
| Decorative/Large | 20-24px | Bold |
| Inline with text | 14px | Linear |

### Icon Containers

| Size | Container | Border Radius | Usage |
|------|-----------|---------------|-------|
| Standard | 40×40px | 8px | Feature cards |
| Small | 32×32px | 8px | Inline icons |
| Circular | 32×32px | Full | Status indicators |

### Color Guidelines

- Icons inherit text color by default
- Use accent colors for emphasis
- Icon containers use subtle background tints
- Dark mode: Reduce intensity of icon backgrounds

### Common Icons

| Purpose | Icon Name |
|---------|-----------|
| Theme toggle (light) | sun |
| Theme toggle (dark) | moon |
| Navigation arrow | arrow-right |
| Search | magnifier |
| AI/Automation | magic-stick |
| Security | shield-check |
| Database/Data | database |
| Success check | check-circle |
| Error/Close | close-circle |
| Verified | check-read |
| People/Users | users-group-rounded |
| Companies | buildings |
| Action/Quick | bolt |
| Email | letter |
| Website | global |

---

## Responsive Behavior

### Breakpoints

| Name | Width | Typical Devices |
|------|-------|-----------------|
| Mobile | < 640px | Phones |
| Tablet | 640-1023px | Tablets, small laptops |
| Desktop | 1024px+ | Laptops, desktops |
| Large | 1280px+ | Large monitors |

### Key Responsive Changes

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Navigation links | Hidden (hamburger) | Visible | Visible |
| Hero headline | 36px | 48px | 60px |
| Card grid | 1 column | 2 columns | 2-3 columns |
| Section padding | 64px vertical | 96px vertical | 96px vertical |
| Footer | Centered stack | Horizontal | Horizontal |

### Mobile Considerations

- Full-width buttons on small screens
- Stacked layouts for forms
- Larger touch targets (minimum 44×44px)
- Simplified navigation
- Reduced padding/margins

---

## Accessibility

### Color Contrast

- All text must meet WCAG AA standards (4.5:1 for body text, 3:1 for large text)
- Test both light and dark modes
- Don't rely solely on color to convey information

### Interactive Elements

- Minimum touch target: 44×44px
- Clear focus indicators (visible ring)
- Hover states for pointer devices
- Keyboard navigation support

### Text

- Minimum font size: 10px (labels only), 14px preferred for body
- Sufficient line height for readability (1.5+)
- Don't use color alone to convey meaning

### Motion

- Provide reduced motion alternatives
- Keep animations under 300ms for UI feedback
- Avoid flashing or rapidly changing content

### Semantic Structure

- Use proper heading hierarchy (H1 → H2 → H3)
- Descriptive link text
- Alt text for images
- Form labels associated with inputs

---

## Logo Usage

### Available Logos

| Logo | Filename | Usage |
|------|----------|-------|
| Light Mode Logo | `Pristine Data Footer Logo.svg` | Use on light backgrounds |
| Dark Mode Logo | `Pristine Data AI Logo.svg` | Use on dark backgrounds |

### Size Guidelines

| Context | Height |
|---------|--------|
| Navigation | 32px |
| Footer | 28px |
| Central feature | 40px |

### Clear Space

- Maintain minimum clear space equal to the height of the "P" in Pristine around the logo
- Don't crowd with other elements

### Don'ts

- Don't distort or stretch
- Don't change colors
- Don't add effects (shadows, outlines)
- Don't place on busy backgrounds without sufficient contrast
- Don't use the light logo on dark backgrounds (and vice versa)

---

## Design Checklist

Before handing off designs, verify:

- [ ] Colors work in both light and dark modes
- [ ] Typography follows the scale
- [ ] Spacing uses defined values
- [ ] Components match specifications
- [ ] Interactive states are defined (hover, focus, active)
- [ ] Responsive behavior is documented
- [ ] Accessibility requirements are met
- [ ] Correct logo variant is used

---

*Last updated: February 2026*
*Version: 1.0*
