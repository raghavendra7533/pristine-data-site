# Pristine Data AI - Design System Documentation

> A comprehensive guide for designers and frontend developers working on the Pristine Data AI website.

---

## Table of Contents

1. [Brand Overview](#brand-overview)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Visual Effects](#visual-effects)
7. [Iconography](#iconography)
8. [Responsive Design](#responsive-design)
9. [Accessibility](#accessibility)
10. [Code Patterns](#code-patterns)

---

## Brand Overview

### Brand Personality

| Trait | Expression |
|-------|------------|
| **Trustworthy** | Verification badges, accuracy metrics, clean design |
| **Intelligent** | AI-powered messaging, natural language interface |
| **Premium** | Dark mode polish, attention to detail, subtle animations |
| **Efficient** | Streamlined workflows, "all-in-one" positioning |
| **Modern** | Contemporary typography, glassmorphism, dark theme |
| **Confident** | Bold statistics, direct comparisons, strong CTAs |

### Design Philosophy

1. **Data-Driven Authority** - Emphasize scale and accuracy through prominent statistics
2. **Simplicity Through Sophistication** - Clean interfaces that convey powerful capabilities
3. **Professional Minimalism** - Restrained palette, generous whitespace, subtle effects
4. **Technology Forward** - AI imagery, real-time validation, modern interactions

---

## Color System

### CSS Custom Properties (Tailwind)

```javascript
// tailwind.config.js
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#152033',
          950: '#020617',
        },
        brand: {
          red: '#F43F5E',
        }
      }
    }
  }
}
```

### Light Mode Palette

| Role | Tailwind Class | Hex Code | Usage |
|------|----------------|----------|-------|
| Background Primary | `bg-white` | `#FFFFFF` | Page background |
| Background Secondary | `bg-slate-50` | `#F8FAFC` | Cards, inputs, sections |
| Background Tertiary | `bg-slate-100` | `#F1F5F9` | Hover states, toggles |
| Text Primary | `text-slate-950` | `#020617` | Headlines |
| Text Secondary | `text-slate-700` | `#334155` | Body text |
| Text Muted | `text-slate-500` | `#64748B` | Labels, captions |
| Border | `border-slate-200` | `#E2E8F0` | Dividers, card borders |

### Dark Mode Palette

| Role | Tailwind Class | Hex Code | Usage |
|------|----------------|----------|-------|
| Background Primary | `dark:bg-slate-950` | `#020617` | Page background |
| Background Secondary | `dark:bg-slate-900` | `#0F172A` | Cards, sections |
| Background Tertiary | `dark:bg-slate-800` | `#1E293B` | Hover states |
| Text Primary | `dark:text-white` | `#FFFFFF` | Headlines |
| Text Secondary | `dark:text-slate-400` | `#94A3B8` | Body text |
| Text Muted | `dark:text-slate-500` | `#64748B` | Labels |
| Border | `dark:border-slate-800` | `#1E293B` | Dividers |

### Semantic/Accent Colors

| Purpose | Color | Tailwind | Hex | Usage |
|---------|-------|----------|-----|-------|
| Primary Action | Indigo | `indigo-500/600` | `#6366F1` | Focus states, AI features, links |
| Success | Emerald | `emerald-400/500` | `#10B981` | Verification, positive states |
| Warning/Input | Amber | `amber-400/600` | `#F59E0B` | Input sources, alerts |
| Info | Blue | `blue-400/600` | `#3B82F6` | Secondary features |
| Brand/Error | Rose | `brand-red` | `#F43F5E` | Live indicators, errors |

### Gradient Patterns

```css
/* Hero background fade */
bg-gradient-to-b from-transparent via-white/50 to-white
dark:via-slate-950/50 dark:to-slate-950

/* Impact numbers */
bg-gradient-to-r from-indigo-400 to-cyan-300

/* Pristine Way section glow */
bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500

/* Card backgrounds */
bg-gradient-to-b from-slate-800 to-slate-900
```

---

## Typography

### Font Stack

```css
font-family: 'Manrope', sans-serif;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

**Load via Google Fonts:**
```html
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Type Scale

| Element | Size | Weight | Tracking | Line Height | Classes |
|---------|------|--------|----------|-------------|---------|
| H1 Hero | 4xl → 6xl | 600 | -0.05em | 1.15 | `text-4xl md:text-6xl font-semibold tracking-tighter leading-[1.15]` |
| H2 Section | 3xl → 4xl | 600 | -0.025em | default | `text-3xl md:text-4xl font-semibold tracking-tight` |
| H3 Card | lg (18px) | 600 | default | default | `text-lg font-semibold` |
| Body Large | base → lg | 500 | default | relaxed | `text-base md:text-lg font-medium leading-relaxed` |
| Body | sm → base | 400 | default | relaxed | `text-sm leading-relaxed` |
| Label | 10-12px | 700 | 0.1em | default | `text-[10px] font-bold uppercase tracking-widest` |
| Button | xs (12px) | 600 | default | default | `text-xs font-semibold` |
| Mono/Data | sm | 400 | default | default | `text-sm font-mono` |

### Typography Examples

```html
<!-- H1 Hero -->
<h1 class="text-4xl md:text-6xl font-semibold text-slate-950 dark:text-white tracking-tighter leading-[1.15]">
  Your Entire Revenue Stack.
</h1>

<!-- Section Header -->
<h2 class="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight mb-4">
  The Intelligence Engine
</h2>

<!-- Body Text -->
<p class="text-base md:text-lg text-slate-700 dark:text-slate-400 leading-relaxed">
  Description text here...
</p>

<!-- Label/Badge -->
<span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">
  Label Text
</span>
```

---

## Spacing & Layout

### Container Widths

| Context | Max Width | Class |
|---------|-----------|-------|
| Navigation | 1280px | `max-w-7xl` |
| Content Sections | 1152px | `max-w-6xl` |
| Comparison Table | 1024px | `max-w-5xl` |
| Hero Content | 896px | `max-w-4xl` |
| Search Input | 672px | `max-w-2xl` |

### Spacing Scale

| Purpose | Size | Class |
|---------|------|-------|
| Component gaps | 12px | `gap-3` |
| Standard gap | 16px | `gap-4` |
| Section inner gap | 24px | `gap-6` |
| Large gap | 48px | `gap-12` |
| Section gap | 64px | `gap-16` |
| Horizontal padding | 24px | `px-6` |
| Section vertical | 96px | `py-24` |
| Card padding | 32px | `p-8` |
| Form field gap | 20px | `gap-5` |

### Grid Patterns

```html
<!-- Two Column Feature Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">

<!-- Contact Page Layout -->
<div class="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

<!-- Stats Grid -->
<div class="grid grid-cols-2 gap-8">
```

### Background Grid Pattern

```css
.grid-bg {
  background-image:
    linear-gradient(to right, #f1f5f9 1px, transparent 1px),
    linear-gradient(to bottom, #f1f5f9 1px, transparent 1px);
  background-size: 24px 24px;
}

.dark .grid-bg {
  background-image:
    linear-gradient(to right, #1e293b 1px, transparent 1px),
    linear-gradient(to bottom, #1e293b 1px, transparent 1px);
}
```

---

## Components

### Navigation

```html
<nav class="fixed w-full z-50 transition-all duration-300 top-0 glass-nav bg-white/80 dark:bg-slate-950/80">
  <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    <!-- Logo -->
    <a href="#" class="flex items-center group">
      <img src="assets/Pristine Data Footer Logo.svg" class="h-8 dark:hidden">
      <img src="assets/Pristine Data AI Logo.svg" class="h-8 hidden dark:block">
    </a>

    <!-- Nav Links -->
    <div class="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
      <a href="#" class="hover:text-slate-900 dark:hover:text-white transition-colors">Link</a>
    </div>

    <!-- CTA -->
    <a href="#" class="px-3.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-lg">
      Book a Demo
    </a>
  </div>
</nav>
```

**Glass Effect:**
```css
.glass-nav {
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
}
.dark .glass-nav {
  border-bottom: 1px solid rgba(30, 41, 59, 0.6);
}
```

### Buttons

#### Primary Button
```html
<button class="px-8 py-3 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-xl shadow-lg shadow-slate-900/20 dark:shadow-none transition-all hover:scale-[1.02] flex items-center gap-2">
  Button Text
  <iconify-icon icon="solar:arrow-right-linear" width="18"></iconify-icon>
</button>
```

#### Small Button
```html
<button class="px-3.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-lg transition-all shadow-sm">
  Small Button
</button>
```

#### Button States
```css
/* Hover */
hover:bg-slate-800 dark:hover:bg-slate-200
hover:translate-y-px

/* Active */
active:translate-y-0.5

/* With shadow */
shadow-lg shadow-slate-900/10 dark:shadow-none
```

### Form Controls

#### Text Input
```html
<input type="text"
  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
  placeholder="Placeholder text">
```

#### Select Dropdown
```html
<div class="relative">
  <select class="w-full appearance-none bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none cursor-pointer">
    <option>Option 1</option>
    <option>Option 2</option>
  </select>
  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
    <iconify-icon icon="solar:alt-arrow-down-linear" width="16"></iconify-icon>
  </div>
</div>
```

#### Textarea
```html
<textarea rows="4"
  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none resize-none"
  placeholder="Message..."></textarea>
```

#### Form Label
```html
<label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
  Label Text
</label>
```

### Cards

#### Feature Card
```html
<div class="bg-white dark:bg-slate-950 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
  <!-- Icon Container -->
  <div class="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
    <iconify-icon icon="solar:magnifer-linear" width="20"></iconify-icon>
  </div>

  <!-- Content -->
  <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-2">Card Title</h3>
  <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    Card description text...
  </p>
</div>
```

#### Glass Card (Dark Section)
```html
<div class="bg-slate-900/60 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-8 shadow-2xl ring-1 ring-white/10">
  <!-- Content -->
</div>
```

### Badges

#### Status Badge
```html
<div class="inline-flex px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
  <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
    Status Text
  </span>
</div>
```

#### Tag Badge
```html
<span class="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wide">
  Tag Text
</span>
```

### Tables

```html
<div class="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <th class="p-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Feature</th>
        <th class="p-6 bg-slate-50 dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800">
          <span class="font-bold text-slate-800 dark:text-white">Highlighted</span>
        </th>
        <th class="p-6 text-sm font-semibold text-slate-400">Other</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
      <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
        <td class="p-6 text-sm font-medium text-slate-700 dark:text-slate-300">Row Label</td>
        <td class="p-6 bg-slate-50 dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <iconify-icon icon="solar:check-circle-bold" width="18"></iconify-icon>
            Value
          </div>
        </td>
        <td class="p-6 text-sm text-slate-500">Other value</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Visual Effects

### Shadows

| Type | Class | Usage |
|------|-------|-------|
| Subtle | `shadow-sm` | Buttons, small cards |
| Standard | `shadow-lg` | Primary CTAs |
| Elevated | `shadow-2xl` | Floating elements |
| Colored | `shadow-slate-900/10` | Branded shadows |
| Glow | Custom | Special emphasis |

```css
/* Custom glow shadow */
box-shadow: 0 0 40px -10px rgba(37, 99, 235, 0.1);

/* Indigo glow */
shadow-[0_0_20px_rgba(99,102,241,0.3)]

/* Emerald glow */
shadow-[0_0_20px_rgba(16,185,129,0.3)]
```

### Blur Effects

```css
/* Navigation glassmorphism */
backdrop-filter: blur(12px);

/* Background decorations */
blur-[80px]

/* Card glass effect */
backdrop-blur-xl
```

### Animations

```css
/* Theme transition (apply to all elements) */
transition-property: background-color, border-color, color, fill, stroke;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
transition-duration: 300ms;

/* Pulse for live indicators */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

/* Ping for attention */
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* Slow pulse for ambient effects */
animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

### 3D Transforms

```css
/* Perspective container */
.perspective-midrange { perspective: 800px !important; }
.transform-style-preserve-3d { transform-style: preserve-3d !important; }

/* Hover rotation */
.rotate-x-5 { --tw-rotate-x: 5deg; }
.rotate-y-5 { --tw-rotate-y: 5deg; }
```

---

## Iconography

### Icon Library

- **Provider:** Iconify
- **Primary Set:** Solar
- **Loading Method:** Web Component

```html
<script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
```

### Icon Usage

| Context | Style | Size | Example |
|---------|-------|------|---------|
| Navigation | Linear | 16px | `<iconify-icon icon="solar:moon-linear" width="16">` |
| Feature Icons | Linear | 20px | `<iconify-icon icon="solar:magnifer-linear" width="20">` |
| Status | Bold | 12-14px | `<iconify-icon icon="solar:check-circle-bold" width="14">` |
| Decorative | Bold | 20-24px | `<iconify-icon icon="solar:database-bold" width="24">` |
| Inline | Linear | 14px | `<iconify-icon icon="solar:arrow-right-linear" width="14">` |

### Common Icons

```html
<!-- Navigation -->
solar:sun-2-linear          <!-- Light mode -->
solar:moon-linear           <!-- Dark mode -->
solar:arrow-right-linear    <!-- CTAs -->

<!-- Features -->
solar:magic-stick-3-linear  <!-- AI/Automation -->
solar:magnifer-linear       <!-- Search -->
solar:shield-check-linear   <!-- Security -->
solar:database-bold         <!-- Data -->

<!-- Status -->
solar:check-circle-bold     <!-- Success -->
solar:close-circle-linear   <!-- Error -->
solar:check-read-linear     <!-- Verified -->

<!-- Categories -->
solar:users-group-rounded-bold  <!-- People -->
solar:buildings-2-linear        <!-- Companies -->
solar:bolt-bold                 <!-- Action -->
```

### Icon Containers

```html
<!-- Standard container -->
<div class="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
  <iconify-icon icon="solar:magnifer-linear" width="20"></iconify-icon>
</div>

<!-- Small container -->
<div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
  <iconify-icon icon="solar:bolt-bold" width="14"></iconify-icon>
</div>

<!-- Circular container -->
<div class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
  <iconify-icon icon="solar:check-circle-bold" width="14"></iconify-icon>
</div>
```

---

## Responsive Design

### Breakpoints

| Name | Width | Usage |
|------|-------|-------|
| sm | 640px | Small tablets |
| md | 768px | Tablets, two-column layouts |
| lg | 1024px | Desktop, full layouts |
| xl | 1280px | Large desktop |

### Mobile-First Patterns

```html
<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

<!-- Responsive text -->
<h1 class="text-4xl md:text-5xl lg:text-6xl">

<!-- Responsive spacing -->
<section class="py-16 md:py-24">

<!-- Show/hide elements -->
<div class="hidden md:flex">  <!-- Desktop only -->
<div class="md:hidden">       <!-- Mobile only -->

<!-- Responsive flex direction -->
<div class="flex flex-col md:flex-row">
```

### Navigation Responsive

```html
<!-- Desktop nav links -->
<div class="hidden md:flex items-center gap-6">

<!-- Mobile: hamburger menu (implement as needed) -->
```

---

## Accessibility

### Implemented

- Semantic HTML (`<nav>`, `<main>`, `<footer>`, `<section>`)
- Form labels with `for` attributes
- `alt` text on images
- Screen reader only text: `class="sr-only"`
- Focus states on interactive elements
- Color contrast (verify with tools)

### Required Additions

```html
<!-- Skip link -->
<a href="#main-content" class="sr-only focus:not-sr-only">
  Skip to main content
</a>

<!-- ARIA labels -->
<button aria-label="Toggle theme">
<nav aria-label="Main navigation">

<!-- Focus visible -->
focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
```

---

## Code Patterns

### Theme Toggle (JavaScript)

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Check system preference on load
  if (localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
       window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }

  toggleButton.addEventListener('click', () => {
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      html.classList.add('dark');
      localStorage.theme = 'dark';
    }
  });
});
```

### Logo with Theme Switch

```html
<a href="#" class="flex items-center group">
  <img src="assets/Pristine Data Footer Logo.svg" alt="Pristine Data AI" class="h-8 dark:hidden">
  <img src="assets/Pristine Data AI Logo.svg" alt="Pristine Data AI" class="h-8 hidden dark:block">
</a>
```

### Section Template

```html
<section class="py-24 bg-white dark:bg-slate-950 relative">
  <!-- Background decoration -->
  <div class="absolute inset-0 grid-bg opacity-30 dark:opacity-10 pointer-events-none"></div>

  <div class="max-w-6xl mx-auto px-6 relative">
    <!-- Section header -->
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight mb-4">
        Section Title
      </h2>
      <p class="text-base md:text-lg text-slate-700 dark:text-slate-400 max-w-xl mx-auto">
        Section description...
      </p>
    </div>

    <!-- Content -->
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Cards/content here -->
    </div>
  </div>
</section>
```

---

## File Structure

```
/
├── index.html              # Homepage
├── contact-us.html         # Contact page
├── DESIGN-SYSTEM.md        # This file
└── assets/
    ├── Pristine Data Footer Logo.svg    # Light mode logo
    └── Pristine Data AI Logo.svg        # Dark mode logo
```

---

## Quick Reference

### Common Class Combinations

```css
/* Card */
bg-white dark:bg-slate-950 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm

/* Primary button */
px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg transition-all

/* Input field */
w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm

/* Section heading */
text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight

/* Body text */
text-base text-slate-700 dark:text-slate-400 leading-relaxed

/* Icon container */
w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center
```

---

*Last updated: February 2026*
*Version: 1.0*
