# Sidebar Tooltip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add tooltips to sidebar navigation items that appear when the sidebar is collapsed to icon-only mode.

**Architecture:** Refactor `nav-main.tsx` to use shadcn/ui's `SidebarMenuButton` and `SidebarMenuSubButton` components which have built-in tooltip support. The tooltip automatically shows/hides based on collapse state.

**Tech Stack:** Next.js 16, React 19, shadcn/ui sidebar components, TypeScript

---

## File Structure

**Single file modification:**

- Modify: `apps/web/features/backoffice/components/nav-main.tsx`

The change is focused on a single file because:

1. The sidebar component infrastructure already exists
2. Tooltip behavior is built into shadcn/ui components
3. Only navigation item rendering needs to be refactored

---

## Task 1: Add SidebarMenuButton and SidebarMenuSubButton Imports

**Files:**

- Modify: `apps/web/features/backoffice/components/nav-main.tsx:1-20`

- [ ] **Step 1: Add missing imports**

Add `SidebarMenuButton` and `SidebarMenuSubButton` to the existing sidebar imports:

```tsx
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuButton, // ADD THIS
  SidebarMenuSubButton, // ADD THIS
} from "@workspace/ui/components/sidebar"
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `pnpm typecheck`
Expected: No errors (components exist in sidebar.tsx)

- [ ] **Step 3: Commit**

```bash
git add apps/web/features/backoffice/components/nav-main.tsx
git commit -m "refactor(sidebar): import SidebarMenuButton and SidebarMenuSubButton

Prepare for tooltip support by importing the necessary components."
```

---

## Task 2: Refactor Simple Nav Items to Use SidebarMenuButton

**Files:**

- Modify: `apps/web/features/backoffice/components/nav-main.tsx:60-101`

- [ ] **Step 1: Replace the simple nav item rendering**

Replace the entire `if (!hasSubItems)` block (lines 60-101) with:

```tsx
if (!hasSubItems) {
  return (
    <SidebarMenuItem
      key={item.title}
      className="menu-item-enter"
      style={
        {
          "--animation-delay": `${index * 50}ms`,
        } as React.CSSProperties
      }
    >
      <SidebarMenuButton tooltip={item.title} isActive={isItemActive} asChild>
        <a href={item.url}>
          <span
            className={cn(
              "inline-flex size-4 shrink-0 items-center justify-center transition-all duration-200 ease-out [&_svg]:size-4",
              isItemActive ? "text-primary-foreground" : "text-sidebar-primary"
            )}
          >
            {item.icon}
          </span>
          <span className="flex h-full min-w-0 flex-1 items-center truncate text-left text-sm leading-none">
            {item.title}
          </span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
```

- [ ] **Step 2: Verify the page renders**

Run: `pnpm dev` and visit http://localhost:3000/backoffice
Expected: Dashboard looks the same, tooltips appear on hover when collapsed

- [ ] **Step 3: Test tooltip behavior**

1. Collapse the sidebar (click the trigger or press Cmd/Ctrl+B)
2. Hover over the Dashboard icon
   Expected: Tooltip showing "Dashboard" appears

- [ ] **Step 4: Commit**

```bash
git add apps/web/features/backoffice/components/nav-main.tsx
git commit -m "feat(sidebar): add tooltips to simple nav items

Use SidebarMenuButton with tooltip prop for items without sub-menus.
Tooltips appear on hover when sidebar is collapsed."
```

---

## Task 3: Refactor Parent Nav Items to Use SidebarMenuButton

**Files:**

- Modify: `apps/web/features/backoffice/components/nav-main.tsx:104-160`

- [ ] **Step 1: Replace the CollapsibleTrigger button with SidebarMenuButton**

Replace the `<CollapsibleTrigger asChild>` section (lines 119-159) with:

```tsx
<CollapsibleTrigger asChild>
  <SidebarMenuButton tooltip={item.title} isActive={isItemActive}>
    <span
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center transition-all duration-200 ease-out [&_svg]:size-4",
        isItemActive ? "text-primary-foreground" : "text-sidebar-primary"
      )}
    >
      {item.icon}
    </span>
    <span className="flex h-full min-w-0 flex-1 items-center truncate text-left text-sm leading-none">
      {item.title}
    </span>
    <span
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center transition-all duration-300 ease-out [&_svg]:size-4",
        "text-muted-foreground",
        isItemActive && "text-primary-foreground/80",
        "group-data-[state=open]/collapsible:rotate-90"
      )}
    >
      <ChevronRightIcon />
    </span>
  </SidebarMenuButton>
</CollapsibleTrigger>
```

Note: `SidebarMenuButton` handles the button element internally when `asChild` is not used.

- [ ] **Step 2: Verify parent items still work**

1. Refresh the page
2. Collapse the sidebar
3. Hover over Users, Products, Orders, Settings icons
   Expected: Tooltips appear showing the parent title

- [ ] **Step 3: Test expand/collapse still works**

1. Expand the sidebar
2. Click on "Users" to expand sub-menu
3. Click again to collapse
   Expected: Sub-menu expands/collapses as before

- [ ] **Step 4: Commit**

```bash
git add apps/web/features/backoffice/components/nav-main.tsx
git commit -m "feat(sidebar): add tooltips to parent nav items

Use SidebarMenuButton for items with sub-menus.
Tooltips show parent title when sidebar is collapsed."
```

---

## Task 4: Refactor Sub-menu Items to Use SidebarMenuSubButton

**Files:**

- Modify: `apps/web/features/backoffice/components/nav-main.tsx:167-191`

- [ ] **Step 1: Replace sub-item links with SidebarMenuSubButton**

Replace the `<a>` element inside `SidebarMenuSubItem` (lines 176-191) with:

```tsx
<SidebarMenuSubItem
  key={subItem.title}
  className="sub-item-enter"
  style={
    {
      "--animation-delay": `${subIndex * 40}ms`,
    } as React.CSSProperties
  }
>
  <SidebarMenuSubButton
    tooltip={`${item.title} → ${subItem.title}`}
    isActive={subItemActive}
    asChild
  >
    <a href={subItem.url}>
      <span className="transition-transform duration-200 group-hover/sublink:scale-105">
        {subItem.title}
      </span>
    </a>
  </SidebarMenuSubButton>
</SidebarMenuSubItem>
```

- [ ] **Step 2: Test sub-item tooltips**

1. Refresh the page
2. Expand the "Users" menu
3. Collapse the sidebar (sub-menu should now be hidden, but tooltip should work)
4. Hover over Users, then try to access sub-items

Note: When sidebar is collapsed, sub-menus are hidden. The tooltip here is for when the sidebar is expanded but you want to see the breadcrumb path.

- [ ] **Step 3: Verify navigation still works**

Click on various sub-items like "Roles", "Activity", etc.
Expected: Navigation works correctly, active states are preserved

- [ ] **Step 4: Commit**

```bash
git add apps/web/features/backoffice/components/nav-main.tsx
git commit -m "feat(sidebar): add tooltips to sub-menu items

Use SidebarMenuSubButton with breadcrumb-style tooltips.
Format: 'Parent → Child' to show navigation hierarchy."
```

---

## Task 5: Remove Unused CSS Classes and Clean Up

**Files:**

- Modify: `apps/web/features/backoffice/components/nav-main.tsx`

- [ ] **Step 1: Remove the now-unused CSS variable type definition**

The inline style for animation delay is still needed, so no changes to the style props.

However, since `SidebarMenuButton` handles its own styling, verify that the custom CSS classes from the old implementation are no longer needed.

Check the file and ensure all `group-data-[collapsible=icon]:` classes that were manually applied are now handled by the component.

- [ ] **Step 2: Final visual test**

Run this checklist:

- [ ] Sidebar expanded: No tooltips, full labels visible
- [ ] Sidebar collapsed: Tooltips on hover for all items
- [ ] Dashboard tooltip shows "Dashboard"
- [ ] Users tooltip shows "Users"
- [ ] Roles (when visible) tooltip shows "Users → Roles"
- [ ] Active items maintain their highlight color
- [ ] Hover animations still work smoothly
- [ ] Keyboard navigation (Tab, Enter) works
- [ ] Collapse/expand keyboard shortcut (Cmd/Ctrl+B) works

- [ ] **Step 3: Final commit**

```bash
git add apps/web/features/backoffice/components/nav-main.tsx
git commit -m "refactor(sidebar): clean up unused CSS after tooltip refactor

Remove manual styling classes now handled by SidebarMenuButton component."
```

---

## Task 6: Manual Testing Checklist

**Files:**

- Test: `apps/web/app/(backoffice)/dashboard/page.tsx`

- [ ] **Step 1: Test all tooltip behaviors**

Go through the full testing checklist:

| Test                                    | Expected Result               | Status |
| --------------------------------------- | ----------------------------- | ------ |
| Tooltip appears on hover when collapsed | Shows label to right of icon  | [ ]    |
| Tooltip hidden when sidebar expanded    | No tooltip on hover           | [ ]    |
| Dashboard tooltip content               | "Dashboard"                   | [ ]    |
| Users tooltip content                   | "Users"                       | [ ]    |
| Products tooltip content                | "Products"                    | [ ]    |
| Orders tooltip content                  | "Orders"                      | [ ]    |
| Settings tooltip content                | "Settings"                    | [ ]    |
| Active state highlighting (expanded)    | Background colored            | [ ]    |
| Active state highlighting (collapsed)   | Icon background colored       | [ ]    |
| Navigate to different page              | State persists, tooltips work | [ ]    |
| Collapse state persists                 | Remembered after page reload  | [ ]    |
| Mobile view                             | No tooltips (uses sheet)      | [ ]    |
| Dark mode                               | Tooltips adapt to theme       | [ ]    |

- [ ] **Step 2: Test keyboard navigation**

1. Tab through navigation items
2. Press Enter on selected items
3. Use Cmd/Ctrl+B to toggle sidebar

Expected: All keyboard interactions work, screen reader announces tooltips

- [ ] **Step 3: Verify type checking**

Run: `pnpm typecheck`
Expected: No TypeScript errors

- [ ] **Step 4: Verify linting**

Run: `pnpm lint`
Expected: No ESLint errors

- [ ] **Step 5: Tag the commit**

```bash
git tag -a v-sidebar-tooltips -m "Add sidebar tooltip feature"
git push origin v-sidebar-tooltips
```

---

## Summary of Changes

**Before:** Navigation items used raw `<a>` and `<button>` elements with manual CSS classes for styling and collapse behavior.

**After:** Navigation items use `SidebarMenuButton` and `SidebarMenuSubButton` components from shadcn/ui, which provide:

- Built-in tooltip support (automatically shows/hides based on collapse state)
- Consistent styling with the sidebar theme
- Better accessibility out of the box

**Files Modified:** 1 file

- `apps/web/features/backoffice/components/nav-main.tsx`

**Lines Changed:** ~150 lines refactored across 3 main sections (simple items, parent items, sub-items)
