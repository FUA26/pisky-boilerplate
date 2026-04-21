# Sidebar Tooltip Feature Design Spec

**Date:** 2025-04-21
**Status:** Approved
**Related Issue:** N/A

## Overview

Add tooltips to navigation items that appear when the sidebar is in collapsed (icon-only) mode. Uses shadcn/ui's built-in `SidebarMenuButton` `tooltip` prop for automatic show/hide behavior.

## Goals

- Improve usability when sidebar is collapsed to icon-only mode
- Show item labels on hover via tooltips
- Maintain existing collapse state persistence across page navigations
- Follow shadcn/ui patterns and use built-in component features

## Current State Analysis

The sidebar already:

- Uses shadcn/ui's `collapsible="icon"` mode
- Persists state via cookies (`sidebar_state`, 7-day max age)
- Hides labels when collapsed via `group-data-[collapsible=icon]:hidden` CSS
- Has `SidebarMenuButton` component with built-in `tooltip` prop support

What's missing:

- Tooltips are not currently implemented in `nav-main.tsx`
- Users can't see item labels in collapsed mode without expanding

## Behavior Specifications

### Expanded State

| Aspect   | Behavior                   |
| -------- | -------------------------- |
| Tooltips | Hidden                     |
| Labels   | Fully visible              |
| Hover    | Normal hover effects apply |

### Collapsed State

| Aspect   | Behavior                           |
| -------- | ---------------------------------- |
| Tooltips | Visible on hover, positioned right |
| Labels   | Hidden (only icons visible)        |
| Hover    | Tooltip appears with item title    |

### Navigation Behavior

- Collapse state persists across page navigations via cookies
- Active state highlighting works in both expanded and collapsed modes
- Clicking nav items navigates normally
- Sub-menu expand/collapse state resets when sidebar collapses

## Tooltip Content Strategy

### Simple Navigation Items

```
Item: Dashboard
Tooltip: "Dashboard"
```

### Parent Items with Sub-menus

```
Item: Users (with Roles, Activity sub-items)
Tooltip: "Users"
```

### Sub-menu Items

```
Item: Roles (under Users)
Tooltip: "Users → Roles"
```

This hierarchy helps users understand where they are in the navigation structure.

## Implementation Design

### Component Changes

**File:** `apps/web/features/backoffice/components/nav-main.tsx`

**Changes:**

1. Refactor from using raw `<a>` and `<button>` elements to using `<SidebarMenuButton>`
2. Add `tooltip` prop to each button
3. For sub-items, include parent title in tooltip
4. Maintain all existing styling via CSS classes

### Before (Current Pattern)

```tsx
<a
  href={item.url}
  className={cn(
    "group/link gap-3... relative flex h-9 items-center"
    // ... existing classes
  )}
>
  <span className="shrink-0... inline-flex size-4">{item.icon}</span>
  <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
</a>
```

### After (With Tooltip)

```tsx
<SidebarMenuButton tooltip={item.title} isActive={isItemActive} asChild>
  <a href={item.url}>
    <span className="shrink-0... inline-flex size-4">{item.icon}</span>
    <span>{item.title}</span>
  </a>
</SidebarMenuButton>
```

### Sub-menu Item Pattern

```tsx
<SidebarMenuSubButton
  tooltip={`${parentTitle} → ${subItem.title}`}
  isActive={subItemActive}
  asChild
>
  <a href={subItem.url}>
    <span>{subItem.title}</span>
  </a>
</SidebarMenuSubButton>
```

## Technical Specifications

### Tooltip Component

Uses existing shadcn/ui components:

- `Tooltip` from `@workspace/ui/components/tooltip`
- `TooltipContent` for tooltip content
- `TooltipTrigger` for trigger element

### Props

```typescript
interface SidebarMenuButtonProps {
  tooltip?: string | TooltipContentProps
  isActive?: boolean
  asChild?: boolean
  // ... other props
}
```

### Styling

| Element   | Specification            |
| --------- | ------------------------ |
| Position  | Right of sidebar icon    |
| Alignment | Center with icon         |
| Animation | Fade-in (default shadcn) |
| Theme     | Respects light/dark mode |
| Z-index   | Above other content      |

### Responsive Behavior

| Breakpoint        | Behavior                               |
| ----------------- | -------------------------------------- |
| Mobile (< 768px)  | Tooltips disabled (sidebar uses sheet) |
| Desktop (≥ 768px) | Tooltips enabled when collapsed        |

## Accessibility

- Tooltips announced to screen readers
- Keyboard navigation: Tab, Enter, Arrow keys
- Collapse/expand via keyboard shortcut: Cmd/Ctrl + B
- ARIA labels: "Expand/Collapse {title} menu"
- Focus indicators maintained

## Edge Cases

| Case              | Handling                                                      |
| ----------------- | ------------------------------------------------------------- |
| Long titles       | Tooltip text wraps if needed                                  |
| Active items      | Tooltip still shows on active items                           |
| Touch devices     | Hover tooltips don't appear, but labels visible when expanded |
| Very deep nesting | Tooltip shows "Grandparent → Parent → Child"                  |

## File Structure

```
apps/web/features/backoffice/components/
└── nav-main.tsx    # UPDATE: Refactor to use SidebarMenuButton with tooltip
```

## Testing Checklist

- [ ] Tooltip appears on hover when sidebar is collapsed
- [ ] Tooltip hidden when sidebar is expanded
- [ ] Tooltip content is correct for each item type
- [ ] Sub-menu tooltips show parent → child format
- [ ] Active state highlighting works in both modes
- [ ] Keyboard navigation works (Tab, Enter, Arrows)
- [ ] Collapse state persists across page navigation
- [ ] Mobile: no tooltips (sheet behavior)
- [ ] Theme switching: tooltips adapt to light/dark
- [ ] All navigation links work correctly

## Future Enhancements (Out of Scope)

- Configurable tooltip position (left/right/top/bottom)
- Custom tooltip content/components
- Delay before tooltip appears
- Tooltip for custom actions/badges
- Keyboard shortcut to show all tooltips at once

## Implementation Notes

1. Use `SidebarMenuButton` from shadcn/ui - it has built-in tooltip support
2. The tooltip automatically hides when `state !== "collapsed"` or on mobile
3. Maintain all existing CSS classes for styling consistency
4. The `asChild` prop allows using our own `<a>` element while getting tooltip behavior
5. No additional dependencies required - uses existing shadcn components
