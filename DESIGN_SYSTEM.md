# Design System Documentation - GHX Apprenticeship

**Version:** 1.0  
**Last Updated:** March 2026  
**Maintainer:** Sangeeth Kumar

---

## Quick Start

This design system provides **55+ pre-built UI components** for AI-assisted development. All components are located in `@/components/ui/` and follow consistent patterns.

### Key Principles
- 🎨 **Use existing components only** - Never create new UI components
- 🔗 **Import from `@/components/ui/`** - Always use the alias
- 🧩 **Compose, don't create** - Combine existing components for complex UIs
- 🌙 **Dark mode ready** - All components support automatic dark mode

---

## Component Inventory

### Layout Components (6)

| Component | Import | Purpose | Key Props |
|-----------|--------|---------|-----------|
| `card` | `@/components/ui/card` | Content container | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` |
| `sheet` | `@/components/ui/sheet` | Slide-out panel | `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription` |
| `sidebar` | `@/components/ui/sidebar` | App navigation | Complex compound component with multiple sub-components |
| `separator` | `@/components/ui/separator` | Visual divider | `orientation`, `decorative` |
| `scroll-area` | `@/components/ui/scroll-area` | Custom scrollbar | None |
| `resizable` | `@/components/ui/resizable` | Draggable panels | `ResizablePanel`, `ResizablePanelGroup`, `ResizableHandle` |

### Form Components (12)

| Component | Import | Purpose | Key Variants/Props |
|-----------|--------|---------|-------------------|
| `button` | `@/components/ui/button` | Action trigger | `variant: default, outline, secondary, ghost, destructive, link` <br> `size: default, xs, sm, lg, icon, icon-xs, icon-sm, icon-lg` |
| `input` | `@/components/ui/input` | Text input | `type`, `placeholder`, `disabled` |
| `textarea` | `@/components/ui/textarea` | Multi-line text | `placeholder`, `disabled`, `rows` |
| `checkbox` | `@/components/ui/checkbox` | Boolean toggle | `checked`, `onCheckedChange` |
| `switch` | `@/components/ui/switch` | Toggle switch | `checked`, `onCheckedChange` |
| `radio-group` | `@/components/ui/radio-group` | Single selection | `RadioGroup`, `RadioGroupItem` |
| `select` | `@/components/ui/select` | Dropdown selection | `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` |
| `slider` | `@/components/ui/slider` | Range input | `value`, `onValueChange`, `min`, `max`, `step` |
| `calendar` | `@/components/ui/calendar` | Date picker | `mode: single, range, multiple` |
| `input-otp` | `@/components/ui/input-otp` | One-time password | `maxLength`, `onComplete` |
| `native-select` | `@/components/ui/native-select` | HTML select | `NativeSelect` |
| `field` | `@/components/ui/field` | Form field wrapper | `Field`, `FieldLabel`, `FieldDescription`, `FieldError` |

### Navigation Components (6)

| Component | Import | Purpose | Key Props |
|-----------|--------|---------|-----------|
| `breadcrumb` | `@/components/ui/breadcrumb` | Page hierarchy | `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator` |
| `navigation-menu` | `@/components/ui/navigation-menu` | Top nav | Complex compound component |
| `tabs` | `@/components/ui/tabs` | Tabbed interface | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` |
| `pagination` | `@/components/ui/pagination` | Page numbers | `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext` |
| `menubar` | `@/components/ui/menubar` | Menu bar | Complex compound component |
| `command` | `@/components/ui/command` | Command palette | `Command`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem` |

### Overlay Components (8)

| Component | Import | Purpose | Key Props |
|-----------|--------|---------|-----------|
| `dialog` | `@/components/ui/dialog` | Modal dialog | `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter` |
| `alert-dialog` | `@/components/ui/alert-dialog` | Confirmation modal | `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogAction`, `AlertDialogCancel` |
| `popover` | `@/components/ui/popover` | Floating content | `Popover`, `PopoverTrigger`, `PopoverContent` |
| `tooltip` | `@/components/ui/tooltip` | Hover hint | `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` |
| `hover-card` | `@/components/ui/hover-card` | Preview on hover | `HoverCard`, `HoverCardTrigger`, `HoverCardContent` |
| `drawer` | `@/components/ui/drawer` | Mobile drawer | `Drawer`, `DrawerTrigger`, `DrawerContent`, `DrawerHeader`, `DrawerTitle`, `DrawerDescription`, `DrawerFooter` |
| `dropdown-menu` | `@/components/ui/dropdown-menu` | Context menu | Complex compound component |
| `context-menu` | `@/components/ui/context-menu` | Right-click menu | Complex compound component |

### Feedback Components (6)

| Component | Import | Purpose | Key Props |
|-----------|--------|---------|-----------|
| `alert` | `@/components/ui/alert` | Status message | `variant: default, destructive` |
| `badge` | `@/components/ui/badge` | Status indicator | `variant: default, secondary, outline, destructive` |
| `progress` | `@/components/ui/progress` | Loading progress | `value`, `max` |
| `skeleton` | `@/components/ui/skeleton` | Loading placeholder | `className` for dimensions |
| `spinner` | `@/components/ui/spinner` | Loading indicator | `className` for size |
| `sonner` | `@/components/ui/sonner` | Toast notifications | `toast.success()`, `toast.error()`, `toast.loading()` |

### Data Display Components (6)

| Component | Import | Purpose | Key Props |
|-----------|--------|---------|-----------|
| `table` | `@/components/ui/table` | Data grid | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`, `TableFooter` |
| `chart` | `@/components/ui/chart` | Data visualization | Built on Recharts |
| `avatar` | `@/components/ui/avatar` | User image | `Avatar`, `AvatarImage`, `AvatarFallback` |
| `accordion` | `@/components/ui/accordion` | Collapsible sections | `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` |
| `collapsible` | `@/components/ui/collapsible` | Show/hide content | `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` |
| `empty` | `@/components/ui/empty` | Empty state | Custom component for empty states |

### Toggle Components (3)

| Component | Import | Purpose | Key Props |
|-----------|--------|---------|-----------|
| `toggle` | `@/components/ui/toggle` | Pressed state button | `variant`, `size`, `pressed`, `onPressedChange` |
| `toggle-group` | `@/components/ui/toggle-group` | Grouped toggles | `type: single, multiple`, `value`, `onValueChange` |
| `button-group` | `@/components/ui/button-group` | Grouped buttons | `ButtonGroup` |

### Utility Components (8)

| Component | Import | Purpose |
|-----------|--------|---------|
| `aspect-ratio` | `@/components/ui/aspect-ratio` | Maintain aspect ratio |
| `carousel` | `@/components/ui/carousel` | Image/content slider |
| `combobox` | `@/components/ui/combobox` | Searchable select |
| `input-group` | `@/components/ui/input-group` | Input with addons |
| `item` | `@/components/ui/item` | Generic item wrapper |
| `kbd` | `@/components/ui/kbd` | Keyboard key display |
| `label` | `@/components/ui/label` | Form label |
| `direction` | `@/components/ui/direction` | RTL support |

---

## Design Tokens

### Colors (CSS Variables)

```css
/* Primary Colors */
--color-primary: oklch(0.488 0.243 264.376)        /* Blue */
--color-primary-foreground: oklch(0.97 0.014 254.604)

/* Secondary Colors */
--color-secondary: oklch(0.967 0.001 286.375)      /* Gray */
--color-secondary-foreground: oklch(0.21 0.006 285.885)

/* Destructive Colors */
--color-destructive: oklch(0.577 0.245 27.325)     /* Red */

/* Neutral Colors */
--color-background: oklch(1 0 0)                   /* White */
--color-foreground: oklch(0.145 0 0)               /* Black */
--color-muted: oklch(0.97 0 0)                     /* Light gray */
--color-muted-foreground: oklch(0.556 0 0)         /* Medium gray */
--color-border: oklch(0.922 0 0)                   /* Border */
--color-input: oklch(0.922 0 0)                    /* Input border */
--color-ring: oklch(0.708 0 0)                     /* Focus ring */

/* Chart Colors */
--color-chart-1: oklch(0.87 0 0)
--color-chart-2: oklch(0.556 0 0)
--color-chart-3: oklch(0.439 0 0)
--color-chart-4: oklch(0.371 0 0)
--color-chart-5: oklch(0.269 0 0)

/* Dark Mode - Auto-applied via .dark class */
--color-background: oklch(0.145 0 0)               /* Dark background */
--color-foreground: oklch(0.985 0 0)               /* Light text */
```

### Typography

**Font Family:**
- Primary: `Geist Sans` (system fallback: sans-serif)
- Monospace: `Geist Mono`

**Scale:**
- `text-xs`: 0.75rem (12px)
- `text-sm`: 0.875rem (14px)
- `text-base`: 1rem (16px) - default
- `text-lg`: 1.125rem (18px)
- `text-xl`: 1.25rem (20px)
- `text-2xl`: 1.5rem (24px)
- `text-3xl`: 1.875rem (30px)
- `text-4xl`: 2.25rem (36px)

### Spacing (Tailwind)

```
1 = 0.25rem (4px)
2 = 0.5rem (8px)
3 = 0.75rem (12px)
4 = 1rem (16px)
6 = 1.5rem (24px)
8 = 2rem (32px)
10 = 2.5rem (40px)
12 = 3rem (48px)
16 = 4rem (64px)
```

### Border Radius

```css
--radius-sm: calc(var(--radius) * 0.6)     /* 0.375rem */
--radius-md: calc(var(--radius) * 0.8)     /* 0.5rem */
--radius-lg: var(--radius)                 /* 0.625rem */
--radius-xl: calc(var(--radius) * 1.4)     /* 0.875rem */
--radius-2xl: calc(var(--radius) * 1.8)    /* 1.125rem */
```

---

## Common Patterns

### Login Form
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Login</CardTitle>
    <CardDescription>Enter your credentials</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="name@example.com" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="password">Password</Label>
      <Input id="password" type="password" />
    </div>
  </CardContent>
  <CardFooter>
    <Button className="w-full">Sign In</Button>
  </CardFooter>
</Card>
```

### Data Table with Actions
```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="w-[50px]"></TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map(user => (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>
          <Badge variant={user.active ? "default" : "secondary"}>
            {user.active ? "Active" : "Inactive"}
          </Badge>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Confirmation Dialog
```tsx
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete Account</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
        Continue
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Toast Notifications
```tsx
import { toast } from "@/components/ui/sonner"

// Success
toast.success("Profile updated successfully")

// Error
toast.error("Failed to save changes")

// Loading
toast.loading("Uploading file...")

// Promise
toast.promise(saveData(), {
  loading: "Saving...",
  success: "Saved successfully",
  error: "Failed to save"
})
```

---

## Icons

**Always use Lucide icons:**
```tsx
import { IconName } from "lucide-react"

// Common icons
import { Check, X, ChevronDown, ChevronRight, Menu, Search, User, Settings } from "lucide-react"
```

**Icon sizing:**
```tsx
// Always use size-* classes
<IconName className="size-4" />  // 16px
<IconName className="size-5" />  // 20px
<IconName className="size-6" />  // 24px
```

---

## Component Modification Rules

### ✅ Allowed Modifications:
- Custom `className` props for positioning/spacing
- Composing components together
- Extending with wrapper components in your feature folders
- Using design tokens (CSS variables)

### ❌ Forbidden Modifications:
- Modifying component source files in `@/components/ui/`
- Changing component APIs or prop types
- Removing built-in accessibility features
- Adding new variants without approval

---

## Missing Components?

**DO NOT create new components in `@/components/ui/`!**

Instead:
1. **Check if composable:** Can you build it from existing components?
2. **Check shadcn registries:** Run `npx shadcn search @shadcn` to see if it exists
3. **Request it:** Ask Sangeeth to add it to the design system

---

## File Structure Best Practices

```
my-app/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── (routes)/                # Route groups
│       └── dashboard/
│           └── page.tsx
├── components/
│   └── ui/                      # ✅ Design system components ONLY
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
├── components/                  # Feature-specific components (if needed)
│   └── dashboard/
│       └── user-stats.tsx       # ✅ Can use @/components/ui/* here
├── lib/
│   └── utils.ts                 # cn() helper
├── hooks/
│   └── use-mobile.ts            # Custom hooks
└── public/                      # Static assets
```

---

## Resources

- **Components:** `/components/ui/` (55+ components)
- **Colors:** `app/globals.css` (CSS variables)
- **Icons:** [Lucide React](https://lucide.dev/icons/)
- **Base UI:** [@base-ui/react](https://base-ui.com/react/overview)
- **shadcn/ui:** [Documentation](https://ui.shadcn.com/)

---

## Quick Reference Card

```tsx
// Imports you need
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { toast } from "@/components/ui/sonner"

// Colors to use
className="bg-primary text-primary-foreground"      // Primary action
className="bg-secondary text-secondary-foreground"  // Secondary
className="bg-destructive text-destructive-foreground" // Danger/Delete
className="text-muted-foreground"                   // Subtle text
className="border-border"                           // Borders

// Spacing
className="p-4 gap-4 space-y-4"  // Common patterns
className="w-full max-w-md"      // Container widths
className="h-screen"             // Full height

// Typography
className="text-sm font-medium"  // Labels
className="text-lg font-semibold" // Subheadings
className="text-2xl font-bold"    // Headings
```

---

**Maintained by:** Sangeeth Kumar  
**Questions?** Refer to AGENTS.md for AI-specific instructions
