# SBM-ThreatForge — UI/UX & Theme Enhancement Plan

> Baseline: client-approved `src/pages/Landingpage/Landingpage.jsx` + `LoginForm`.
> Palette: **electric-violet** (50 `#f5f3ff` → 950 `#2e1065`; primary `#7c3aed`, accent `#8b5cf6`, glow `#a855f7`).

## 1. Design Audit — Current State vs. Approved Baseline

| Area | Approved Landing Page | Current App Shell | Gap |
|------|----------------------|-------------------|-----|
| Color accent | Electric-violet | Cloudscape ✅ wired; `LoginForm.css` still blue (`#667eea`, `#8a7aff`) | ❌ Login off-palette |
| Fonts | Geist / Geist Mono / Avenue Mono | Partially loaded | ⚠️ Confirm global stack |
| Backgrounds | Dark `#1D1D20` / Light `#F5F5F4` + navy-violet gradients | Solid tokens | ❌ Dashboard flat vs. hero |
| Surfaces | 16px radius, layered shadows, `overflow: hidden` | Mixed radii | ⚠️ Inconsistent |
| Typography | Thin weights (200–400), uppercase tracking, `clamp()` | Standard weights | ❌ Dashboard heavy |
| Texture | Diagonal lines, radial highlights, low-opacity grids | None | ❌ App flat |
| Motion | Accent-bar reveals, hover feedback | Partial (sidebar ✅) | ⚠️ Needs system |

**Conclusion:** Foundation is solid (tokens + Cloudscape already violet). Work = propagate the approved hero aesthetic into the app shell, dashboard, agent chat, threat-modeling surfaces, and fix off-palette stragglers.

## 2. Phase 0 — Foundation (do first)

### 2.1 Consolidate the token source of truth
Three coexisting layers (`design-tokens.css`, `theme.css`, `globals.css`) + Cloudscape `customTheme.jsx`. Define the violet ramp once and reference everywhere. Map into both shadcn/Radix token layer and Cloudscape.

### 2.2 Typography scale (match approved hero)
- Load Geist + Geist Mono globally; Avenue Mono only on hero.
- Fluid `clamp()` scale, thin weights, uppercase tracked labels (0.08em).

### 2.3 Surface & elevation system
- Card radius 16px (`--radius-lg`), inner 8px (`--radius-md`).
- 3 shadow tiers (sm/md/lg).
- Reusable texture utilities: `.bg-grid`, `.bg-diagonal-lines`, `.bg-radial-highlight`, `.bg-navy-gradient`.

### 2.4 Motion tokens
`--transition-fast/normal/slow` + global `prefers-reduced-motion`.

## 3. Component Enhancement (Phase 1+)

### 3.1 Authentication — 🔴 Priority
Swap `LoginForm.css`/`SignupForm` blue → violet ramp. Keep approved structure. Add violet focus-rings.

### 3.2 App Shell / Sidebar — 🟡 Polish
Thin-weight tracked brand lockup, violet glow on active item, premium expand easing.

### 3.3 Top Bar / Header
Floating (`top-4`), border + `shadow-sm` + `backdrop-blur`; smooth theme-toggle crossfade.

### 3.4 Dashboard / Overview — 🔴 Priority
Navy-gradient header band + radial glow + grid overlay. Stat cards: 16px radius, layered shadow, thin violet top-accent bar, thin-weight large numbers, uppercase muted labels. Hover via color/border/shadow (NO scale).

### 3.5 Agent Chat — 🟡 Priority
Violet user bubbles / surface assistant bubbles (16px, single squared tail). Floating backdrop-blur composer, violet focus ring. Violet skeleton shimmer. Streaming token fade-in.

### 3.6 Threat Modeling (reactflow) — 🟢 Medium
Custom nodes (16px radius, violet left-border). Selected = violet ring + glow. Violet edges, animated dash on active flows. Canvas `.bg-grid`. Restyle minimap/controls.

### 3.7 Data Tables (Cloudscape)
Uppercase tracked headers. Verify primary action uses violet primary, not Cloudscape blue.

### 3.8 Empty States & Loading
Thin-stroke violet lucide icons + airy hero typography. Skeletons with violet shimmer for full-page loads.

## 4. Phase 2 — UX

- Every clickable: `cursor-pointer` + 150–250ms transition; hover via color/border/shadow only (NO scale).
- Focus-visible rings in violet on all interactive elements.
- A11y: contrast ≥4.5:1, never color-only status, reduced-motion respected, `aria-hidden` decorative icons, `aria-label` icon-only buttons.
- Responsive: 320 / 768 / 1024 / 1440; sidebar auto-collapse <1024; no horizontal scroll.
- Micro-motion: route fade + 4px translateY, stat count-up, accent-bar section reveals.

## 5. Dark / Light Theme Consistency

| Token | Light | Dark |
|-------|-------|------|
| Background | `#F5F5F4` | `#1D1D20` |
| Surface | `#FFFFFF` | `#26262B` |
| Border | `violet-200`/`slate-200` | `violet-950/40`/`slate-800` |
| Text primary | `#0F172A` | `#F5F5F4` |
| Text muted | `#475569` | `#A1A1AA` |
| Primary | `violet-600` | `violet-500` |
| Glow | `violet-500/10` | `violet-500/20` |

Light mode glass surfaces MUST use high opacity (`bg-white/80`+). Navy gradient is a dark-mode signature; light mode uses `#F5F5F4` + radial violet glow.

## 6. Implementation Phases & Priority

| Phase | Scope | Priority | Effort |
|-------|-------|----------|--------|
| 0 — Foundation | Tokens, fonts, texture/motion utilities, radius/shadow standardization | 🔴 Blocker | S |
| 1a — Auth fix | `LoginForm`/`SignupForm` blue→violet | 🔴 High | S |
| 1b — Dashboard | Header band + stat cards + empty states | 🔴 High | M |
| 2a — App shell | Sidebar polish, floating top bar, toggle motion | 🟡 Medium | M |
| 2b — Agent chat | Bubbles, composer, skeletons, streaming | 🟡 Medium | M |
| 2c — Threat modeling | Custom nodes/edges, canvas grid, minimap | 🟢 Medium | M |
| 3 — Tables/Cloudscape | Header label styling, button color audit | 🟢 Low | S |
| 4 — UX pass | Cursor/focus/hover, a11y, responsiveness, micro-motion | 🟡 Medium | M |
| 5 — QA & polish | Both themes × 4 breakpoints, reduced-motion, checklist | 🔴 Required | S |

**Order:** 0 → 1a → 1b → 2a → 2b → 4 → 2c → 3 → 5.

## 7. Pre-Delivery Checklist (per surface)

- [ ] No emoji icons — lucide, consistent sizing
- [ ] Hover = color/border/shadow only — NO `scale`
- [ ] All clickable elements `cursor-pointer`
- [ ] Focus-visible rings in violet everywhere
- [ ] Light-mode contrast ≥4.5:1; glass `bg-white/80`+
- [ ] Borders visible in both themes
- [ ] Responsive 320/768/1024/1440 — no horizontal scroll
- [ ] `prefers-reduced-motion` respected
- [ ] Decorative icons `aria-hidden`; icon-only buttons labeled
- [ ] No hardcoded blue — all accents from electric-violet ramp
