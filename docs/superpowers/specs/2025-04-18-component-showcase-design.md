# Component Showcase Design

**Date:** 2025-04-18
**Status:** Approved
**Author:** Claude Code

## Overview

A comprehensive component documentation and showcase system for the shadcn/ui components in `@workspace/ui`. The showcase serves as both internal development reference and public documentation, demonstrating the template's component architecture and best practices.

## Goals

1. **Documentation** — Provide complete reference for all installed shadcn components
2. **Best Practices** — Show thoughtful usage patterns, not just all props
3. **Evaluation** — Help developers assess the template's component quality
4. **Inspiration** — Demonstrate how to use components in real scenarios

## Route Structure

```
/components                    — Index page with category navigation
/components/forms              — Form components (button, input, field, form, label)
/components/navigation         — Navigation (breadcrumb, tabs, sidebar, dropdown-menu)
/components/overlays           — Overlays & feedback (sheet, tooltip, sonner, skeleton, collapsible)
/components/data-display       — Data display (card, avatar, separator)
```

## File Structure

```
apps/web/
├── app/
│   └── components/
│       ├── page.tsx                    — Index (category cards with sidebar nav)
│       ├── forms/
│       │   └── page.tsx                — Forms category
│       ├── navigation/
│       │   └── page.tsx                — Navigation category
│       ├── overlays/
│       │   └── page.tsx                — Overlays category
│       └── data-display/
│           └── page.tsx                — Data display category
├── features/
    └── showcase/
        ├── components/
        │   ├── showcase-sidebar.tsx    — Left navigation sidebar
        │   ├── category-card.tsx       — Category overview card
        │   ├── component-preview.tsx   — Live preview wrapper with theme toggle
        │   ├── code-block.tsx          — Syntax-highlighted code display
        │   └── preview-code-tabs.tsx   — Tab switcher (Preview | Code)
        └── lib/
            └── component-data.ts       — Component metadata (titles, descriptions)
```

## Visual Style

**Aesthetic:** Clean documentation style matching shadcn's official docs

**Design Principles:**

- Minimal, neutral color palette with subtle borders
- Generous whitespace and typography hierarchy
- Accent color only on interactive states (hover, active)
- Visual boundaries between preview areas and page content

**Theme:**

- Each preview area has independent light/dark toggle
- Uses existing `ThemeProvider` from app layout
- Preview containers have distinct visual boundary (`border rounded-lg`)

## Page Layouts

### Index Page (`/components`)

**Layout:**

- **Left sidebar** (fixed, collapsible on mobile):
  - "Components" heading
  - Category sections (expandable)
  - Component list under each category
  - Active state highlights current page

- **Main content area:**
  - Hero section: "Components" + description
  - Quick search/filter input
  - Category overview cards

**Mobile:** Hamburger menu for sidebar, full-width content

### Component/Category Pages

**Sections:**

1. **Component Header**

   ```
   ComponentName
   Brief description of the component's purpose and use cases.
   ```

2. **Preview Section**
   - Live preview area with light/dark toggle
   - Component rendered with example props
   - Multiple variants shown side-by-side when applicable

3. **Code Section**
   - Tab switcher: "Preview" | "Code"
   - Syntax-highlighted code block with copy button
   - Shows import statement + usage example

4. **Examples/Variants**
   - Multiple subsections for different use cases
   - Each with its own preview + code
   - Demonstrates best practices and common patterns

5. **API Reference**
   - Props table with name, type, default, description
   - Located at bottom of each component page

## Components by Category

### Forms (5 components)

- **Button** — variants (primary, secondary, destructive, outline, ghost, link), sizes, icons, loading state
- **Input** — default, disabled, with icon, with error state
- **Field** — form field wrapper with label and description
- **Form** — reactive form integration example with validation
- **Label** — standalone and with form association

### Navigation (4 components)

- **Breadcrumb** — default, custom separator, with dropdown
- **Tabs** — default, vertical, with content panels
- **Sidebar** — collapsible, menu items, user profile section
- **Dropdown Menu** — basic trigger, with icons, with separators

### Overlays & Feedback (5 components)

- **Sheet** — side variants (left, right, top, bottom), size variants
- **Tooltip** — basic, with delay, with arrow positioning
- **Sonner** — toast examples (success, error, info, warning)
- **Skeleton** — various shapes (text, card, avatar, circular)
- **Collapsible** — trigger/content with smooth animation

### Data Display (3 components)

- **Card** — default, with header/footer, interactive hover state
- **Avatar** — sizes, with fallback, with status badge
- **Separator** — horizontal and vertical, with label

## Responsive Behavior

| Breakpoint              | Sidebar                       | Content           |
| ----------------------- | ----------------------------- | ----------------- |
| < 768px (mobile)        | Hidden behind hamburger       | Full-width        |
| 768px - 1024px (tablet) | Collapses to icons or overlay | Constrained width |
| > 1024px (desktop)      | Full sidebar, fixed           | Full width        |

## Key Components to Build

### ShowcaseSidebar

- Fixed left sidebar with navigation
- Collapsible on mobile with hamburger trigger
- Highlights active route
- Expandable category sections

### ComponentPreview

- Wraps any component for showcase display
- Provides isolated theme toggle (light/dark)
- Handles preview container styling
- Responsive sizing

### CodeBlock

- Syntax-highlighted TypeScript/TSX code
- Copy-to-clipboard button
- Optional line numbers

### PreviewCodeTabs

- Tab switcher between Preview and Code views
- Maintains state across examples
- Smooth transitions

## Implementation Phases

**Phase 1:** Infrastructure

- Set up route structure
- Build shared showcase components (sidebar, preview wrapper, code block)
- Create component metadata structure

**Phase 2:** Forms Category (reference implementation)

- Implement `/components/forms` page
- Create comprehensive examples for all 5 form components
- Validate pattern and adjust as needed

**Phase 3:** Remaining Categories

- Navigation category
- Overlays & Feedback category
- Data Display category

**Phase 4:** Polish

- Search functionality
- Cross-linking between components
- Performance optimization
- Accessibility validation

## Success Criteria

- All 18 components have documented examples
- Each component shows 3-5 usage examples
- Code examples are copy-paste ready
- Light/dark theme switching works in preview areas
- Mobile responsive
- Page loads quickly (< 2s initial load)
