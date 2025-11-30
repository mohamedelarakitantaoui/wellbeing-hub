# 🚀 Quick Start Guide - Using New Components

## Import Shared Components

```typescript
// Single import for all shared components
import { 
  LoadingSkeleton, 
  CardSkeleton,
  ChatMessageSkeleton,
  DashboardSkeleton,
  EmptyState, 
  NoBookings,
  NoMessages,
  NoSupportRooms,
  NoProgress,
  ErrorBoundary,
  TypingIndicator 
} from '../components/shared';
```

---

## 1. Loading States

### Basic Loading Skeleton
```typescript
function MyPage() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton variant="text" className="w-64" />
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="button" className="w-32" />
      </div>
    );
  }

  return <div>Content...</div>;
}
```

### Pre-built Skeletons
```typescript
// For card lists
{loading && (
  <>
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
  </>
)}

// For chat interface
{loading && <ChatMessageSkeleton />}

// For dashboard
{loading && <DashboardSkeleton />}
```

---

## 2. Empty States

### Custom Empty State
```typescript
import { Calendar } from 'lucide-react';

<EmptyState
  icon={Calendar}
  title="No appointments yet"
  description="Schedule your first counseling session to get started"
  action={{
    label: 'Book Now',
    href: '/booking'
  }}
  secondaryAction={{
    label: 'Learn More',
    onClick: () => console.log('Learn more')
  }}
/>
```

### Pre-built Empty States
```typescript
// For bookings page
{bookings.length === 0 && <NoBookings />}

// For chat/messages
{messages.length === 0 && <NoMessages />}

// For support rooms
{rooms.length === 0 && <NoSupportRooms />}

// For progress/analytics
{data.length === 0 && <NoProgress />}
```

---

## 3. Error Boundary

### Wrap Routes
```typescript
// In your routing file
<ErrorBoundary>
  <Routes>
    <Route path="/home" element={<Dashboard />} />
    <Route path="/chat" element={<ChatActive />} />
  </Routes>
</ErrorBoundary>
```

### Custom Fallback
```typescript
<ErrorBoundary
  fallback={
    <div className="p-8 text-center">
      <h1>Oops! Something went wrong</h1>
      <button onClick={() => window.location.reload()}>
        Reload
      </button>
    </div>
  }
>
  <MyComponent />
</ErrorBoundary>
```

---

## 4. Typing Indicator

### Default Style (Message Bubble)
```typescript
{isTyping && <TypingIndicator name="Sarah" />}
```

### Minimal Style (Inline)
```typescript
{isTyping && <TypingIndicator name="Supporter" variant="minimal" />}
```

---

## 5. Page Layout Pattern

### Standard Page Structure
```typescript
function MyPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-bg pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="text-fg-secondary">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold text-fg mb-3">Page Title</h1>
          <p className="text-lg text-fg-secondary">Description</p>
        </div>

        {/* Content */}
        {data.length === 0 ? (
          <NoBookings />
        ) : (
          <div className="space-y-4 animate-slide-up">
            {data.map(item => (
              <div key={item.id} className="card p-6">
                {item.content}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 6. Common Styling Patterns

### Cards
```typescript
<div className="card p-6 hover:shadow-xl transition-all duration-200 animate-fade-in">
  {/* Card content */}
</div>
```

### Buttons - Primary
```typescript
<button className="btn-primary px-8 py-4 flex items-center gap-2">
  <Icon className="w-5 h-5" />
  Click Me
</button>
```

### Buttons - Secondary
```typescript
<button className="btn-secondary px-8 py-4">
  Cancel
</button>
```

### Input Fields
```typescript
<input
  type="text"
  className="w-full px-5 py-3.5 border-2 border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
  placeholder="Enter text..."
/>
```

### Modal/Dialog
```typescript
{showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
    <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-scale-in shadow-2xl">
      <h2 className="text-xl font-bold text-fg mb-3">Modal Title</h2>
      <p className="text-fg-secondary mb-6">Modal content...</p>
      <div className="flex gap-3">
        <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
          Cancel
        </button>
        <button onClick={handleConfirm} className="btn-primary flex-1">
          Confirm
        </button>
      </div>
    </div>
  </div>
)}
```

---

## 7. Animations

### Entrance Animations
```typescript
// Fade in
<div className="animate-fade-in">...</div>

// Slide up
<div className="animate-slide-up">...</div>

// Scale in
<div className="animate-scale-in">...</div>

// Bounce in
<div className="animate-bounce-in">...</div>
```

### Hover Effects
```typescript
<div className="hover:scale-[1.02] hover:shadow-lg transition-all duration-200">
  ...
</div>
```

### Loading Pulse
```typescript
<div className="animate-pulse-gentle">...</div>
```

---

## 8. Responsive Design

### Container Widths
```typescript
// Small content
<div className="max-w-2xl mx-auto">...</div>

// Standard content
<div className="max-w-4xl mx-auto">...</div>

// Wide content
<div className="max-w-6xl mx-auto">...</div>
```

### Mobile-First Grid
```typescript
// 1 column on mobile, 2 on tablet, 3 on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  ...
</div>
```

### Show/Hide on Mobile
```typescript
// Hide on mobile
<div className="hidden md:block">Desktop only</div>

// Show on mobile only
<div className="md:hidden">Mobile only</div>
```

---

## 9. Color Utilities

```typescript
// Backgrounds
bg-bg           // Main background
bg-white        // Pure white
bg-subtle       // Subtle background
bg-card         // Card background
bg-hover        // Hover state

// Text
text-fg               // Primary text
text-fg-secondary     // Secondary text
text-fg-muted         // Muted text
text-primary          // Brand primary
text-accent           // Accent color

// Borders
border-border         // Standard border
border-border-light   // Light border
```

---

## 10. Spacing Guidelines

```typescript
// Padding
p-6       // Card padding
px-6      // Horizontal padding
py-8      // Vertical padding

// Gaps
gap-4     // Standard gap
gap-6     // Larger gap
space-y-6 // Vertical spacing between children

// Margins
mb-6      // Bottom margin
mt-8      // Top margin
```

---

## ✅ Checklist for New Pages

- [ ] Add loading skeleton
- [ ] Add empty state
- [ ] Wrap with ErrorBoundary (in router)
- [ ] Use consistent spacing (px-6, py-8)
- [ ] Add max-width container (max-w-4xl mx-auto)
- [ ] Use theme colors (text-fg, bg-white, etc.)
- [ ] Add entrance animations (animate-fade-in)
- [ ] Make mobile responsive
- [ ] Add hover effects on interactive elements
- [ ] Use proper button styles (btn-primary, btn-secondary)

---

## 🎯 Pro Tips

1. **Always wrap cards:** Use `.card` class for consistent styling
2. **Use theme tokens:** Never use arbitrary colors like `#FF0000`
3. **Mobile-first:** Design for mobile, then add desktop breakpoints
4. **Loading states:** Always show skeleton loaders, not just spinners
5. **Empty states:** Make them friendly and actionable
6. **Animations:** Use sparingly for important interactions
7. **Consistency:** Follow existing patterns in the codebase

---

## 📚 Additional Resources

- **Tailwind Config:** `frontend/tailwind.config.js`
- **Global Styles:** `frontend/src/index.css`
- **Shared Components:** `frontend/src/components/shared/`
- **Design System:** See `FRONTEND_IMPROVEMENTS_SUMMARY.md`
