<!-- BEGIN:ai-design-system-rules -->

# Design System AI Instructions - GHX Apprenticeship

**⚠️ CRITICAL RULES FOR AI ASSISTANTS ⚠️**

You are working with a curated design system. These rules are NON-NEGOTIABLE.

## 1. COMPONENT USAGE RULES

### ✅ DO:
- Use **ONLY** components from `@/components/ui/` directory
- Import components using: `import { Component } from "@/components/ui/component"`
- Use design tokens from `app/globals.css` (CSS variables)
- Combine existing components to create complex UI patterns
- Use Lucide icons from `lucide-react`

### ❌ NEVER:
- Create new UI components in `@/components/ui/`
- Import third-party UI libraries (no Material-UI, Ant Design, Chakra, etc.)
- Write custom CSS/styled-components for UI elements
- Create duplicate components with different names
- Modify existing component APIs without approval

## 2. AVAILABLE COMPONENTS

**55+ components available in `@/components/ui/`:**

**Layout:** `card`, `sheet`, `sidebar`, `separator`, `scroll-area`, `resizable`
**Forms:** `button`, `input`, `textarea`, `checkbox`, `radio-group`, `select`, `switch`, `slider`, `calendar`, `input-otp`, `native-select`
**Navigation:** `breadcrumb`, `navigation-menu`, `tabs`, `pagination`, `menubar`, `command`
**Overlays:** `dialog`, `alert-dialog`, `popover`, `tooltip`, `hover-card`, `drawer`, `dropdown-menu`, `context-menu`
**Feedback:** `alert`, `badge`, `progress`, `skeleton`, `spinner`, `sonner`
**Data Display:** `table`, `chart`, `avatar`, `accordion`, `collapsible`
**Other:** `toggle`, `toggle-group`, `button-group`, `aspect-ratio`, `carousel`, `combobox`, `empty`, `field`, `input-group`, `item`, `kbd`, `label`

**See full documentation:** [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

## 3. DESIGN PRINCIPLES

**Colors:**
- Use CSS variables: `--color-primary`, `--color-secondary`, `--color-destructive`, `--color-muted`
- Support dark mode automatically (system preference)
- Primary: Blue (#0d6efd), Destructive: Red (#dc2626)

**Typography:**
- Use `font-sans` class (Geist font)
- Heading hierarchy: h1 (2.25rem), h2 (1.875rem), h3 (1.5rem), h4 (1.25rem)

**Spacing:**
- Use Tailwind spacing scale (4px base: 1=4px, 2=8px, 4=16px)
- Container max-widths: sm (640px), md (768px), lg (1024px), xl (1280px)

**Radius:**
- `--radius-md` (0.625rem) for buttons, inputs
- `--radius-lg` for cards, modals
- `--radius-sm` for tags, badges

## 4. COMPONENT VARIANTS

**Buttons:**
```tsx
// Available variants: default, outline, secondary, ghost, destructive, link
// Available sizes: default, xs, sm, lg, icon, icon-xs, icon-sm, icon-lg
<Button variant="outline" size="sm">Click me</Button>
```

**Inputs:**
```tsx
// Use Input primitive or compound Field component
<Input placeholder="Enter text" />
<Field>
  <Label>Email</Label>
  <Input type="email" />
  <Field.Description>We'll never share your email</Field.Description>
</Field>
```

**Icons:**
```tsx
import { IconName } from "lucide-react"
<IconName className="size-4" /> // Always use size-* classes
```

## 5. COMPOSING PATTERNS

**Create complex UI by combining existing components:**

```tsx
// Card with form
<Card>
  <Card.Header>
    <Card.Title>Login</Card.Title>
    <Card.Description>Enter your credentials</Card.Description>
  </Card.Header>
  <Card.Content>
    <Field>
      <Label>Email</Label>
      <Input type="email" />
    </Field>
    <Field>
      <Label>Password</Label>
      <Input type="password" />
    </Field>
  </Card.Content>
  <Card.Footer>
    <Button>Sign In</Button>
  </Card.Footer>
</Card>
```

## 6. WHAT IF A COMPONENT IS MISSING?

**DO NOT create it yourself!**

1. Check if it can be composed from existing components
2. If truly missing, note it in the PR description
3. Request Sangeeth's approval before adding

## 7. COMMON MISTAKES TO AVOID

**❌ Don't do this:**
```tsx
// Creating custom styled components
const MyButton = styled.button`...`

// Using external UI libraries
import { Button } from "@mui/material"

// Writing inline styles for UI elements
<button style={{ background: "blue" }}>Click</button>
```

**✅ Do this instead:**
```tsx
// Use design system components
import { Button } from "@/components/ui/button"
<Button variant="primary">Click</Button>
```

## 8. FILE STRUCTURE

```
my-app/
├── app/                    # Next.js app router pages
├── components/
│   └── ui/                 # ✅ All UI components (55+)
├── lib/
│   └── utils.ts           # cn() helper function
├── hooks/                 # Custom React hooks
└── public/               # Static assets
```

## 9. IMPORT PATHS

**Always use aliases:**
- `@/components/ui/*` - UI components
- `@/lib/utils` - Utility functions
- `@/hooks/*` - Custom hooks

**Never use relative imports:**
- ❌ `import { Button } from "../../../components/ui/button"`
- ✅ `import { Button } from "@/components/ui/button"`

## 10. QUESTIONS?

- Review [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for detailed component docs
- Check existing pages in `app/` for implementation examples
- When in doubt, ask: "Can I build this with existing components?"

**Remember: Consistency > Creativity. Use the system.**

<!-- END:ai-design-system-rules -->

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
