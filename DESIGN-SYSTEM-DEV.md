# Pristine Data AI - Developer Guide

> Technical implementation reference for frontend developers building the Pristine Data AI website.

---

## Table of Contents

1. [Setup & Dependencies](#setup--dependencies)
2. [Tailwind Configuration](#tailwind-configuration)
3. [Color Classes](#color-classes)
4. [Typography Classes](#typography-classes)
5. [Components](#components)
6. [Visual Effects](#visual-effects)
7. [Icons](#icons)
8. [Theme Toggle](#theme-toggle)
9. [Templates](#templates)
10. [Quick Reference](#quick-reference)

---

## Setup & Dependencies

### Required CDN Links

```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Google Fonts - Manrope -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">

<!-- Iconify -->
<script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
```

### Base Body Classes

```html
<body class="bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-400 overflow-x-hidden selection:bg-rose-100 selection:text-rose-900 dark:selection:bg-indigo-900 dark:selection:text-white">
```

---

## Tailwind Configuration

```javascript
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
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

### Custom CSS Classes

```css
/* Glass navigation effect */
.glass-nav {
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
}
.dark .glass-nav {
  border-bottom: 1px solid rgba(30, 41, 59, 0.6);
}

/* Background grid patterns */
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

.grid-bg-dark {
  background-image:
    linear-gradient(to right, #1e293b 1px, transparent 1px),
    linear-gradient(to bottom, #1e293b 1px, transparent 1px);
  background-size: 24px 24px;
}

/* 3D Transform utilities */
.perspective-midrange { perspective: 800px !important; }
.transform-style-preserve-3d { transform-style: preserve-3d !important; }
.rotate-x-5 { --tw-rotate-x: 5deg; }
.rotate-y-5 { --tw-rotate-y: 5deg; }

/* Theme transition on all elements */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
```

---

## Color Classes

### Light Mode

| Purpose | Class |
|---------|-------|
| Page background | `bg-white` |
| Card/Section background | `bg-slate-50` |
| Hover background | `bg-slate-100` |
| Primary text | `text-slate-950` |
| Body text | `text-slate-700` |
| Muted text | `text-slate-500` |
| Border | `border-slate-200` |

### Dark Mode

| Purpose | Class |
|---------|-------|
| Page background | `dark:bg-slate-950` |
| Card/Section background | `dark:bg-slate-900` |
| Hover background | `dark:bg-slate-800` |
| Primary text | `dark:text-white` |
| Body text | `dark:text-slate-400` |
| Muted text | `dark:text-slate-500` |
| Border | `dark:border-slate-800` |

### Accent Colors

| Purpose | Light Class | Dark Class |
|---------|-------------|------------|
| Primary (Indigo) | `text-indigo-600`, `bg-indigo-500` | `dark:text-indigo-400`, `dark:bg-indigo-900/20` |
| Success (Emerald) | `text-emerald-600`, `bg-emerald-500` | `dark:text-emerald-400` |
| Warning (Amber) | `text-amber-600` | `dark:text-amber-400` |
| Info (Blue) | `text-blue-600` | `dark:text-blue-400` |
| Brand (Rose) | `text-brand-red` | `text-brand-red` |

### Gradients

```html
<!-- Hero fade -->
<div class="bg-gradient-to-b from-transparent via-white/50 to-white dark:via-slate-950/50 dark:to-slate-950"></div>

<!-- Impact numbers -->
<span class="bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent"></span>

<!-- Pristine Way glow -->
<div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

<!-- Dark card background -->
<div class="bg-gradient-to-b from-slate-800 to-slate-900"></div>
```

---

## Typography Classes

| Element | Classes |
|---------|---------|
| H1 Hero | `text-4xl md:text-6xl font-semibold text-slate-950 dark:text-white tracking-tighter leading-[1.15]` |
| H2 Section | `text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight` |
| H3 Card | `text-lg font-semibold text-slate-800 dark:text-white` |
| Body Large | `text-base md:text-lg text-slate-700 dark:text-slate-400 leading-relaxed` |
| Body | `text-sm text-slate-600 dark:text-slate-400 leading-relaxed` |
| Label | `text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400` |
| Button | `text-xs font-semibold` |
| Mono | `text-sm font-mono` |

---

## Components

### Navigation

```html
<nav class="fixed w-full z-50 transition-all duration-300 top-0 glass-nav bg-white/80 dark:bg-slate-950/80">
  <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    <!-- Logo with theme switch -->
    <a href="#" class="flex items-center group">
      <img src="assets/Pristine Data Footer Logo.svg" alt="Pristine Data AI" class="h-8 dark:hidden">
      <img src="assets/Pristine Data AI Logo.svg" alt="Pristine Data AI" class="h-8 hidden dark:block">
    </a>

    <!-- Nav Links -->
    <div class="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
      <a href="#" class="hover:text-slate-900 dark:hover:text-white transition-colors">Link</a>
    </div>

    <!-- Theme Toggle + CTA -->
    <div class="flex items-center gap-3">
      <button id="theme-toggle" class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
        <iconify-icon icon="solar:sun-2-linear" width="18" class="dark:hidden"></iconify-icon>
        <iconify-icon icon="solar:moon-linear" width="18" class="hidden dark:inline-block"></iconify-icon>
      </button>
      <a href="contact-us.html" class="px-3.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-lg transition-all shadow-sm hover:bg-slate-800 dark:hover:bg-slate-200">
        Book a Demo
      </a>
    </div>
  </div>
</nav>
```

### Primary Button

```html
<button class="px-8 py-3 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-xl shadow-lg shadow-slate-900/20 dark:shadow-none transition-all hover:scale-[1.02] flex items-center gap-2">
  Button Text
  <iconify-icon icon="solar:arrow-right-linear" width="18"></iconify-icon>
</button>
```

### Small Button

```html
<button class="px-3.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-lg transition-all shadow-sm hover:bg-slate-800 dark:hover:bg-slate-200">
  Small Button
</button>
```

### Text Input

```html
<label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Label</label>
<input type="text"
  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
  placeholder="Placeholder">
```

### Input with Icon

```html
<div class="relative">
  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
    <iconify-icon icon="solar:letter-linear" width="18"></iconify-icon>
  </div>
  <input type="email"
    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-3 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
    placeholder="email@company.com">
</div>
```

### Select Dropdown

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

### Textarea

```html
<textarea rows="4"
  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none resize-none"
  placeholder="Message..."></textarea>
```

### Feature Card

```html
<div class="bg-white dark:bg-slate-950 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
  <!-- Icon -->
  <div class="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
    <iconify-icon icon="solar:magnifer-linear" width="20"></iconify-icon>
  </div>
  <!-- Content -->
  <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-2">Title</h3>
  <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Description...</p>
</div>
```

### Glass Card (Dark Sections)

```html
<div class="bg-slate-900/60 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-8 shadow-2xl ring-1 ring-white/10">
  <!-- Content -->
</div>
```

### Status Badge

```html
<div class="inline-flex px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
  <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
    Status Text
  </span>
</div>
```

### Tag Badge

```html
<span class="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wide">
  Tag
</span>
```

### Comparison Table

```html
<div class="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <th class="p-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Feature</th>
        <th class="p-6 bg-slate-50 dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800">
          <span class="font-bold text-slate-800 dark:text-white">Pristine Data</span>
        </th>
        <th class="p-6 text-sm font-semibold text-slate-400">Others</th>
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

```html
<!-- Subtle -->
<div class="shadow-sm"></div>

<!-- Standard -->
<div class="shadow-lg"></div>

<!-- Elevated -->
<div class="shadow-2xl"></div>

<!-- Colored -->
<div class="shadow-lg shadow-slate-900/10 dark:shadow-none"></div>

<!-- Glow effects -->
<div class="shadow-[0_0_20px_rgba(99,102,241,0.3)]"></div>  <!-- Indigo -->
<div class="shadow-[0_0_20px_rgba(16,185,129,0.3)]"></div>  <!-- Emerald -->
```

### Blur Effects

```html
<!-- Navigation glass -->
<nav class="backdrop-filter: blur(12px)"></nav>

<!-- Decorative blur -->
<div class="blur-[80px]"></div>

<!-- Card glass -->
<div class="backdrop-blur-xl"></div>
```

### Animations

```html
<!-- Pulse (live indicators) -->
<span class="animate-pulse"></span>

<!-- Slow ambient pulse -->
<div class="animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>

<!-- Hover scale -->
<button class="hover:scale-[1.02] transition-transform"></button>

<!-- Hover translate -->
<button class="hover:translate-y-px active:translate-y-0.5 transition-transform"></button>
```

---

## Icons

### Usage

```html
<iconify-icon icon="solar:icon-name" width="18"></iconify-icon>
```

### Common Icons

| Purpose | Icon Name |
|---------|-----------|
| Light mode | `solar:sun-2-linear` |
| Dark mode | `solar:moon-linear` |
| Arrow right | `solar:arrow-right-linear` |
| Search | `solar:magnifer-linear` |
| AI/Magic | `solar:magic-stick-3-linear` |
| Security | `solar:shield-check-linear` |
| Database | `solar:database-bold` |
| Success | `solar:check-circle-bold` |
| Error | `solar:close-circle-linear` |
| Verified | `solar:check-read-linear` |
| People | `solar:users-group-rounded-bold` |
| Companies | `solar:buildings-2-linear` |
| Lightning | `solar:bolt-bold` |
| Email | `solar:letter-linear` |
| Globe | `solar:global-linear` |
| Dropdown | `solar:alt-arrow-down-linear` |

### Icon Container

```html
<!-- Standard (40px) -->
<div class="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
  <iconify-icon icon="solar:magnifer-linear" width="20"></iconify-icon>
</div>

<!-- Small (32px) -->
<div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
  <iconify-icon icon="solar:bolt-bold" width="14"></iconify-icon>
</div>

<!-- Circular -->
<div class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
  <iconify-icon icon="solar:check-circle-bold" width="14"></iconify-icon>
</div>
```

---

## Theme Toggle

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

---

## Templates

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

    <!-- Content grid -->
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Cards here -->
    </div>
  </div>
</section>
```

### Dark Section Template

```html
<section class="overflow-hidden text-white bg-slate-900 dark:bg-slate-900/50 py-24 relative border-t border-b border-transparent dark:border-slate-800">
  <div class="absolute inset-0 grid-bg-dark opacity-20 pointer-events-none"></div>
  <div class="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-slate-900 dark:from-slate-950 to-transparent pointer-events-none"></div>
  <div class="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-slate-900 dark:from-slate-950 to-transparent pointer-events-none"></div>

  <div class="max-w-6xl mx-auto px-6 relative">
    <!-- Content -->
  </div>
</section>
```

### Footer Template

```html
<footer class="bg-white dark:bg-slate-950 py-12 border-t border-slate-200 dark:border-slate-800">
  <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
    <div class="flex items-center">
      <img src="assets/Pristine Data Footer Logo.svg" alt="Pristine Data AI" class="h-7 dark:hidden">
      <img src="assets/Pristine Data AI Logo.svg" alt="Pristine Data AI" class="h-7 hidden dark:block">
    </div>
    <div class="flex gap-8 text-xs font-semibold text-slate-500 dark:text-slate-400">
      <a href="#" class="hover:text-slate-700 dark:hover:text-slate-200">Link</a>
    </div>
  </div>
</footer>
```

---

## Quick Reference

### Container Widths

| Class | Width | Usage |
|-------|-------|-------|
| `max-w-7xl` | 1280px | Navigation |
| `max-w-6xl` | 1152px | Content sections |
| `max-w-5xl` | 1024px | Tables |
| `max-w-4xl` | 896px | Hero content |
| `max-w-2xl` | 672px | Search input |

### Spacing

| Class | Size | Usage |
|-------|------|-------|
| `gap-3` | 12px | Component gaps |
| `gap-4` | 16px | Standard gap |
| `gap-6` | 24px | Section inner gap |
| `gap-12` | 48px | Large gap |
| `px-6` | 24px | Horizontal padding |
| `py-24` | 96px | Section vertical |
| `p-8` | 32px | Card padding |

### Border Radius

| Class | Usage |
|-------|-------|
| `rounded-lg` | Buttons, inputs |
| `rounded-xl` | Large buttons |
| `rounded-2xl` | Cards, sections |
| `rounded-full` | Badges, avatars |

### Breakpoints

| Prefix | Min Width |
|--------|-----------|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |

---

## File Structure

```
/
├── index.html                    # Homepage
├── contact-us.html               # Contact page
├── DESIGN-SYSTEM-DEV.md          # This file (Developer guide)
├── DESIGN-SYSTEM-DESIGNER.md     # Designer guide
└── assets/
    ├── Pristine Data Footer Logo.svg    # Light mode logo
    └── Pristine Data AI Logo.svg        # Dark mode logo
```

---

*Last updated: February 2026*
*Version: 1.0*
