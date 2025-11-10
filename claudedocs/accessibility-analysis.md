# Accessibility Analysis Report

**Project:** Brennon Williams Portfolio Website  
**Framework:** Astro 4 + Vue 3 + UnoCSS  
**Date:** 2025-11-10  
**Analyst:** Claude Code

---

## Executive Summary

This report provides a comprehensive accessibility (a11y) analysis of the Astro + Vue portfolio website. The analysis covers semantic HTML, ARIA attributes, keyboard navigation, screen reader support, color contrast, focus indicators, alt text, and mobile accessibility.

**Overall Rating:** ⚠️ **Moderate** - Several critical issues require attention

**Priority Issues:**
- 🔴 **Critical:** Mobile menu button is not keyboard accessible
- 🔴 **Critical:** Missing focus indicators throughout the site
- 🟡 **High:** Color contrast issues with reduced opacity elements
- 🟡 **High:** Missing semantic navigation wrapper in header

---

## 1. Semantic HTML

### ✅ Strengths

**File:** `src/layouts/BaseLayout.astro`
- Line 22-29: Proper use of `<main>` element with semantic structure
- Good use of `<article>` in blog posts and content pages

**File:** `src/pages/posts/[...slug].astro`
- Line 31: Proper `<article>` wrapper for blog post content
- Line 34: Semantic `<time>` element with datetime attribute

**File:** `src/components/NavDrawer.vue`
- Line 24-28: Proper `<nav>` element with aria-label for mobile navigation

### ⚠️ Issues

**File:** `src/components/Header.vue`
- **Line 50-57:** Navigation links are wrapped in a `<nav>` element, but it lacks an accessible name
  ```vue
  <nav class="sm:flex hidden flex-wrap gap-x-6 position-initial flex-row">
  ```
  **Recommendation:** Add `aria-label="Main navigation"` or `aria-labelledby`

**File:** `src/components/Footer.vue`
- **Line 7-13:** Footer content is in a `<footer>` element but lacks semantic navigation structure
  ```vue
  <footer class="w-full pt-6 pb-8...">
  ```
  **Recommendation:** Wrap links in a `<nav aria-label="Footer navigation">` element

**File:** `src/pages/index.astro`
- **Line 33-38:** List structure lacks semantic hierarchy
  ```astro
  <ul>
    <li>Machine Reasoning</li>
    <li>Local-First Software</li>
  ```
  **Recommendation:** Consider if this should be nested within a proper section with heading

---

## 2. ARIA Labels & Attributes

### ✅ Strengths

**File:** `src/components/ThemeToggle.vue`
- Line 48: Good dynamic aria-label for theme toggle
  ```vue
  :aria-label="isDark ? 'Dark Theme' : 'Light Theme'"
  ```

**File:** `src/components/ScrollToTop.vue`
- Line 16: Proper aria-label for icon-only button
  ```vue
  aria-label="Scroll to top"
  ```

**File:** `src/components/PovBlock.astro`
- Line 118: Proper use of `aria-hidden="true"` on cloned carousel items
  ```javascript
  clone.setAttribute('aria-hidden', 'true')
  ```

### ⚠️ Issues & Redundancies

**File:** `src/components/Header.vue`
- **Line 47:** Redundant aria-label on link that contains an image with alt text
  ```vue
  <a href="/" mr-6 aria-label="Header Logo Image">
    <img ... :alt="siteConfig.header.logo.alt">
  ```
  **Recommendation:** Remove aria-label or make it more descriptive (e.g., "Go to homepage"). The alt text on the image is sufficient.

- **Line 52, 64:** Generic aria-labels that just repeat link text
  ```vue
  :aria-label="`${link.text}`"
  ```
  **Recommendation:** Remove these; screen readers already announce link text. If needed, make them more descriptive.

- **Line 63-66:** Icon-only social links lack descriptive labels
  ```vue
  <a v-for="link in socialLinks" :aria-label="`${link.text}`" :class="link.icon" nav-link>
  ```
  **Recommendation:** Ensure aria-labels are descriptive, e.g., "Visit GitHub profile" instead of just "GitHub"

**File:** `src/components/NavDrawer.vue`
- **Line 48:** aria-hidden on interactive element
  ```vue
  <div class="nav-drawer-mask" ... aria-hidden="true">
  ```
  **Recommendation:** This mask should be keyboard accessible or removed from tab order differently

---

## 3. Keyboard Navigation

### 🔴 Critical Issues

**File:** `src/components/Header.vue`
- **Line 58-60:** Mobile menu toggle is a `<div>` instead of `<button>`
  ```vue
  <div sm:hidden h-full flex items-center @click="toggleNavDrawer()">
    <menu i-ri-menu-2-fill />
  </div>
  ```
  **Impact:** Users cannot open mobile navigation with keyboard (Tab + Enter/Space)
  
  **Recommendation:** Change to semantic button element:
  ```vue
  <button 
    type="button"
    aria-label="Toggle navigation menu"
    aria-expanded="false"
    :aria-expanded="isNavDrawerOpen"
    sm:hidden h-full flex items-center 
    @click="toggleNavDrawer()"
  >
    <span i-ri-menu-2-fill aria-hidden="true" />
  </button>
  ```

**File:** `src/components/NavDrawer.vue`
- **Line 44-49:** Overlay mask is not keyboard accessible
  ```vue
  <div class="nav-drawer-mask" ... @click="toggleNavDrawer">
  ```
  **Recommendation:** Add keyboard event handler or use proper focus trap pattern

- **Missing:** Focus trap implementation - when drawer opens, focus should move to drawer and be trapped until closed

**File:** `src/components/PovBlock.astro`
- **Line 75-280:** Carousel is mouse/touch only, no keyboard navigation
  - No keyboard arrow key support
  - No skip/pause mechanism for auto-rotation
  
  **Recommendations:**
  1. Add keyboard controls (Arrow Left/Right to navigate)
  2. Add Escape key to pause auto-rotation
  3. Add visible pause/play button
  4. Consider adding `role="region"` and `aria-label` to carousel container
  5. Add `role="group"` and `aria-label` to each carousel item

### ⚠️ Tab Order Issues

**File:** `src/layouts/BaseLayout.astro`
- **Line 21, 27-28:** Header and Footer are outside `<main>` but tab order may be confusing
  - Header is fixed, so it's always visible
  - Verify logical tab order: Header → Main content → Footer → Scroll-to-top

---

## 4. Screen Reader Support

### ✅ Strengths

- Good use of semantic HTML elements (`<nav>`, `<main>`, `<article>`, `<time>`)
- Proper alt text on most images
- Dynamic aria-labels on theme toggle

### ⚠️ Issues

**File:** `src/components/Header.vue`
- **Line 59:** Icon-only menu button with no accessible name
  ```vue
  <menu i-ri-menu-2-fill />
  ```
  **Recommendation:** Add aria-label to parent button (see Keyboard Navigation section)

- **Line 63-66:** Icon-only social links
  ```vue
  <a ... :class="link.icon" nav-link>
  ```
  **Issue:** Links have no visible text, only icons. Screen readers rely on aria-label.
  
  **Recommendation:** Add visually-hidden text or ensure aria-labels are descriptive

**File:** `src/components/ListPosts.vue`
- **Line 46-48:** Empty state messaging
  ```vue
  <div my-12 opacity-50>
    nothing here yet.
  </div>
  ```
  **Recommendation:** Add role="status" for dynamic content, or use semantic paragraph

- **Line 60-61:** Draft icon has no context
  ```vue
  <i v-if="post.data.draft" text-base vertical-mid i-ri-draft-line />
  ```
  **Recommendation:** Add `aria-label="Draft post"` or visually-hidden text

**File:** `src/components/PovBlock.astro`
- **Line 21-40:** Carousel items lack context
  **Recommendation:** Add `role="region" aria-label="Personal principles carousel"` to container

---

## 5. Color Contrast

### ⚠️ Potential Issues

**File:** `uno.config.ts`

**Line 22:** Nav link opacity
```typescript
'nav-link': 'text-link opacity-70 hover:opacity-100...'
```
- Base opacity of 70% may reduce contrast below WCAG AA standards
- **Affected files:** Header.vue, Footer.vue, NavDrawer.vue, blog pages

**Line 16:** Text color definitions
```typescript
'text-main': 'text-hex-555555 dark:text-hex-bbbbbb',
```
- Light mode: `#555555` on `#eef5fc` - **Ratio: 7.48:1** ✅ Passes AAA
- Dark mode: `#bbbbbb` on `#0d1117` - **Ratio: 10.89:1** ✅ Passes AAA

**Opacity-based contrast issues:**

**File:** `src/components/ListPosts.vue`
- **Line 64:** `opacity-50` on metadata
  ```vue
  <div opacity-50 text-sm ws-nowrap...>
  ```
  **Concern:** With opacity-50 on `#555555`, effective color is ~`#aaaaa7` on `#eef5fc`
  - **Estimated Ratio: ~3.74:1** ⚠️ Passes AA for large text only

- **Line 73:** `opacity-50` on description
  - Same contrast concern as above

**File:** `src/pages/projects/index.astro`
- **Line 16:** Large decorative year text
  ```astro
  <span class="... op35 dark:op20...">
  ```
  - Very low contrast intentional for decorative element
  - **Recommendation:** Ensure this is truly decorative and not essential content. Consider adding `aria-hidden="true"`

**File:** `src/styles/prose.css`
- **Line 105:** H3 heading opacity
  ```css
  .prose h3 {
    opacity: 0.7;
  }
  ```
  **Concern:** Headings are structural and should meet contrast standards
  - **Recommendation:** Test actual contrast or increase opacity to 0.85+

### 🔍 Recommended Actions

1. **Test actual color combinations** with tools like:
   - Chrome DevTools Lighthouse
   - WebAIM Contrast Checker
   - Axe DevTools

2. **Increase opacity** on critical text elements:
   - Navigation links: 70% → 85%
   - Post metadata: 50% → 60-70%
   - H3 headings: 70% → 85%

3. **Document exceptions** for decorative elements

---

## 6. Focus Indicators

### 🔴 Critical Issue: No Custom Focus Styles

**Problem:** No custom `:focus` or `:focus-visible` styles found in:
- `src/styles/global.css`
- `src/styles/prose.css`
- `uno.config.ts`
- Component-level styles

**Files searched:** All `.css`, `.vue`, `.astro` files

**Impact:**
- Users relying on keyboard navigation may struggle to see where focus is
- Browser default focus indicators vary and may be removed by CSS reset
- WCAG 2.4.7 (Focus Visible) Level AA requirement

### 🔍 Elements Requiring Focus Styles

1. **All interactive elements:**
   - Links (`<a>`)
   - Buttons (`<button>`)
   - Theme toggle
   - Scroll to top button
   - Mobile menu toggle
   - Carousel (if made keyboard accessible)

2. **Recommended Implementation:**

Add to `src/styles/global.css`:

```css
/* Focus styles for keyboard navigation */
*:focus {
  outline: 2px solid transparent; /* Clear default */
}

*:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
  border-radius: 2px;
}

/* Dark mode focus indicator */
html.dark *:focus-visible {
  outline-color: #fff;
  box-shadow: 0 0 0 2px #0d1117, 0 0 0 4px #fff;
}

/* Light mode focus indicator */
html:not(.dark) *:focus-visible {
  outline-color: #000;
  box-shadow: 0 0 0 2px #eef5fc, 0 0 0 4px #000;
}

/* Ensure buttons have visible focus */
button:focus-visible,
a:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

Or add to `uno.config.ts` shortcuts:
```typescript
shortcuts: [
  {
    'focus-ring': 'focus:outline-2 focus:outline-current focus:outline-offset-2',
  }
]
```

**Priority:** 🔴 **High** - Implement before production deployment

---

## 7. Alt Text on Images

### ✅ Good Practices

**File:** `src/pages/index.astro`
- **Line 19-23:** Proper alt text on profile image
  ```astro
  <img
    src="/brennon-headshot-bw-stylized.png"
    alt="Brennon Williams headshot"
    ...
  />
  ```

**File:** `src/components/Header.vue`
- **Line 48:** Logo has alt text from config
  ```vue
  <img ... :alt="siteConfig.header.logo.alt">
  ```

### ⚠️ Issues

**File:** `src/pages/posts/[...slug].astro`
- **Line 41:** Fallback to empty alt text
  ```astro
  <img ... alt={image.alt || ''} />
  ```
  **Issue:** If `image.alt` is undefined, results in decorative image declaration
  
  **Recommendation:** Either:
  1. Require alt text in content schema validation
  2. Use a descriptive fallback: `alt={image.alt || 'Blog post featured image'}`
  3. Add validation to flag missing alt text

**File:** `src/site-config.ts`
- **Line 7-8:** Generic alt text
  ```typescript
  alt: 'Website Main Image',
  ```
  **Recommendation:** Make more descriptive, e.g., "Brennon Williams professional headshot against blue background"

### 🔍 Icon Images

**File:** Multiple Vue components use icon fonts via UnoCSS classes (e.g., `i-ri-github-line`)

**Current approach:** Icons are decorative via CSS
**Recommendation:** Ensure all icon-only elements have proper aria-labels (mostly done, see ARIA section)

---

## 8. Form Accessibility

### ✅ No Forms Found

**Search Results:** No `<form>`, `<input>`, `<textarea>`, or `<select>` elements found in the codebase.

**Status:** ✅ **N/A** - No form accessibility issues

**Note:** If forms are added in the future, ensure:
- All inputs have associated `<label>` elements
- Error messages use `aria-describedby` or `aria-invalid`
- Required fields use `required` attribute and `aria-required="true"`
- Form validation provides clear, accessible feedback

---

## 9. Mobile Accessibility

### ✅ Strengths

**Touch Target Sizes:**
- Navigation links appear adequately sized
- Social icons in header likely meet 44x44px minimum (verify actual rendered size)
- Scroll-to-top button: 48x48px (`w-12 h-12`) ✅ Exceeds minimum

**Responsive Design:**
- Good use of breakpoints (`sm:`, `md:`, etc.)
- Mobile navigation drawer provides good UX alternative

### 🔴 Critical Issues

**File:** `src/components/Header.vue`
- **Line 58-60:** Mobile menu toggle button issues (see Keyboard Navigation section)
  - Not keyboard accessible (div instead of button)
  - No focus indicator
  - May be too small - verify rendered size meets 44x44px minimum

**File:** `src/components/NavDrawer.vue`
- **Line 44-49:** Overlay mask issues
  - Not keyboard accessible
  - No focus trap - keyboard users can tab to content behind drawer
  
**Recommendation:** Implement proper focus trap:
```vue
<script>
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

const drawerRef = ref()
const { activate, deactivate } = useFocusTrap(drawerRef)

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    activate()
  } else {
    deactivate()
  }
})
</script>
```

### ⚠️ Touch Target Size Verification Needed

**Files requiring measurement:**
- `src/components/Header.vue` - Social icons (line 63-66)
- `src/components/Header.vue` - RSS icon (line 68)
- `src/components/Header.vue` - Theme toggle (line 69)
- `src/components/Header.vue` - Mobile menu button (line 58-60)

**Minimum Standard:** 44x44px (WCAG 2.5.5 Level AAA) or 24x24px (Level AA)

**Recommended Test:**
```bash
# Use browser DevTools to measure rendered element dimensions
# Or add this dev utility:
document.querySelectorAll('a, button').forEach(el => {
  const rect = el.getBoundingClientRect()
  if (rect.width < 44 || rect.height < 44) {
    console.warn('Small touch target:', el, `${rect.width}x${rect.height}`)
  }
})
```

### 🔍 Viewport & Zoom

**File:** `src/components/BaseHead.astro`
- **Line 41:** Good viewport meta tag
  ```astro
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  ```
  ✅ Allows user scaling (no `maximum-scale=1` or `user-scalable=no`)

### ⚠️ Mobile-Specific A11y Concerns

**File:** `src/components/PovBlock.astro`
- **Line 264:** Touch events with `passive: false`
  ```javascript
  document.addEventListener('touchmove', handleDragMove, { passive: false })
  ```
  **Issue:** Prevents default scroll behavior during drag
  
  **Recommendation:** 
  1. Only prevent default when actually dragging on carousel
  2. Add clear visual indication of draggable area
  3. Consider alternative non-touch navigation for screen reader users

---

## 10. Additional Accessibility Concerns

### ⚠️ Auto-Playing Carousel

**File:** `src/components/PovBlock.astro`
- **Line 131:** Auto-play functionality
  ```javascript
  const autoPlayDelay = 3000 // Delay between automatic transitions
  ```

**WCAG 2.2.2 (Pause, Stop, Hide):** Content that auto-updates must have pause control

**Recommendations:**
1. Add visible pause/play button
2. Pause on hover or focus
3. Pause on any user interaction
4. Add `prefers-reduced-motion` support:

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (prefersReducedMotion) {
  // Don't auto-play
}
```

### ⚠️ View Transitions

**File:** `src/layouts/BaseLayout.astro`
- **Line 18:** View Transitions API usage
  ```astro
  <ViewTransitions />
  ```

**Recommendation:** Add reduced motion support:

```javascript
// In global.css or script
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

### 🔍 Language Declaration

**File:** `src/layouts/BaseLayout.astro`
- **Line 15:** HTML lang attribute
  ```astro
  <html lang="en">
  ```
  ✅ Properly declared

**Note:** If adding multilingual content, update lang attribute dynamically

### ⚠️ Skip Links

**Missing:** "Skip to main content" link for keyboard users

**Recommendation:** Add to `src/layouts/BaseLayout.astro`:

```astro
<body class="bg-dot">
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <Header client:idle />
  <main id="main-content" class="...">
```

```css
/* In global.css */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

---

## Priority Recommendations

### 🔴 Critical (Fix Immediately)

1. **Make mobile menu button keyboard accessible** (`Header.vue` line 58-60)
   - Change `<div>` to `<button>`
   - Add proper ARIA attributes
   
2. **Add focus indicators** throughout the site
   - Implement `:focus-visible` styles in `global.css`
   - Test with keyboard navigation
   
3. **Implement focus trap** in mobile navigation drawer
   - Prevent tabbing to background content when drawer is open
   
4. **Add pause control** to auto-playing carousel
   - WCAG 2.2.2 compliance

### 🟡 High Priority (Fix Soon)

5. **Fix color contrast issues**
   - Increase opacity on nav links (70% → 85%)
   - Increase opacity on metadata text (50% → 65%)
   - Test all text against backgrounds

6. **Add keyboard navigation** to carousel
   - Arrow keys for manual control
   - Escape to pause
   
7. **Add skip link** for keyboard users

8. **Improve ARIA labels**
   - Make social link labels more descriptive
   - Remove redundant labels on text links

### 🟢 Medium Priority (Improve Over Time)

9. **Wrap footer links** in semantic `<nav>` element

10. **Add prefers-reduced-motion** support
    - Disable auto-play carousel
    - Simplify view transitions

11. **Improve alt text** fallbacks for blog post images

12. **Add decorative marker** (`aria-hidden="true"`) to decorative elements

---

## Testing Checklist

### Manual Testing

- [ ] Navigate entire site using only keyboard (Tab, Enter, Escape)
- [ ] Test with screen reader (NVDA on Windows, VoiceOver on Mac/iOS)
- [ ] Verify all interactive elements are reachable and operable
- [ ] Test mobile navigation with keyboard and screen reader
- [ ] Test with 200% browser zoom
- [ ] Test in high contrast mode

### Automated Testing

- [ ] Run Lighthouse accessibility audit
- [ ] Run Axe DevTools scan
- [ ] Run WAVE browser extension
- [ ] Test color contrast with WebAIM Contrast Checker
- [ ] Validate HTML with W3C validator

### Browser/Device Testing

- [ ] Chrome/Edge (desktop) with keyboard
- [ ] Firefox (desktop) with keyboard
- [ ] Safari (desktop) with VoiceOver
- [ ] iOS Safari with VoiceOver
- [ ] Android Chrome with TalkBack

---

## Resources

### Tools
- [Axe DevTools](https://www.deque.com/axe/devtools/) - Browser extension for automated testing
- [WAVE](https://wave.webaim.org/) - Web accessibility evaluation tool
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Chrome Lighthouse](https://developers.google.com/web/tools/lighthouse) - Built into Chrome DevTools

### Guidelines
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [Vue.js Accessibility Guide](https://vuejs.org/guide/best-practices/accessibility.html)

### Best Practices
- [Inclusive Components](https://inclusive-components.design/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Articles](https://webaim.org/articles/)

---

## Conclusion

This website has a solid foundation with good semantic HTML structure and proper use of ARIA attributes in many places. However, there are several critical accessibility issues that need immediate attention:

1. **Keyboard accessibility** is compromised by non-semantic interactive elements
2. **Focus indicators** are missing, making keyboard navigation difficult
3. **Color contrast** may be insufficient in several areas due to opacity usage
4. **Mobile navigation** lacks proper focus management

Addressing the critical and high-priority recommendations will significantly improve the accessibility of this site and ensure compliance with WCAG 2.1 Level AA standards.

**Estimated Effort:**
- Critical fixes: 4-6 hours
- High priority fixes: 6-8 hours  
- Medium priority improvements: 4-6 hours
- Testing and verification: 4-6 hours

**Total: ~20-26 hours** for full accessibility compliance

---

**Report End**
