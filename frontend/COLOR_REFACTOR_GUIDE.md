# Color Refactoring Guide

## ✅ Completed
- ✅ Global CSS (`src/index.css`) - Added CSS variables
- ✅ Tailwind Config - Mapped to CSS variables
- ✅ Login page - Fully refactored

## 🎨 Color Token Mappings

### Replace these hardcoded colors with tokens:

| Old Color | New Token | Usage |
|-----------|-----------|-------|
| `#006341`, `#004B36` | `primary` | Main brand color |
| `#007A52`, `#006F57` | `primary-light` | Hover states |
| `#008C5A`, `#007B8A` | `accent` | Secondary actions |
| `#D4AF37` | `accent-warm` | Gold accents |
| `text-gray-900`, `text-[#1E293B]` | `text-fg` | Primary text |
| `text-gray-600`, `text-gray-800` | `text-fg-secondary` | Secondary text |
| `text-gray-500` | `text-fg-muted` | Muted text |
| `text-gray-400`, `text-gray-300` | `text-fg-disabled` | Disabled text |
| `bg-gray-50`, `bg-gray-100` | `bg-subtle` | Light backgrounds |
| `bg-white` | `bg-white` | Keep as is |
| `bg-green-500`, `bg-green-600` | `accent-success` | Success states |
| `text-green-700`, `text-green-600` | `text-accent-success` | Success text |
| `bg-green-50`, `bg-green-100` | `bg-primary-50` | Success backgrounds |
| `border-gray-200`, `border-gray-300` | `border` | Standard borders |
| `hover:bg-gray-50`, `hover:bg-gray-100` | `hover:bg-bg-hover` | Hover backgrounds |

### Gradient Replacements:

```tsx
// OLD
className="bg-gradient-to-br from-[#006341] to-[#008C5A]"

// NEW
className="bg-linear-to-br from-primary to-primary-light"
```

```tsx
// OLD
className="bg-gradient-to-r from-[#006341] to-[#008C5A]"

// NEW
className="bg-linear-to-r from-primary to-accent"
```

## 📋 Files Needing Updates (Priority Order)

### High Priority - Authentication & Core
1. ✅ `src/pages/Login.tsx` - DONE
2. ⚠️ `src/pages/Register.tsx` - IN PROGRESS
3. `src/pages/student/StudentDashboard.tsx`
4. `src/pages/student/StudentChat.tsx`

### Medium Priority - Student Pages
5. `src/pages/student/StudentBooking.tsx`
6. `src/pages/student/StudentProgress.tsx`
7. `src/pages/student/StudentSettings.tsx`

### Medium Priority - Support Pages
8. `src/pages/SupportQueue.tsx`
9. `src/pages/SupportRoom.tsx`
10. `src/pages/SupportRoomEnhanced.tsx`
11. `src/pages/supporter/SupporterQueue.tsx`

### Lower Priority - Admin & Other
12. `src/pages/admin/AdminAnalytics.tsx`
13. `src/pages/admin/AdminSettings.tsx`
14. `src/pages/admin/AdminPeerApplications.tsx`
15. `src/pages/Progress.tsx`
16. `src/pages/MyBookings.tsx`
17. `src/pages/Resources.tsx`
18. `src/pages/Triage.tsx`

### Landing Pages (Already updated gradients)
19. `src/components/landing/FeatureShowcase.tsx` - Update gray colors only
20. `src/components/landing/EnhancedHero.tsx` - Update gray colors only
21. `src/components/landing/FinalCTA.tsx` - Update gray colors only

## 🔧 Systematic Replacement Commands

### Text Colors
```bash
# Primary text
text-gray-900 → text-fg
text-gray-800 → text-fg
text-[#1E293B] → text-fg

# Secondary text
text-gray-600 → text-fg-secondary
text-gray-700 → text-fg-secondary

# Muted text
text-gray-500 → text-fg-muted

# Disabled text
text-gray-400 → text-fg-disabled
text-gray-300 → text-fg-disabled
```

### Background Colors
```bash
# Light backgrounds
bg-gray-50 → bg-subtle
bg-gray-100 → bg-subtle

# Hover states
hover:bg-gray-50 → hover:bg-bg-hover
hover:bg-gray-100 → hover:bg-bg-hover
```

### Success Colors
```bash
bg-green-500 → bg-accent-success
bg-green-600 → bg-accent-success
bg-green-50 → bg-primary-50
bg-green-100 → bg-primary-50
text-green-700 → text-accent-success
text-green-600 → text-accent-success
```

### Border Colors
```bash
border-gray-200 → border
border-gray-300 → border
border-gray-100 → border-light
```

## ✨ Expected Results

After refactoring:
- ✅ Consistent AUI green (#004B36) as primary color
- ✅ Consistent teal (#007B8A) as accent color
- ✅ All text uses token-based colors (text-fg, text-fg-secondary, text-fg-muted)
- ✅ No random grays or hardcoded hex values
- ✅ Better contrast and readability
- ✅ Professional, cohesive design
- ✅ Easy to maintain and theme
