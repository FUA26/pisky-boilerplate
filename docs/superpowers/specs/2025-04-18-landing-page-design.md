# Zilpo Landing Page Design

**Date:** 2025-04-18
**Status:** Approved
**Approach:** Option A - "Read the Code"

## Overview

A clean, Notion-inspired landing page that showcases Zilpo's codebase and documentation to appeal to enterprise developers who value developer experience and well-documented patterns.

## Target Audience

- **Primary:** Enterprise developers and teams building internal tools and SaaS products
- **Secondary:** Startup teams who need production-ready foundations

## Design Philosophy

**"Read the Code" Approach**

Enterprise developers trust code, not marketing. The landing page shows the actual codebase, architecture patterns, and documentation rather than making claims without proof.

**Visual Style:**

- Clean and minimal like Notion
- Generous whitespace
- Code snippets and previews as primary visual elements
- No gradients or flashy design elements
- Focus on readability and clarity

## Page Structure

### Section 1: Hero

**Layout:** Centered, minimal

**Content:**

```
Headline: Skip boilerplate. Ship features. Scale confidently.

Subtext: (none - let the headline stand alone)

Terminal Preview:
$ npx create-zilpo my-app
✓ Cloned template
✓ Installed dependencies
✓ Dev server running

Ready to ship at localhost:3000

CTAs: [Get Started] [Read the Docs]
```

**Design Notes:**

- Large, lightweight headline (Inter 510)
- Terminal-style code block with realistic output
- Two buttons: primary filled, secondary outline
- Background: white/light gray

### Section 2: "See How It Works" - Code Walk-through

**Layout:** Split view - code panel on left, explanation on right

**Content:** Interactive tabs showing architectural patterns:

1. **Feature Structure** - Monorepo organization
2. **Auth Flow** - NextAuth.js v5 implementation
3. **API Patterns** - Server actions and route handlers
4. **Type Safety** - TypeScript strict mode coverage

**Tab Content Example:**

```
Code Panel                    Explanation Panel
─────────────────────────     ──────────────────────────────────────
features/                     Feature-Based Architecture
├── auth/                     Every feature is self-contained:
│   ├── components/           • UI components live with the feature
│   ├── hooks/                • Server actions co-located
│   ├── server-actions.ts     • Clear boundaries, easy to extend
│   └── page.tsx
├── dashboard/                Teams can work on features in parallel
└── shared/                   without conflicts.

                              [See full architecture →]
```

### Section 3: "What's Inside" - Feature Breakdown

**Layout:** 2x3 grid of expandable cards

**Features:**

1. Authentication (NextAuth.js v5, credentials + OAuth)
2. Dashboard (collapsible sidebar, team switching, stats)
3. shadcn/ui (pre-built components, custom theming)
4. Turborepo (monorepo management, build caching)
5. TypeScript (strict mode, full coverage)
6. Tailwind CSS v4 (PostCSS, CSS variables)

**Interaction:** Each card has a "View code" button that expands to show actual implementation code.

**Code Example:**

```typescript
export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        // Your auth logic here
      },
    }),
  ],
}
```

### Section 4: "Documentation Preview"

**Layout:** Two-column - searchable nav on left, doc content on right

**Content:**

- Left: Searchable documentation tree (Quick Start, Features, Architecture)
- Right: Actual documentation page preview with proper formatting
- Shows docs are comprehensive, not an afterthought

**Key Message:** "Your team won't be guessing. Everything is documented."

### Section 5: CTA

**Layout:** Centered, action-focused

**Content:**

```
Headline: Ready to build?

Terminal Block (with copy button):
$ git clone https://github.com/yourorg/zilpo.git
$ cd zilpo && pnpm install
$ pnpm dev

→ Ready to ship at localhost:3000

Buttons: [Copy Commands] [Read the Guide]

One-Click Deploy:
[Deploy to Vercel] [Deploy to Railway]
```

**Design Notes:**

- No email capture - direct to action
- Terminal block has copy functionality
- Deploy buttons for quick start

## Technical Implementation Notes

### Code Snippets

- Use syntax highlighting (Shiki or similar)
- Monospace font (JetBrains Mono or Fira Code)
- Real code from the codebase, not fake examples

### Interactive Elements

- Tab switching for Section 2
- Expandable code blocks for Section 3
- Copy to clipboard for terminal commands
- Optional: Search functionality mockup for Section 4

### Responsive Design

- Mobile-first approach
- Stack split views on smaller screens
- Maintain code readability at all sizes

### Performance

- Static landing page (no heavy JS)
- Lazy-load code examples if needed
- Optimized images/preview iframes

## Next Steps

This design document moves to the implementation planning phase. The writing-plans skill will be invoked to create a detailed implementation plan.

## Design Principles Applied

1. **Code-first aesthetics** - The product IS the code
2. **Functional minimalism** - Whitespace serves readability
3. **Show, don't tell** - Real code, not claims
4. **Enterprise-ready tone** - Serious, capable, approachable
