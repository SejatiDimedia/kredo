# DESIGN.md — Kredo Design System Spec

> **Brand:** Kredo (Enterprise Accounting Platform — General Ledger Core)  
> **Tagline:** *"Setiap entri, seimbang."* ("Every entry, in balance.")  
> **Visual Reference:** Modern Fintech / Precision Ledger UI (Teal & Slate aesthetic)  
> **Filter Standard:** antislop (Strict compliance with Craftsmanship Standards C-1 through C-5)

---

## 1. Identity & Personality

Kredo is built for professional accounting staff, senior reviewers (approvers), and controllers. It is:
- **Calm, deliberate, and trustworthy**: No noisy decorative fluff, no gratuitous gradients or floating blobs.
- **Data-dense and keyboard-first**: Compact table rows, high contrast, tabular numeric alignment (`tabular-nums`), clear active focus states.
- **Strictly honest**: Debit = Credit balance is always mathematically validated; numbers have clear provenance.

### Dials (Antislop R-37)
- **ENERGY:** 2 (Structured, professional, crisp contrast with a signature deep teal accent)
- **RHYTHM:** 2 (Clean vertical cadence, clear sectioning, structured table rows and metrics)
- **MOTION:** 1 (Subtle functional feedback only: dialog transitions, accordion expansion, toast entry. Respects `prefers-reduced-motion`)

---

## 2. Color Palette & Semantic Tokens

Extracted from the reference design:

| Role | Hex | OKLCH Value | Purpose |
|---|---|---|---|
| **Primary (Deep Teal)** | `#0D6276` | `oklch(0.46 0.079 219.1)` | Brand identity, primary CTAs, active ledger markers, hero cards |
| **Primary Foreground** | `#FFFFFF` | `oklch(0.985 0 0)` | High-contrast text on primary teal (contrast 6.4:1, WCAG AA pass) |
| **Primary Hover** | `#0A4D5D` | `oklch(0.39 0.067 219.1)` | Hover state for primary buttons |
| **Surface (Background)** | `#F8FAFC` | `oklch(0.984 0.003 247.9)` | Cool crisp accounting canvas, non-glare |
| **Panel / Card** | `#FFFFFF` | `oklch(1.0 0.0 89.9)` | Elevated card surfaces, ledger sheets, data tables |
| **Ink (Foreground)** | `#0F172A` | `oklch(0.208 0.04 265.8)` | Headings, primary account codes, critical numbers |
| **Muted Text** | `#64748B` | `oklch(0.554 0.041 257.4)` | Subtitles, field labels, metadata, secondary account descriptions |
| **Border / Rule** | `#E2E8F0` | `oklch(0.929 0.013 255.5)` | Table gridlines, card borders, separators |
| **Accent (Mint/Teal)** | `#14B8A6` | `oklch(0.704 0.123 182.5)` | Positive mutations, balanced indicators, chart curves |
| **Destructive** | `#E11D48` | `oklch(0.586 0.222 17.6)` | Error states, unbalanced alerts, rejection actions |
| **Warning / Caution** | `#D97706` | `oklch(0.666 0.157 58.3)` | Draft pending status, period closing warnings |
| **Success** | `#059669` | `oklch(0.596 0.127 163.2)` | Posted confirmation, reconciled indicators |

---

## 3. Typography & Financial Numerics

- **Font Family**: Geist Variable / Sans-serif fallback (`'Geist Variable', -apple-system, sans-serif`).
- **Tabular Figures**: Every currency, amount, sequence number, and date must use `font-variant-numeric: tabular-nums` (Tailwind `tabular-nums`) to ensure vertical column alignment across thousands of ledger rows.
- **Scale**:
  - Display / Hero metrics: 28px–32px, font-bold
  - Page Titles: 20px–24px, font-semibold
  - Section Headings: 16px–18px, font-semibold
  - Table / Body Text: 13px–14px, font-normal
  - Microcopy & Badges: 11px–12px, font-medium, uppercase tracking-wider where semantic

---

## 4. Radii & Elevation

- **Base Radius (`--radius`)**: `0.625rem` (10px) for cards and modals.
- **Controls**: `0.5rem` (8px) for inputs and buttons.
- **Pills/Badges**: `9999px` strictly for status badges (`Draft`, `Submitted`, `Approved`, `Posted`).
- **Elevation**: Flat with subtle 1px border (`border-border`) by default; floating elevation (`shadow-sm` / `shadow-md`) reserved only for dropdowns, popovers, and sticky balance bars.

---

## 5. Signature Component: Balance Bar (PRD 14.7)

The pinned bottom status bar for journal entry and ledger reconciliation:
- **Balanced State**: Soft teal/mint accent (`#E6F7F5`), quiet badge `"Balanced"`, submit button active.
- **Unbalanced State**: Soft rose warning tint, clear delta indicator (`"Out of balance by Rp 50.000,00"`), quick-action button `"Add balancing line"`, submit button disabled with explanation.
