# GHX Apprenticeship - Team Workflow

**Design System:** Next.js + shadcn/ui (55+ components)  
**Repo URL:** https://github.com/Sangeethramuk/GHX-Apprenticeship  
**Maintainer:** Sangeeth Kumar

---

## 🚀 Quick Start for New Team Members

### 1. Clone the Repository
```bash
git clone https://github.com/Sangeethramuk/GHX-Apprenticeship.git
cd GHX-Apprenticeship/my-app
npm install
npm run dev
```

### 2. Read the AI Guidelines
Before coding, AI assistants **MUST** read:
- [AGENTS.md](./AGENTS.md) - Critical AI rules
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Component reference

### 3. Start Developing
Open `http://localhost:3000` and begin building!

---

## 🔄 Team Workflow (Git Strategy)

### Branch Naming Convention
```
feature/user-authentication
fix/login-button-bug
hotfix/security-patch
refactor/dashboard-components
```

### Daily Workflow

#### Step 1: Start Your Day
```bash
# Get latest changes from main
git checkout main
git pull origin main

# Create your feature branch
git checkout -b feature/your-feature-name
```

#### Step 2: Develop with AI
When using AI (Claude, ChatGPT, Cursor, etc.):
1. **Share AGENTS.md with AI** - "Please read AGENTS.md first"
2. **Use existing components only** - No creating new UI components
3. **Import from `@/components/ui/`** - Always use the design system
4. **Check DESIGN_SYSTEM.md** - Reference available components

#### Step 3: Commit Regularly
```bash
git add .
git commit -m "feat: add user login form

- Implemented login using Card, Input, Button components
- Added form validation with React Hook Form
- Used design system colors and spacing"
```

**Commit Message Format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code restructuring
- `docs:` - Documentation
- `style:` - CSS/styling changes
- `test:` - Tests

#### Step 4: Push and Create PR
```bash
git push origin feature/your-feature-name
```

Then go to GitHub and **Create Pull Request**

#### Step 5: Code Review
- **Sangeeth reviews** your PR
- **Address feedback** with new commits
- **Get approval** (required before merge)
- **Sangeeth merges** to main

---

## 🤖 AI-Assisted Development Rules

### ✅ DO:
- Use AI to write code faster
- Share AGENTS.md with AI before starting
- Ask AI to check component availability in design system
- Use AI for debugging and optimization
- Compose complex UIs from existing components

### ❌ DON'T:
- Let AI create new components in `@/components/ui/`
- Use external UI libraries (Material-UI, Ant Design, etc.)
- Ignore the design system
- Push directly to `main` branch
- Merge your own PRs

### Best Practice: AI Prompt Template
```
I'm working on a [feature name] for a Next.js app with shadcn/ui.

Please first read these files:
1. AGENTS.md - Critical rules
2. DESIGN_SYSTEM.md - Component reference

Then help me build: [describe what you need]

Requirements:
- Use only existing components from @/components/ui/
- Follow the design system tokens (colors, spacing, typography)
- Support dark mode automatically
- Make it accessible (ARIA labels, keyboard navigation)
```

---

## 🎨 Design System Quick Reference

### Import Components
```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
```

### Available Components (55+)
**Layout:** Card, Sheet, Sidebar, Separator, ScrollArea  
**Forms:** Button, Input, Textarea, Checkbox, Switch, Select, Calendar  
**Navigation:** Breadcrumb, Tabs, Pagination, Command  
**Overlays:** Dialog, Popover, Tooltip, DropdownMenu  
**Feedback:** Alert, Badge, Progress, Skeleton, Toast  
**Data:** Table, Chart, Avatar, Accordion  

**Full list:** See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

### Common Patterns

**Login Form:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Login</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <Input placeholder="Email" type="email" />
    <Input placeholder="Password" type="password" />
    <Button className="w-full">Sign In</Button>
  </CardContent>
</Card>
```

**Data Table with Actions:**
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>
          <Badge variant={item.active ? "default" : "secondary"}>
            {item.active ? "Active" : "Inactive"}
          </Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## 📝 Pull Request Guidelines

### PR Title Format
```
feat: Add user authentication flow
fix: Resolve login button alignment issue
refactor: Simplify dashboard layout
```

### PR Description Template
```markdown
## What
Brief description of what this PR does

## Changes
- List specific changes made
- Component usage (e.g., "Used Card, Input, Button")
- Any design system patterns applied

## Testing
- How you tested it
- Screenshots if UI changes

## Checklist
- [ ] Used existing components only
- [ ] Followed design system
- [ ] Tested locally
- [ ] No console errors
```

### Review Process
1. **Create PR** → Assign to Sangeeth
2. **CI checks** pass (if enabled)
3. **Sangeeth reviews** within 24 hours
4. **Address feedback** → Push fixes
5. **Get approval** → Sangeeth merges

---

## 🚫 Common Mistakes to Avoid

### 1. Creating New Components
❌ Don't create `components/ui/my-button.tsx`  
✅ Use `import { Button } from "@/components/ui/button"`

### 2. External Libraries
❌ Don't install Material-UI, Ant Design, Chakra  
✅ Use the 55+ components already available

### 3. Custom CSS
❌ Don't write `<button style={{ background: 'blue' }}>`  
✅ Use `<Button variant="primary">` with CSS variables

### 4. Direct Main Push
❌ Never `git push origin main`  
✅ Always create feature branch → PR → Review → Merge

### 5. Ignoring Design System
❌ Don't use arbitrary colors/spacing  
✅ Use tokens: `bg-primary`, `p-4`, `text-sm`

---

## 🔧 Development Tips

### Using AI Effectively
1. **Start with context:** "Read AGENTS.md first"
2. **Be specific:** "Create a login form using Card, Input, Button"
3. **Ask for alternatives:** "Show me 3 ways to layout this dashboard"
4. **Review AI output:** Check it uses `@/components/ui/` imports

### Testing Locally
```bash
npm run dev        # Start dev server
npm run lint       # Check code style
npm run build      # Test production build
```

### Debugging
- Check browser console for errors
- Verify imports use `@/components/ui/`
- Ensure CSS variables are applied
- Test both light and dark mode

---

## 📚 Resources

- **Component Docs:** [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
- **AI Instructions:** [AGENTS.md](./AGENTS.md)
- **shadcn/ui:** https://ui.shadcn.com
- **Lucide Icons:** https://lucide.dev/icons
- **Tailwind CSS:** https://tailwindcss.com

---

## 🆘 Need Help?

1. **Check the docs:** DESIGN_SYSTEM.md has examples
2. **Ask in PR:** Tag Sangeeth with questions
3. **Create an issue:** For bugs or missing features
4. **Team chat:** Discuss in your group chat

---

## 🎯 Success Checklist

Before submitting PR, ensure:
- [ ] Feature works locally
- [ ] Uses only existing UI components
- [ ] Follows design system colors/spacing
- [ ] No console errors
- [ ] Dark mode works
- [ ] Code is clean and readable
- [ ] Commit messages are clear
- [ ] PR description is complete

**Remember:** Quality over speed. Use the design system. Ask AI the right way.

---

Happy coding! 🚀
