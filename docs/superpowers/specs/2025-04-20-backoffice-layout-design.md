# Backoffice Layout Design Spec

**Date:** 2025-04-20
**Status:** Approved
**Related Issue:** N/A

## Overview

A modern dashboard layout refresh that adapts the reference design aesthetic while preserving existing navigation structure. Features an adaptive theme-aware sidebar, enhanced header with search/notifications, and a comprehensive dashboard with stats, charts, and activity tracking.

## Goals

- Modernize the backoffice layout visual design
- Add search and notification functionality to the header
- Create a dashboard page with stats cards, activity chart, and recent activity table
- Maintain full theme adaptability (light/dark mode)
- Keep existing navigation structure intact

## Navigation Structure

**Preserving current navigation items:**

- **Overview** → Dashboard, Analytics, Reports
- **Users** → All Users, Roles & Permissions, Activity Log
- **Products** → Catalog, Inventory, Categories
- **Orders** → All Orders, Pending, Fulfilled
- **Content** → Pages, Blog, Media Library
- **Marketing** → Campaigns, SEO, Social Media
- **Support** → Tickets, Knowledge Base
- **Settings** → General, Billing, Integrations, API

## Component Architecture

### 1. Sidebar (`backoffice-sidebar.tsx`)

**Changes:** Styling adjustments only, no structural changes

**Appearance:**

- Uses CSS variables for theme adaptability
- Rounded corners on navigation items (8px)
- Subtle hover states with alpha background
- Clear active state indicators using `--primary` color
- Smooth transitions for collapse/expand

**CSS Variables Used:**

- `--sidebar-background`
- `--sidebar-foreground`
- `--sidebar-border`
- `--sidebar-primary`
- `--sidebar-primary-foreground`
- `--sidebar-accent`
- `--sidebar-accent-foreground`

### 2. Header (in `layout.tsx`)

**New Elements Added:**

#### Search Input (`header-search.tsx`)

- Text input with search icon on left
- Placeholder: "Search..."
- Rounded pill shape with soft corners
- Focus state with border highlight
- Responsive: Full width on mobile, fixed width on desktop

#### Notification Bell (`header-notifications.tsx`)

- Bell icon from lucide-react
- Red badge dot when notifications exist (count > 0)
- Click toggles dropdown menu
- Dropdown contains 3-4 mock notification items
- Each item: title, description, time, "mark as read" action

#### User Profile (`header-nav-user.tsx` - existing)

- Keep existing functionality
- Avatar with dropdown menu

**Header Layout:**

```
[Sidebar Trigger] [Separator] [Breadcrumb] ... [Search] [Notifications] [User Profile]
```

### 3. Dashboard Page (`dashboard/page.tsx`)

**New Components Created:**

#### Stats Cards (`stat-card.tsx`)

- 4 cards in a responsive grid
- Each card contains:
  - Icon (colored, muted background)
  - Metric value (large, weight 510)
  - Label (small, muted)
  - Trend indicator (arrow + percentage, green/red)

**Card Data (mock values):**

- Total Users → 2,543, +12% from last month
- Total Orders → 1,234, +8% from last month
- Revenue → $45,678, +23% from last month
- Active Products → 156, +5% from last month

#### Activity Chart (`activity-chart.tsx`)

- Visual representation of activity over time
- Title: "Activity Overview"
- Time period selector: 7 days, 30 days, 90 days (buttons)
- Implementation: Start with simple CSS bar chart, upgrade to charting library later

#### Recent Activity Table (`recent-activity.tsx`)

- Table with columns: Type, Description, Date, Status
- 5-10 rows of mock activity data
- Status badges: Completed (green), Pending (yellow), Failed (red)
- Empty state: "No recent activity"

**Dashboard Layout:**

```
[Stats Cards Row (4 columns)]
[Activity Chart Section]
[Recent Activity Table]
```

## File Structure

```
apps/web/
├── app/(backoffice)/
│   ├── layout.tsx                    # UPDATE: Add search, notifications to header
│   └── dashboard/
│       └── page.tsx                  # NEW: Dashboard with stats, chart, table
│
├── features/backoffice/
│   ├── components/
│   │   ├── backoffice-sidebar.tsx    # UPDATE: Styling adjustments
│   │   ├── header-nav-user.tsx       # KEEP: Existing user dropdown
│   │   ├── header-search.tsx         # NEW: Search input component
│   │   ├── header-notifications.tsx  # NEW: Bell + dropdown component
│   │   ├── stat-card.tsx             # NEW: Stats card component
│   │   ├── activity-chart.tsx        # NEW: Activity chart component
│   │   └── recent-activity.tsx       # NEW: Recent activity table
│   │   ├── nav-main.tsx              # UPDATE: Styling adjustments
│   │   └── workspace-switcher.tsx    # KEEP: Existing functionality
```

## Styling Specifications

### Colors (via CSS variables)

**Sidebar:**

- Background: `--sidebar-background` / `--background`
- Foreground: `--sidebar-foreground` / `--foreground`
- Border: `--sidebar-border` / `--border`
- Primary: `--sidebar-primary` / `--primary`
- Accent: `--sidebar-accent` / `--accent`

**Active States:**

- Background: `--primary` with 10-15% opacity
- Foreground: `--primary-foreground`

**Hover States:**

- Background: `--accent` with 50% opacity
- Transition: 150ms ease-in-out

### Spacing

| Element                   | Value        |
| ------------------------- | ------------ |
| Header height             | 64px (h-16)  |
| Sidebar width (expanded)  | 260px        |
| Sidebar width (collapsed) | 64px         |
| Content padding           | 24px (p-6)   |
| Section gap               | 32px (gap-8) |
| Card padding              | 20px (p-5)   |
| Card gap                  | 16px (gap-4) |

### Typography

| Element       | Size                 | Weight |
| ------------- | -------------------- | ------ |
| Stats value   | text-2xl or text-3xl | 510    |
| Stats label   | text-sm              | 400    |
| Section title | text-lg              | 510    |
| Table header  | text-sm              | 500    |
| Table cell    | text-sm              | 400    |

### Border Radius

| Element       | Value         |
| ------------- | ------------- |
| Nav items     | 8px           |
| Cards         | 12px          |
| Search input  | 9999px (pill) |
| Buttons       | 8px           |
| Status badges | 9999px (pill) |

## Responsive Behavior

### Mobile (< 768px)

- Sidebar: Collapsed to icon-only by default
- Search: Icon that expands to full-width input on click
- Stats: 1 column grid
- Chart: Full width, simplified view
- Table: Horizontal scroll or card view

### Tablet (768px - 1024px)

- Sidebar: Collapsed to icon-only
- Stats: 2x2 grid
- Header: Adjusted spacing

### Desktop (> 1024px)

- Sidebar: Full width with labels
- Stats: 4 column grid
- Full header elements visible

## Data Structures (for future implementation)

### Stat Card Props

```typescript
interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: number // percentage
    period: string // "from last month"
  }
}
```

### Notification Item

```typescript
interface NotificationItem {
  id: string
  title: string
  description: string
  time: string // "2 hours ago"
  read: boolean
}
```

### Activity Item

```typescript
interface ActivityItem {
  id: string
  type: string // "Order", "User", "Product", etc.
  description: string
  date: string
  status: "completed" | "pending" | "failed"
}
```

## Mock Data

### Notifications (static)

1. New user registration - "John Doe signed up 2 hours ago"
2. Order placed - "Order #1234 awaiting processing"
3. System update - "Maintenance scheduled for tonight"
4. Product alert - "Low stock: Widget X (3 remaining)"

### Recent Activity (static)

1. Order - "#1234 placed by Jane Smith" - Today - Completed
2. User - "New user: Mike Johnson" - Today - Completed
3. Product - "Widget Y updated" - Yesterday - Completed
4. Order - "#1233 shipped" - Yesterday - Completed
5. Support - "Ticket #567 resolved" - 2 days ago - Completed

## Error Handling

- Empty states for all data-driven components
- Loading states with skeleton components
- Error boundaries for component failures
- Graceful degradation for missing data

## Testing Checklist

- [ ] Sidebar collapse/expand animation
- [ ] Theme switching (light/dark mode)
- [ ] Responsive breakpoints (mobile, tablet, desktop)
- [ ] Search input focus states
- [ ] Notification dropdown toggle
- [ ] User profile dropdown
- [ ] Stats card hover states
- [ ] Table horizontal scroll on mobile
- [ ] All navigation links work correctly

## Future Enhancements (out of scope for initial implementation)

- Real-time notifications
- Actual chart library integration (Recharts, Chart.js)
- Real data integration for stats and activity
- Advanced search with filters
- Notification preferences/settings
- Customizable dashboard layout

## Implementation Notes

1. Use existing shadcn/ui components where possible (Button, Input, Dropdown, Badge, etc.)
2. Maintain consistency with current codebase patterns
3. Use lucide-react for all icons
4. Follow existing theme system conventions
5. Ensure all new components are properly typed with TypeScript
