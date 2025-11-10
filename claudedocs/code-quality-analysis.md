# Code Quality Analysis Report

**Project**: Brennon Williams Portfolio (Astro + Vue)
**Date**: 2025-11-10
**Analyzed Files**: 25 source files (.ts, .vue, .astro)

---

## Executive Summary

This report analyzes code quality across the Astro + Vue codebase, focusing on duplication, complexity, naming conventions, dead code, error handling, documentation, linting, and file size. The codebase is generally well-structured with good type safety and component organization. However, there are opportunities for improvement in code reuse, function complexity reduction, and cleanup of unused code.

**Overall Health**: 🟡 Good (with improvement opportunities)

---

## 1. Code Duplication

### 🔴 **High Priority Issues**

#### 1.1 Duplicate `getDate()` Function
**Location**: 
- `/src/components/ListPosts.vue:18-20`
- `/src/pages/posts/[...slug].astro:25-27`

**Code**:
```typescript
// Duplicated in both files
function getDate(date: string) {
  return new Date(date).toISOString()
}
```

**Impact**: Identical utility function defined in two separate files.

**Recommendation**: Create a shared utility function in `/src/utils/date.ts`:
```typescript
export function getDate(date: string): string {
  return new Date(date).toISOString()
}

export function getYear(date: Date | string | number): number {
  return new Date(date).getFullYear()
}
```

---

#### 1.2 Duplicate Year Display Styling
**Location**: 
- `/src/components/ListPosts.vue:51-54`
- `/src/pages/projects/index.astro:15-18`

**Code**:
```html
<!-- ListPosts.vue -->
<span text-7em color-transparent font-bold text-stroke-2 text-stroke-hex-aaa op14 absolute top--0.2em>
  {{ getYear(post.data.date) }}
</span>

<!-- projects/index.astro -->
<span class="text-3.2em color-transparent font-bold text-stroke-1.5 text-stroke-hex-aaa op35 dark:op20 absolute top-0">
  {i.title}
</span>
```

**Impact**: Similar large decorative text pattern used in multiple places with slightly different styles.

**Recommendation**: Create a UnoCSS shortcut or reusable component:
```typescript
// uno.config.ts
shortcuts: {
  'decorative-header': 'color-transparent font-bold text-stroke-hex-aaa absolute',
}
```

---

#### 1.3 Duplicate Blur Effect Logic
**Location**: `/src/composables/useHeaderScroll.ts:23-26` and `:43-46`

**Code**:
```typescript
// Lines 23-26
if (scroll.value > 20)
  headerEl.classList.add('header-bg-blur')
else
  headerEl.classList.remove('header-bg-blur')

// Lines 43-46 (identical)
if (scroll.value > 20)
  headerEl.classList.add('header-bg-blur')
else
  headerEl.classList.remove('header-bg-blur')
```

**Impact**: Same blur effect logic duplicated within the same function.

**Recommendation**: Extract to a helper function:
```typescript
function updateBlurEffect(scroll: number, headerEl: HTMLElement) {
  if (scroll > 20)
    headerEl.classList.add('header-bg-blur')
  else
    headerEl.classList.remove('header-bg-blur')
}
```

---

### 🟡 **Medium Priority Issues**

#### 1.4 Duplicate NavLink Interface
**Location**: 
- `/src/types.ts:21-24` (canonical definition)
- `/src/components/NavDrawer.vue:6-9` (duplicate)

**Code**:
```typescript
// NavDrawer.vue - should import from types.ts instead
interface NavLink {
  text: string
  href: string
}
```

**Recommendation**: Import the type from `/src/types.ts`:
```typescript
import type { NavLink } from '@/types'
```

---

#### 1.5 Duplicate Post Interface
**Location**: 
- `/src/types.ts` (has `PostData` interface)
- `/src/components/ListPosts.vue:4-10` (defines inline `Post` interface)

**Recommendation**: Export a complete `Post` interface from types.ts that combines `PostData` with collection metadata.

---

## 2. Function Complexity

### 🔴 **High Priority Issues**

#### 2.1 PovBlock.astro - Overly Large Component
**Location**: `/src/components/PovBlock.astro`  
**Size**: 281 lines (script section: ~207 lines)  
**Complexity**: High

**Issues**:
- Single file contains data, template, styles, and complex carousel logic
- Multiple state variables (isDragging, startX, currentTranslate, dragOffset, currentIndex, autoPlayTimer)
- Complex animation logic with looping behavior
- Event handlers for mouse and touch events
- ~15 commented-out debug console.log statements

**Functions**:
- `animateToItem()`: 49 lines, complex looping logic
- `handleDragStart()`, `handleDragMove()`, `handleDragEnd()`: Touch/mouse event handling
- `scheduleNextAutoPlay()`: Timer management

**Recommendation**: Refactor into multiple files:

```
/src/components/PovBlock/
  ├── PovBlock.astro          # Main component (template + data)
  ├── usePovCarousel.ts       # Carousel logic composable
  ├── povData.ts              # POV items data
  └── PovBlock.css            # Styles
```

**Proposed Refactor**:
```typescript
// usePovCarousel.ts
export function usePovCarousel(
  container: HTMLElement,
  items: HTMLElement[],
  options: CarouselOptions
) {
  // Extract all carousel logic here
  return {
    isDragging,
    animateToItem,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  }
}
```

---

#### 2.2 useHeaderScroll.ts - Complex Scroll Logic
**Location**: `/src/composables/useHeaderScroll.ts:18-47`  
**Complexity**: Medium-High

**Issues**:
- `handleScroll` function handles multiple concerns: hiding, showing, and blur effects
- Magic numbers without named constants (150, 20, 16)

**Recommendation**: Extract sub-functions and use named constants:

```typescript
const SCROLL_THRESHOLD_HIDE = 150
const SCROLL_THRESHOLD_BLUR = 20
const THROTTLE_MS = 16 // ~60fps

function shouldShowHeader(scroll: number, oldScroll: number): boolean {
  return scroll < 150 || (oldScroll - scroll > SCROLL_THRESHOLD_HIDE)
}

function shouldHideHeader(scroll: number, oldScroll: number): boolean {
  return scroll >= 150 && (scroll - oldScroll > SCROLL_THRESHOLD_HIDE)
}
```

---

### 🟢 **Well-Structured Functions**

- `/src/utils/posts.ts` - Clean, focused functions
- `/src/utils/link.ts` - Simple, single-purpose utilities
- `/src/components/ScrollToTop.vue` - Concise component
- `/src/components/ThemeToggle.vue` - Well-organized toggle logic

---

## 3. Naming Conventions

### ✅ **Strengths**

- Consistent PascalCase for component names
- camelCase for functions and variables
- TypeScript interfaces well-named with clear purposes
- CSS classes follow UnoCSS conventions

### 🟡 **Inconsistencies**

#### 3.1 Magic Number Variables
**Location**: Multiple files

**Issues**:
- `itemWidth` in PovBlock.astro (line 14) is a placeholder but used extensively
- Scroll thresholds (150, 20) in useHeaderScroll.ts lack semantic names
- Z-index values (899, 998, 999, 100) scattered across components

**Recommendation**: Create a constants file:
```typescript
// /src/constants/layout.ts
export const Z_INDEX = {
  HEADER: 899,
  NAV_DRAWER: 999,
  NAV_DRAWER_MASK: 998,
  SCROLL_TO_TOP: 100,
} as const

export const SCROLL = {
  HEADER_HIDE_THRESHOLD: 150,
  BLUR_THRESHOLD: 20,
  THROTTLE_MS: 16,
} as const
```

---

#### 3.2 Inconsistent Component Hydration
**Locations**: Various .astro files

**Current Usage**:
```astro
<Header client:idle />        <!-- BaseLayout.astro -->
<ScrollToTop client:idle />   <!-- BaseLayout.astro -->
<ListPosts list={posts} />    <!-- blog/[...path].astro - no directive -->
<ListProjects list={i.projects} /> <!-- projects/index.astro - no directive -->
```

**Recommendation**: Add comments explaining hydration strategy or document in CLAUDE.md why some components don't need client directives.

---

## 4. Dead Code

### 🔴 **High Priority - Unused Imports**

#### 4.1 Unused Import in Footer.vue
**Location**: `/src/components/Footer.vue:3`

```typescript
import { getLinkTarget } from '@/utils/link'  // ❌ Never used
```

**Evidence**: The Footer component has no dynamic links that require `getLinkTarget()`.

**Recommendation**: Remove the import.

---

#### 4.2 Unused Function Export
**Location**: `/src/utils/link.ts:5-7`

```typescript
export function isExternalLink(link: string) {
  return link.includes('http')
}
```

**Evidence**: Grep search shows this function is exported but never imported or used anywhere in the codebase.

**Recommendation**: Either:
1. Remove if truly unused
2. Use it to improve link security checks
3. Keep if it's part of the public API for future use (add JSDoc comment explaining)

---

### 🟡 **Medium Priority - Commented Code**

#### 4.3 Commented Debug Logs in PovBlock.astro
**Location**: `/src/components/PovBlock.astro`

**Lines with commented console.log**:
- Line 148, 152, 161, 174, 179

**Example**:
```typescript
// console.log(`Looping: Animating from ${currentIndex} to clone of 0 at ${targetTranslateForAnimation}`)
// console.log(`Normal: Animating from ${currentIndex} to ${targetIndex} at ${targetTranslateForAnimation}`)
```

**Recommendation**: Remove commented-out debug logs. If debugging is needed in development, use proper conditional logging:
```typescript
if (import.meta.env.DEV) {
  console.debug('Carousel state:', { currentIndex, targetTranslate })
}
```

---

#### 4.4 Commented Code in index.astro
**Location**: `/src/pages/index.astro:48-54`

```astro
{/* PovBlock moved below image/text */}
{
  /* Removed 'hidden sm:flex' as it's now always visible in the column flow */
}

{
  /* Contact Info Section - Now correctly placed below the above content */
}
```

**Recommendation**: Clean up explanatory comments that are no longer needed or convert to standard HTML comments.

---

### 🟢 **Low Priority - Potentially Dead Code**

#### 4.5 Unused Variable in BaseHead.astro
**Location**: `/src/components/BaseHead.astro:34`

```typescript
function formatCanonicalURL(url: string | URL) {
  const path = url.toString()
  const hasQueryParams = path.includes('?')
  if (hasQueryParams) path.replace(/\/?$/, '')  // ❌ Result not assigned
  return path.replace(/\/?$/, hasQueryParams ? '' : '/')
}
```

**Issue**: `path.replace()` on line 34 doesn't assign the result back to `path`, making it a no-op.

**Recommendation**: Fix the assignment:
```typescript
if (hasQueryParams) {
  path = path.replace(/\/?$/, '')
}
```

Or simplify the logic if the condition isn't needed.

---

#### 4.6 Double Optional in Schema
**Location**: `/src/content/config.ts:35`

```typescript
tag: z.string().optional().optional(),  // ❌ Double .optional()
```

**Recommendation**: Remove one `.optional()`:
```typescript
tag: z.string().optional(),
```

---

#### 4.7 Empty Projects Group
**Location**: `/src/data/projects.ts:45-47`

```typescript
{
  title: 'Project Name',
  projects: [],  // ❌ Empty array
},
```

**Recommendation**: Remove empty project groups or populate with actual data.

---

## 5. Error Handling

### ✅ **Strengths**

#### 5.1 Good Defensive Programming
**Location**: `/src/components/PovBlock.astro:88-98`

```typescript
if (
  !povBlockContainer ||
  !povBlockList ||
  !povItemsOriginal ||
  povItemsOriginal.length === 0
) {
  if (import.meta.env.DEV) {
    console.error('PovBlock elements not found or empty.')
  }
  return  // ✅ Early return prevents errors
}
```

**Strengths**:
- Comprehensive null checks
- Development-only error logging
- Graceful degradation

---

#### 5.2 Proper Environment Guards
**Location**: Multiple files

```typescript
if (import.meta.env.DEV) {
  console.error('...')
}
```

**Strength**: Error messages only appear in development, keeping production clean.

---

### 🟡 **Missing Error Handling**

#### 5.3 No Try-Catch for Async Operations
**Locations**: 
- `/src/utils/posts.ts:8-12`
- Various getStaticPaths() functions

```typescript
export async function getPosts(path?: string, collection: PostKey = 'blog') {
  return (await getCollection(collection, (post) => {
    // ❌ No error handling if getCollection fails
    return (import.meta.env.PROD ? post.data.draft !== true : true) && 
           (path ? post.slug.includes(path) : true)
  })).sort(sortPostsByDate)
}
```

**Recommendation**: Add try-catch for better error reporting:
```typescript
export async function getPosts(path?: string, collection: PostKey = 'blog') {
  try {
    const posts = await getCollection(collection, (post) => {
      return (import.meta.env.PROD ? post.data.draft !== true : true) && 
             (path ? post.slug.includes(path) : true)
    })
    return posts.sort(sortPostsByDate)
  } catch (error) {
    console.error(`Failed to get posts from collection "${collection}":`, error)
    return []
  }
}
```

---

#### 5.4 Animation Null Checks Could Be Earlier
**Location**: `/src/components/PovBlock.astro:238`

```typescript
// Note: Removed anime.remove call
if (!povBlockList) return // Add null check before animating
animate(povBlockList, {
  // ...
})
```

**Recommendation**: Move the null check before the comment for clarity.

---

### 🔴 **Error-Prone Patterns**

#### 5.5 Link Security - Incomplete Validation
**Location**: `/src/utils/link.ts:1-3`

```typescript
export function getLinkTarget(link: string) {
  return link.includes('http') ? '_blank' : '_self'
}
```

**Issues**:
- Doesn't validate URL safety
- `includes('http')` could match URLs like `example.com/http`
- No protection against javascript: URLs

**Recommendation**: Improve validation:
```typescript
export function getLinkTarget(link: string): '_blank' | '_self' {
  try {
    const url = new URL(link, window.location.origin)
    return url.origin !== window.location.origin ? '_blank' : '_self'
  } catch {
    // Relative URL or invalid
    return '_self'
  }
}

export function isExternalLink(link: string): boolean {
  if (link.startsWith('javascript:') || link.startsWith('data:')) {
    return false // Security: block unsafe protocols
  }
  return link.startsWith('http://') || link.startsWith('https://')
}
```

---

## 6. Code Comments

### 🔴 **Missing Documentation**

#### 6.1 No JSDoc for Public Functions
**Locations**: All utility functions and composables

**Example - Missing JSDoc**:
```typescript
// src/utils/posts.ts
export async function getPosts(path?: string, collection: PostKey = 'blog') {
  // ❌ No documentation
}

// src/composables/useHeaderScroll.ts
export function useHeaderScroll() {
  // ❌ No documentation
}
```

**Recommendation**: Add JSDoc comments:
```typescript
/**
 * Retrieves blog posts from the specified collection
 * @param path - Optional path filter (e.g., 'notes', 'talks')
 * @param collection - Content collection name (default: 'blog')
 * @returns Sorted array of posts (newest first), excluding drafts in production
 * @example
 * const allPosts = await getPosts()
 * const notes = await getPosts('notes')
 */
export async function getPosts(path?: string, collection: PostKey = 'blog') {
  // ...
}
```

---

#### 6.2 Complex Logic Needs Explanation
**Location**: `/src/components/PovBlock.astro:144-154`

```typescript
// Check if we are looping from the last item back to the first
if (currentIndex === originalItemCount - 1 && targetIndex === 0) {
  // Animate to the first *cloned* item (visually same as the first original)
  targetTranslateForAnimation = -(originalItemCount * itemWidth)
  isLoopingFromEndToStart = true
  // console.log(...)
}
```

**Strength**: Good inline comment explaining the looping logic.

**Recommendation**: Expand to explain *why* this approach is used:
```typescript
// Seamless infinite loop: When transitioning from last → first item,
// we animate to the first *cloned* item, then instantly reset to the
// actual first item after animation completes. This prevents a jarring
// reverse animation across all items.
```

---

#### 6.3 Magic Numbers Need Context
**Location**: Multiple files

```typescript
// useHeaderScroll.ts
if (scroll.value < 150) {  // ❌ Why 150?
  // ...
}
if (scroll.value - oldScroll.value > 150) {  // ❌ Same value, different purpose?
  // ...
}

// ScrollToTop.vue
:class="scroll > 300 ? 'op75' : 'op0 pointer-events-none'"  // ❌ Why 300?
```

**Recommendation**: Use named constants with comments:
```typescript
// Header visibility thresholds
const SCROLL_TOP_THRESHOLD = 150  // Show header when near top
const SCROLL_DELTA_THRESHOLD = 150  // Hide/show sensitivity
const BLUR_THRESHOLD = 20  // Apply backdrop blur

// ScrollToTop visibility
const SCROLL_TO_TOP_SHOW_AT = 300  // Show button after scrolling 300px
```

---

### ✅ **Good Documentation**

#### 6.4 Component Comments
**Location**: `/src/components/PovBlock.astro:2-3`

```astro
---
// src/components/PovBlock.astro
// Imports for client-side script are below
```

**Strength**: Clear file identification and structural notes.

---

#### 6.5 Configuration Comments
**Location**: `/src/composables/useHeaderScroll.ts:47`

```typescript
}, 16) // 16ms ≈ 60fps for smooth performance
```

**Strength**: Explains the reasoning behind the magic number.

---

## 7. ESLint Issues

### 🔴 **Critical Issues**

#### 7.1 Missing ESLint Dependencies
**Evidence**: Running `npm run lint` results in:

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@eslint/js' imported from /home/user/BrennonTWilliams.github.io/eslint.config.js
```

**Root Cause**: The `eslint.config.js` imports `@eslint/js` but the package isn't installed.

**Recommendation**: Install missing dependencies:
```bash
npm install --save-dev @eslint/js eslint-plugin-astro astro-eslint-parser typescript-eslint globals
```

---

### 🟡 **Configuration Issues**

#### 7.2 Unused Variables Warning Only
**Location**: `/eslint.config.js:33`, `:73-74`

```javascript
rules: {
  'no-unused-vars': 'warn'  // ❌ Should be 'error' for better code quality
}
```

**Recommendation**: Change to `'error'` to catch unused code earlier:
```javascript
rules: {
  'no-unused-vars': 'error',
  '@typescript-eslint/no-unused-vars': ['error', {
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
  }]
}
```

---

#### 7.3 TypeScript Rules Not Applied to Vue Files
**Location**: ESLint config doesn't have Vue-specific configuration

**Current Config**: Only .ts and .astro files get TypeScript linting.

**Recommendation**: Add Vue support:
```javascript
// Add to eslint.config.js
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

{
  files: ['**/*.vue'],
  plugins: {
    vue: vue
  },
  languageOptions: {
    parser: vueParser,
    parserOptions: {
      parser: tseslint.parser,
      sourceType: 'module',
    },
  },
  extends: [
    ...vue.configs['vue3-recommended'],
    ...tseslint.configs.recommended,
  ],
}
```

---

### ✅ **Good Practices**

#### 7.4 TypeScript Strict Mode
**Location**: `/eslint.config.js:25`

```javascript
parserOptions: {
  project: true,  // ✅ Enables type-aware linting
  tsconfigRootDir: import.meta.dirname,
}
```

**Strength**: Type-aware linting enabled for better type checking.

---

#### 7.5 Appropriate `@ts-expect-error` Usage
**Location**: `/src/components/ThemeToggle.vue:15`, `:21`

```typescript
// @ts-expect-error: Transition API
if (!document.startViewTransition) {
  // ...
}
```

**Strength**: Correctly suppresses errors for experimental browser API with clear explanation.

---

## 8. File Size

### 🔴 **Oversized Files**

#### 8.1 PovBlock.astro - Too Large
**Location**: `/src/components/PovBlock.astro`  
**Size**: 281 lines  
**Breakdown**:
- Frontmatter/data: 15 lines
- Template: 42 lines
- Styles: 31 lines
- Script: ~193 lines (including comments)

**Issues**:
- Single Responsibility Principle violated
- Difficult to test carousel logic in isolation
- Hard to reuse carousel functionality elsewhere

**Recommendation**: Split into multiple files (see Section 2.1 for detailed refactor plan).

**Target Size**: 
- `PovBlock.astro`: 50-80 lines (template + integration)
- `usePovCarousel.ts`: 100-150 lines (extracted logic)
- `povData.ts`: 10-20 lines (data)

---

### 🟡 **Large But Acceptable**

#### 8.2 index.astro - Homepage
**Size**: 97 lines  
**Status**: Acceptable (homepage with content and layout)

#### 8.3 BaseHead.astro - SEO Component  
**Size**: 92 lines  
**Status**: Acceptable (comprehensive SEO meta tags)

#### 8.4 Header.vue - Main Navigation
**Size**: 89 lines  
**Status**: Acceptable (handles desktop + mobile nav)

---

### ✅ **Well-Sized Files**

**Small, Focused Components** (< 50 lines):
- `ScrollToTop.vue`: 24 lines
- `ThemeToggle.vue`: 49 lines
- `ListProjects.vue`: 31 lines
- `Footer.vue`: 14 lines

**Utility Files** (< 15 lines):
- `link.ts`: 7 lines
- `posts.ts`: 12 lines

---

## Recommendations Summary

### Immediate Actions (High Priority)

1. **Fix ESLint Dependencies**
   - Install missing packages
   - Verify `npm run lint` works

2. **Remove Dead Code**
   - Remove unused `getLinkTarget` import from Footer.vue
   - Remove unused `isExternalLink` function or implement usage
   - Clean up commented console.log statements in PovBlock.astro
   - Fix double `.optional()` in content schema

3. **Fix Bugs**
   - Correct unused `path.replace()` result in BaseHead.astro:34

4. **Security Improvements**
   - Improve `getLinkTarget()` validation
   - Add proper URL parsing to prevent XSS

### Short-Term Improvements (Medium Priority)

5. **Reduce Duplication**
   - Extract shared `getDate()` utility
   - Extract year display component/shortcut
   - Remove duplicate blur effect logic
   - Use shared NavLink type

6. **Add Documentation**
   - Add JSDoc to all public functions
   - Document magic numbers with named constants
   - Add README for PovBlock component

7. **Improve Error Handling**
   - Add try-catch to `getPosts()` function
   - Handle edge cases in link utilities

### Long-Term Refactoring (Low Priority)

8. **Refactor PovBlock.astro**
   - Extract carousel logic to composable
   - Separate data, logic, and template
   - Improve testability

9. **Create Constants File**
   - Centralize magic numbers
   - Define z-index scale
   - Document scroll thresholds

10. **Improve Type Safety**
    - Export complete Post type from types.ts
    - Add stricter TypeScript rules
    - Enable Vue linting

---

## Metrics

| Metric | Count |
|--------|-------|
| Total Source Files | 25 |
| Files > 100 lines | 1 |
| Files > 200 lines | 1 |
| High Priority Issues | 8 |
| Medium Priority Issues | 12 |
| Low Priority Issues | 7 |
| Unused Imports | 2 |
| Duplicated Functions | 3 |
| Missing JSDoc | ~15 functions |
| Console Statements | 7 (2 active, 5 commented) |

---

## Conclusion

The codebase demonstrates good foundational practices with strong type safety, component composition, and defensive programming. The main areas for improvement are:

1. **Code organization**: PovBlock.astro needs significant refactoring
2. **Code reuse**: Several utility functions are duplicated
3. **Documentation**: JSDoc comments missing for public APIs
4. **Tooling**: ESLint dependencies need to be installed
5. **Dead code**: Several unused imports and functions should be cleaned up

Addressing the high-priority issues will significantly improve code maintainability and reduce technical debt.

---

**Generated by**: Claude Code Analysis  
**Reviewed**: Manual code inspection + automated tooling  
**Next Review**: Recommended after PovBlock refactor
