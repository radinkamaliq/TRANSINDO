# TRANSIT — Design System & UI Guidelines

> **Jabodetabek Mobility Planner**
>
> *Plan your route. Manage your time. Move smarter.*

---

## 1. Design Philosophy

TRANSIT is a responsive mobility platform for workers, students, and the general public in Jabodetabek.

The interface must make a complex transportation system feel **simple, fast to scan, trustworthy, and calm**.

### Core principles

1. **Clarity first** — users should understand where to go and what to do within seconds.
2. **Time-aware** — departure time, arrival time, duration, transfer count, and buffer time are visually important.
3. **Map-supported** — maps support decisions; they must not overwhelm the information.
4. **Urban & professional** — inspired by modern mobility products, not tourism or ticket-booking websites.
5. **Responsive by default** — desktop, tablet, and mobile are first-class experiences.
6. **Accessible** — readable typography, strong contrast, clear status states, and touch-friendly controls.

---

## 2. Brand Identity

### Brand name

**TRANSIT**

### Product descriptor

**Jabodetabek Mobility Planner**

### Brand personality

- Reliable
- Modern
- Efficient
- Helpful
- Urban
- Practical
- Friendly without looking childish

### Visual keywords

`Urban Mobility` · `Navigation` · `Clean Dashboard` · `Public Transit` · `Time Management`

### Avoid

- Excessive futuristic/cyber styling
- Excessive gradients
- Heavy glassmorphism
- Tourist/travel-agency visual language
- Overly decorative illustrations
- Dense interfaces with tiny text

---

## 3. Color System

Use a restrained palette. Blue is the main brand color; green and orange are reserved primarily for system/status communication.

### Core colors

| Token | Hex | Usage |
|---|---|---|
| Primary | `#2563EB` | Main CTA, active states, links, route emphasis |
| Primary Dark | `#1D4ED8` | Hover/pressed primary controls |
| Navy | `#0F172A` | Main headings, dark surfaces, navigation emphasis |
| Background | `#F8FAFC` | Main application background |
| Surface | `#FFFFFF` | Cards, inputs, modals, panels |
| Text | `#111827` | Primary body text |
| Muted | `#64748B` | Secondary text, metadata |
| Border | `#E2E8F0` | Dividers, card borders, input outlines |
| Success | `#16A34A` | On-time, available, completed |
| Warning | `#F59E0B` | Caution, limited time, service attention |
| Danger | `#DC2626` | Errors, disruptions, critical status |

### Color usage rules

- Use **Primary Blue** for the main action and active navigation.
- Use **Navy** for strong headings and important information.
- Use **Success/Warning/Danger** mainly as semantic status colors.
- Do not use every color in a single component.
- Avoid large saturated backgrounds unless used intentionally for hero/banner sections.

### Transport mode accents

Transport categories may have small semantic accents, but these must remain secondary to the main brand system.

Suggested:
- KRL — Indigo/Blue family
- MRT — Cyan/Blue family
- LRT — Violet/Blue family
- Bus — Orange family
- Walking — Green family

Use these accents mainly for icons, chips, route markers, and timelines.

---

## 4. Typography

### Primary font

**Inter**

Use one family consistently across the product.

### Font weights

- 400 — Regular/body
- 500 — Medium/metadata
- 600 — Semibold/buttons
- 700 — Bold/headings

### Type scale

| Role | Desktop | Mobile |
|---|---:|---:|
| Display | 48–56px | 32–36px |
| H1 | 36–44px | 28–32px |
| H2 | 28–32px | 24–28px |
| H3 | 20–24px | 18–20px |
| Body Large | 18px | 16–17px |
| Body | 16px | 15–16px |
| Small | 14px | 13–14px |
| Caption | 12–13px | 12px |

### Typography rules

- Keep paragraph line-height around **1.5–1.7**.
- Headings should be tighter, around **1.15–1.25**.
- Avoid all-caps for long text.
- Use bold weight to establish hierarchy instead of oversized text everywhere.
- Numbers such as arrival time, duration, and fare may use semibold/bold for quick scanning.

---

## 5. Spacing System

Use a consistent 4px base unit.

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80`

### Recommended usage

- 8px — icon/text gap
- 12px — compact internal spacing
- 16px — default component padding
- 24px — card padding / section gaps
- 32px — major component separation
- 48px+ — page section spacing

Avoid arbitrary spacing values unless needed for a specific visual adjustment.

---

## 6. Layout & Grid

### Desktop

- Max content width: **1200–1280px**
- Main horizontal page padding: **32–48px**
- Use 12-column grid where useful.
- Route results and map may use a **4/8** or **5/7** split.
- Keep primary actions near the user's visual focus.

### Tablet

- Reduce outer padding to approximately **24px**.
- Use 6–8 column logic or flexible cards.
- Preserve hierarchy rather than shrinking everything proportionally.

### Mobile

- Page padding: **16px**
- Use 1-column layout by default.
- Group controls vertically.
- Keep primary CTA easily reachable.
- Allow horizontal scrolling for compact category chips when necessary.

---

## 7. Border Radius

Use moderate, consistent rounding.

- Small controls: **8px**
- Inputs/buttons: **10–12px**
- Cards: **14–16px**
- Large feature panels: **20px**

Avoid extreme pill-shaped containers except for status chips and compact filters.

---

## 8. Shadows

Use subtle elevation.

### Level 1
For cards and standard surfaces:

`0 1px 3px rgba(15, 23, 42, 0.08)`

### Level 2
For floating panels, dropdowns, and map overlays:

`0 8px 24px rgba(15, 23, 42, 0.10)`

### Level 3
For major modal/floating UI:

`0 16px 40px rgba(15, 23, 42, 0.14)`

Do not use heavy shadows everywhere.

---

## 9. Buttons

### Primary button

- Background: `#2563EB`
- Text: white
- Radius: 10–12px
- Weight: 600
- Height: approximately 44–48px
- Clear hover and pressed states

Example label:

**Cari Perjalanan**

### Secondary button

- White/surface background
- Border: `#E2E8F0`
- Text: Navy

Example:

**Lihat Detail**

### Ghost button

- Transparent
- Minimal border or no border
- For low-priority actions

### Button rules

- Use one clearly dominant primary action per section.
- Do not use multiple competing primary buttons beside each other.
- On mobile, primary actions should generally be full-width when they trigger the main task.

---

## 10. Form & Search Components

The Journey Planner is the main form of TRANSIT.

### Search structure

Recommended order:

1. From
2. To
3. Arrival/departure preference
4. Time
5. Journey preference
6. Search action

### Input style

- White surface
- 1px border `#E2E8F0`
- Radius 10–12px
- Height approximately 48–52px
- Clear focused state using primary blue
- Icon optional, but never at the expense of label clarity

### Mobile

Stack fields vertically.

### Desktop

Use a horizontal composition where space allows.

---

## 11. Navigation

### Desktop navbar

Recommended:

`Logo · Plan Route · Explore · Map · My Trips · Schedule · Profile`

Keep the primary journey action visible.

### Mobile navigation

Use a bottom navigation bar with 4–5 destinations:

`Home · Explore · Plan · Trips · Profile`

The **Plan** tab should be visually prominent because it is the core task.

### Navigation behavior

- Active item uses Primary Blue.
- Icons should be simple and consistent.
- Do not overload the navbar with every feature.

---

## 12. Home / Hero

The homepage should immediately answer:

> **“Where are you going, and when do you need to arrive?”**

### Hero structure

1. Short value proposition
2. Journey Planner card
3. Optional supporting microcopy
4. Quick transport categories
5. Map/route preview or popular areas

### Recommended copy direction

**Headline:**

> Sampai tepat waktu, tanpa ribet.

**Supporting text:**

> Cari rute transportasi umum Jabodetabek, tentukan target waktu tiba, dan dapatkan rekomendasi perjalanan yang mudah diikuti.

Primary CTA:

**Cari Perjalanan**

---

## 13. Journey Planner

The Journey Planner is the signature component.

### Required inputs

- Origin
- Destination
- Arrival/departure mode
- Target time
- Preference

### Preference chips

- Tercepat
- Termurah
- Minim Transit
- Minim Jalan Kaki
- Paling Nyaman

### “Arrive On Time” result

Show these items prominently:

- Recommended departure time
- Expected arrival time
- Travel duration
- Number of transfers
- Estimated fare
- Safety/buffer time

Example hierarchy:

**Sebaiknya berangkat 06:25**

`Tiba 07:50 · Durasi 1j 25m`

`1 transit · Rp8.500`

**10 menit buffer sebelum jadwal**

The recommendation should feel actionable, not like raw transportation data.

---

## 14. Route Result Cards

Each route card should support rapid comparison.

### Information hierarchy

1. Arrival time
2. Departure time
3. Total duration
4. Transport modes
5. Transfer count
6. Estimated cost
7. Walking time
8. Route status

### Example

```text
TERCEPAT

06:25 → 07:38
1j 13m

🚆 KRL
Bekasi → Manggarai

🚇 MRT
Manggarai → Sudirman

1 transit · Rp8.500

[ Lihat Detail ]
```

Use badges sparingly:

- **Recommended**
- **Fastest**
- **Cheapest**
- **Minimal Transfer**

---

## 15. Route Timeline

For detailed journey information, use a vertical timeline.

Example:

```text
06:25
📍 Bekasi
    │
06:30
🚆 KRL
    │
07:12
🔄 Manggarai
    │
07:20
🚇 MRT
    │
07:38
📍 Sudirman
```

### Timeline rules

- Use clear dots/markers.
- Keep transfer points visually distinct.
- Make each leg expandable when details are necessary.
- Keep the timeline readable on mobile.

---

## 16. Interactive Map

The map is a decision-support component.

### Map should show

- User location
- Origin
- Destination
- Stops/stations
- Selected route
- Optional alternative routes

### Map UI

Use a light map appearance by default to match the main UI.

Overlay panels must use white surfaces with clear hierarchy.

### Map controls

Keep controls minimal:

- Zoom
- Current location
- Layers (optional)

Avoid excessive floating buttons.

---

## 17. Transport Explorer

Users should be able to explore transportation types and operators.

### Transport card

Include:

- Icon
- Name
- Mode
- Service area
- Key line/routes
- Status if relevant

Example:

```text
🚆 KRL Commuter Line
Kereta Komuter
Jabodetabek

[ Lihat Rute ]
```

### Filters

- Kota
- Moda
- Operator
- Route

---

## 18. My Trips

Saved trips should be glanceable.

Example:

```text
❤️ Rumah → Kantor

Bekasi → Sudirman
06:25 → 07:38

[ Mulai Perjalanan ]
```

Allow rename, favorite/unfavorite, and quick reuse.

---

## 19. My Schedule

The Schedule feature supports recurring routines.

### Schedule card

Show:

- Schedule name
- Days
- Destination
- Required arrival time
- Recommended departure time

Example:

```text
KULIAH

Senin–Jumat
Harus tiba 08:00

Berangkat
06:25

[ Lihat Perjalanan ]
```

---

## 20. Dashboard / Statistics

Statistics are supportive content, not the main product.

Use clean metric cards with:

- Large number
- Small label
- Optional trend/status

Avoid decorative charts unless they support a real decision.

---

## 21. Admin UI

Admin interface should be more functional than marketing-oriented.

### Recommended structure

Sidebar:

- Dashboard
- Users
- Operators
- Transport Types
- Routes
- Stations & Stops
- Schedules
- Fares
- Reports

### Admin components

Prioritize:

- Search
- Filters
- Tables
- Status badges
- Pagination
- Clear edit/delete actions
- Confirmation dialogs

---

## 22. Cards

Cards are the primary container for grouped information.

### Card anatomy

- Optional icon/eyebrow
- Heading
- Supporting information
- Main content
- Optional action

### Card rules

- Do not put a card inside another card unless there is a strong hierarchy reason.
- Avoid excessive nesting.
- Use whitespace and typography to separate information before adding borders.

---

## 23. Status System

Use status colors consistently.

### Success

Green + supportive label:

`Tiba tepat waktu`

### Warning

Orange + supportive label:

`Buffer tipis`

### Danger

Red + supportive label:

`Layanan terganggu`

Never communicate meaning using color alone. Pair color with text/icon.

---

## 24. Icons

Recommended icon style:

- Simple
- Rounded or neutral outline
- Consistent stroke width
- Easy to recognize at small sizes

Use a single icon family across the interface.

Recommended libraries:
- Lucide
- Phosphor

Avoid mixing many unrelated icon styles.

---

## 25. Illustrations & Imagery

The product is information-first.

Prefer:

- Clean transport illustrations
- Urban map fragments
- Simple line-based route visuals
- Realistic but neutral transportation photography only where useful

Avoid oversized stock-photo hero sections that push the actual journey planner below the fold.

---

## 26. Motion & Animation

Animations should communicate state, not show off.

### Recommended

- 150–250ms hover/interaction transitions
- Smooth dropdowns
- Subtle card elevation on hover
- Route panel transitions
- Skeleton loading
- Map marker transitions where useful

### Avoid

- Long entrance animations
- Constant motion
- Excessive parallax
- Bouncing elements
- Animation that delays task completion

---

## 27. Responsive Rules

### Breakpoints

Suggested:

- Mobile: `< 768px`
- Tablet: `768px–1023px`
- Desktop: `>= 1024px`

### Mobile priorities

1. Search/Plan
2. Recommended Route
3. Trip detail
4. Map
5. Saved trips
6. Secondary information

### Desktop priorities

Use larger screen space to present:

- Journey Planner
- Route results
- Map
- Filters
- Supporting information

Do not merely shrink desktop components for mobile; redesign the hierarchy where necessary.

---

## 28. Accessibility

Minimum standards:

- Strong text/background contrast
- Visible keyboard focus states
- Buttons and inputs must have labels
- Do not rely only on color
- Touch targets should generally be around **44px or larger**
- Use semantic headings
- Icons should have accessible names when interactive
- Error messages must explain what needs to be fixed

---

## 29. Loading, Empty & Error States

Every important screen needs three non-happy states.

### Loading

Use skeletons or simple loading indicators.

### Empty

Example:

> Belum ada perjalanan tersimpan.

CTA:

**Cari Perjalanan**

### Error

Example:

> Data perjalanan tidak dapat dimuat.

CTA:

**Coba Lagi**

Never show unexplained blank screens.

---

## 30. Do & Don't

### DO

- Keep the journey planner highly visible.
- Prioritize arrival/departure information.
- Use whitespace to reduce cognitive load.
- Make route alternatives easy to compare.
- Design mobile-first interactions carefully.
- Keep the visual system consistent across user and admin surfaces.

### DON'T

- Turn every section into a card.
- Use too many colors.
- Hide important travel information behind many clicks.
- Use tiny text to fit more data.
- Overuse gradients, glass effects, or futuristic visuals.
- Make the map the entire interface.
- Add features that do not help users complete their journey.

---

## 31. Design Tokens Summary

```text
Brand Primary:      #2563EB
Brand Dark:         #0F172A
Background:         #F8FAFC
Surface:            #FFFFFF
Text:               #111827
Muted:              #64748B
Border:             #E2E8F0
Success:            #16A34A
Warning:            #F59E0B
Danger:             #DC2626

Font:               Inter
Base spacing:       4px
Card radius:        14–16px
Input radius:       10–12px
Primary button:     44–48px height
Mobile page pad:    16px
Desktop max width:  1200–1280px
```

---

## 32. Final Visual Direction

TRANSIT should feel like:

> **A modern daily mobility tool for Jabodetabek commuters.**

The visual experience should combine:

**Navigation clarity**  
+ **Transportation information**  
+ **Time management**  
+ **Modern dashboard quality**

The signature visual moment is the **“Arrive On Time”** recommendation:

> **Berangkat 06:25 → Tiba 07:38 → 10 menit buffer**

Everything else in the interface should support this core task.

---

## 33. Implementation Guidance

This design system is intended for:

- React + Vite
- JavaScript
- Responsive Web
- Desktop / Tablet / Mobile

Component architecture should be reusable and consistent.

Recommended component groups:

```text
components/
├── layout/
├── navigation/
├── journey/
├── route/
├── map/
├── transport/
├── schedule/
├── trips/
├── ui/
└── admin/
```

Do not hard-code page-specific styles repeatedly. Build reusable components and design tokens so the product remains visually consistent as features grow.
