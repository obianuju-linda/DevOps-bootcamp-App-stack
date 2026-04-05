# Responsive Design Quick Reference

## Component Sizing at Different Breakpoints

### PhonePreview

| Element | Mobile (<640px) | Desktop (≥640px) |
|---------|----------------|------------------|
| Phone Frame | 280px × 580px (90% scale) | 307px × 631px (100% scale) |
| Profile Image | 80px × 80px | 96px × 96px |
| Display Name | text-xs | text-sm |
| Links Container | max-height: 240px | max-height: 300px |
| Link Card Height | 36px (h-9) | 44px (h-11) |
| Link Card Gap | 12px (gap-3) | 20px (gap-5) |

### SocialsCardLink

| Element | Mobile (<640px) | Desktop (≥640px) |
|---------|----------------|------------------|
| Padding | 12px × 10px | 16px × 12px |
| Text Size | text-xs | text-sm |
| Icon Size | 14px | 16px |

### DashboardLayout

| Element | Mobile | Tablet (≥640px) | Desktop (≥1024px) |
|---------|--------|----------------|-------------------|
| Page Padding | 8px | 16px | 24px |
| Logo Size | 24px | 32px | 32px |
| Nav Icons | 18px | 20px | 20px |
| PhonePreview Panel | Hidden | Hidden | Visible (40%) |
| Content Panel | 100% width | 100% width | 60% width |

## Visibility Rules

### Mobile/Tablet (<1024px)
- ✅ Main content (full width)
- ✅ Navigation icons only
- ✅ Preview button (icon only)
- ❌ PhonePreview panel (hidden)
- ❌ Navigation text labels (hidden)

### Desktop (≥1024px)
- ✅ PhonePreview panel (40% width)
- ✅ Main content (60% width)
- ✅ Navigation icons + text
- ✅ Preview button with "Preview" text
- ✅ Full spacing and padding

## Common Patterns Used

```tsx
// Responsive sizing
className="size-20 sm:size-24"  // 80px → 96px

// Responsive spacing
className="gap-3 sm:gap-5 mb-10 sm:mb-14"

// Responsive text
className="text-xs sm:text-sm"

// Responsive padding
className="px-3 sm:px-4 py-2.5 sm:py-3"

// Responsive visibility
className="hidden sm:block"  // Show on desktop only
className="sm:hidden"        // Show on mobile only
className="hidden lg:flex"   // Show on large screens only

// Responsive widths
className="w-full sm:w-auto"
className="max-w-70 sm:w-76.75"

// Responsive icons
<Icon size={18} className="sm:w-5 sm:h-5" />
```

## Testing Checklist

- [ ] Mobile portrait (375px × 667px) - iPhone SE
- [ ] Mobile landscape (667px × 375px)
- [ ] Tablet portrait (768px × 1024px) - iPad
- [ ] Tablet landscape (1024px × 768px)
- [ ] Desktop (1280px × 720px)
- [ ] Large desktop (1920px × 1080px)

## Expected Behavior

### On Mobile
- Single column layout
- Compact spacing
- No PhonePreview visible
- Icon-only buttons
- Smaller text and images

### On Tablet
- Still single column
- Better spacing than mobile
- Still no PhonePreview
- Icon-only buttons
- Medium text and images

### On Desktop
- Two-column layout
- PhonePreview on left (40%)
- Content on right (60%)
- Full text labels
- Optimal spacing and sizing

---

**Last Updated**: February 4, 2026
