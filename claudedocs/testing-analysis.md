# Testing Coverage and Strategy Analysis

**Report Generated:** 2025-11-10  
**Codebase:** Astro 4 + Vue 3 + UnoCSS Personal Portfolio

---

## Executive Summary

This codebase currently has **zero test coverage**. There are no testing frameworks installed, no test files, and no automated testing beyond ESLint in the CI/CD pipeline. While the code is well-structured and TypeScript provides some type safety, critical business logic and component behavior remain untested.

**Risk Level:** 🔴 **HIGH**

---

## 1. Current Test Coverage

### Test Files
- **Unit Tests:** 0 files
- **Integration Tests:** 0 files
- **E2E Tests:** 0 files
- **Component Tests:** 0 files

### Testing Infrastructure
- **Frameworks Installed:** None
- **Test Configuration:** None found
- **Coverage Tools:** None

### Current Quality Checks
**Pre-commit Hooks** (`package.json:60-65`):
```json
"simple-git-hooks": {
  "pre-commit": "npx lint-staged"
},
"lint-staged": {
  "*": "npm run lint:fix"
}
```

**CI Pipeline** (`.github/workflows/ci.yml`):
- Runs ESLint only
- No build validation in CI (only in deploy workflow)
- No type checking step

**Deployment Workflow** (`.github/workflows/deploy.yml`):
- Runs `npm run build` which validates TypeScript types
- Build failures prevent deployment

---

## 2. Testing Gaps Analysis

### Critical Untested Areas

#### 2.1 Utility Functions (`src/utils/`)

**`posts.ts`** - HIGH PRIORITY
- **Line 4-6:** `sortPostsByDate()` - Date comparison logic
  - Edge cases: Invalid dates, missing dates, timezone handling
  - Risk: Posts could be displayed in wrong order
  
- **Line 8-12:** `getPosts()` - Content filtering and sorting
  - Draft filtering logic dependent on `import.meta.env.PROD`
  - Path-based filtering with `.includes()`
  - Risk: Draft posts leaking to production, incorrect filtering

**Recommended Tests:**
```typescript
// Example test cases needed:
- sortPostsByDate: handles equal dates
- sortPostsByDate: handles invalid dates
- getPosts: filters drafts in production
- getPosts: includes drafts in development
- getPosts: filters by path correctly
- getPosts: returns empty array when no matches
```

**`link.ts`** - MEDIUM PRIORITY
- **Line 1-7:** Link target and external link detection
  - Simple string matching with `.includes('http')`
  - Edge cases: protocol-relative URLs, mailto:, tel:, anchors
  - Risk: External links opening in wrong target, security issues

**Recommended Tests:**
```typescript
// Example test cases needed:
- getLinkTarget: handles http/https URLs
- getLinkTarget: handles relative paths
- getLinkTarget: handles protocol-relative URLs (//example.com)
- isExternalLink: handles edge cases (mailto:, tel:, #anchors)
```

#### 2.2 Vue Components (`src/components/`)

**`ListPosts.vue`** - HIGH PRIORITY

Critical Logic (`ListPosts.vue:18-40`):
```typescript
function getDate(date: string)        // Line 18-20
function getHref(post: Post)          // Line 22-26
function getTarget(post: Post)        // Line 28-32
function isSameYear(a, b)            // Line 34-36
function getYear(date)               // Line 38-40
```

**Untested Scenarios:**
- Date formatting edge cases (invalid dates, different formats)
- Redirect vs. internal link handling
- Year comparison logic for post grouping
- Empty list rendering
- Draft post indicators

**`Header.vue`** - HIGH PRIORITY

Critical Logic (`Header.vue:20-33`):
```typescript
const socialLinks = computed(() => {
  return siteConfig.socialLinks.filter((link: SocialLink) => {
    if (link.header && typeof link.header === 'boolean') {
      return link
    }
    else if (link.header && typeof link.header === 'string') {
      link.icon = link.header.includes('i-') ? link.header : link.icon
      return link
    }
    else {
      return false
    }
  })
})
```

**Testability Issues:**
- Mutating `link.icon` inside filter (side effect)
- Complex conditional logic
- Tightly coupled to `siteConfig`

**`ThemeToggle.vue`** - MEDIUM PRIORITY

Browser API Dependencies (`ThemeToggle.vue:8-44`):
- Uses `document.startViewTransition` (Chrome 111+)
- Uses `document.documentElement.animate`
- Uses `innerWidth`, `innerHeight` globals
- Uses `@vueuse/core` composables

**Testing Challenges:**
- Requires mocking View Transition API
- Requires mocking animation APIs
- Feature detection logic needs testing

#### 2.3 Composables (`src/composables/`)

**`useHeaderScroll.ts`** - HIGH PRIORITY

Complex Logic (`useHeaderScroll.ts:1-59`):
- Scroll direction detection with 150px threshold
- Throttled scroll handler (16ms, ~60fps)
- Multiple class toggle conditions
- DOM manipulation (classList)
- Event listener cleanup

**Critical Untested Scenarios:**
```typescript
// Scroll thresholds
- scroll < 150: always show header
- scroll down > 150: hide header
- scroll up > 150: show header
- scroll > 20: add blur
- scroll < 20: remove blur

// Edge cases
- Rapid scroll direction changes
- Scroll events during unmount
- Missing header element
- Initial scroll position > 100
```

**Testability Issues:**
- Directly accesses `document.querySelector('#header')`
- No dependency injection for DOM access
- Side effects in `onMounted` hard to test
- Uses `@vueuse/core` composables (need mocking)

#### 2.4 Content Schema (`src/content/config.ts`)

**Zod Schema Validation** - MEDIUM PRIORITY

Blog Schema (`config.ts:15-39`):
- Date transformation logic (Line 25-32)
  - Accepts string, number, or Date
  - Transforms to formatted string
  - Format: "MMM DD, YYYY" (e.g., "Jan 15, 2025")
- Default values (draft: false, lang: 'en-US', video: false)
- Optional fields handling

**Untested Scenarios:**
```typescript
// Date transformation edge cases
- Invalid date strings
- Future dates
- Past dates (very old content)
- Different date formats as input
- Timezone handling

// Schema validation
- Missing required fields
- Invalid field types
- Optional field combinations
```

#### 2.5 Data Validation (`src/data/`, `src/site-config.ts`)

**Static Data** - LOW PRIORITY
- `projects.ts`: TypeScript types provide compile-time validation
- `site-config.ts`: Hardcoded configuration, low risk

**Recommended:**
- Runtime validation tests to ensure data matches TypeScript types
- Link validity tests (check URLs aren't broken)

---

## 3. Testing Strategy Recommendations

### 3.1 Testing Framework Setup

#### Primary Framework: **Vitest**
**Why Vitest:**
- Native ESM support (matches Astro's module system)
- Fast, Vite-powered (same build tool as Astro)
- Vue Testing Library compatible
- Excellent TypeScript support
- Easy to configure for monorepo/hybrid projects

**Installation:**
```bash
npm install -D vitest @vitest/ui @vitest/coverage-v8
npm install -D @vue/test-utils jsdom
npm install -D @testing-library/vue @testing-library/jest-dom
```

**Configuration:** `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        'src/**/*.astro',
        'src/types.ts',
        'src/env.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
```

#### E2E Framework: **Playwright**
**Why Playwright:**
- Multi-browser support (Chromium, Firefox, WebKit)
- Fast, reliable, with auto-wait
- Great for testing Astro's SSG output
- Screenshot/video capture for debugging

**Installation:**
```bash
npm install -D @playwright/test
npx playwright install
```

---

### 3.2 Priority Testing Roadmap

#### Phase 1: Foundation (Week 1)
**Goal:** Protect critical business logic

1. **Utility Tests** (`src/utils/`)
   - ✅ `posts.ts`: sortPostsByDate, getPosts
   - ✅ `link.ts`: getLinkTarget, isExternalLink
   - **Coverage Target:** 100%
   - **Files:** `tests/unit/utils/posts.test.ts`, `tests/unit/utils/link.test.ts`

2. **Content Schema Tests** (`src/content/config.ts`)
   - ✅ Validate blog schema date transformations
   - ✅ Test default values
   - ✅ Test required vs optional fields
   - **Coverage Target:** 90%
   - **Files:** `tests/unit/content/schema.test.ts`

3. **CI Integration**
   - ✅ Add test step to `.github/workflows/ci.yml`
   - ✅ Add type checking step
   - ✅ Fail builds on test failures

**Example CI Update:**
```yaml
# .github/workflows/ci.yml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: lts/*
      - run: npm install
      - run: npm run type-check  # Add to package.json
      - run: npm run test
      - run: npm run lint

  coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3  # Optional: upload to Codecov
```

#### Phase 2: Component Testing (Week 2)
**Goal:** Test Vue component logic and rendering

1. **Pure Function Components**
   - ✅ `ListPosts.vue`: Date helpers, link generation
   - ✅ `Footer.vue`: Link rendering
   - **Coverage Target:** 80%

2. **Interactive Components**
   - ✅ `ThemeToggle.vue`: Mock browser APIs
   - ✅ `NavDrawer.vue`: State management
   - **Coverage Target:** 70%

3. **Complex Components**
   - ✅ `Header.vue`: Social link filtering, drawer integration
   - ✅ Mock `useHeaderScroll` composable
   - **Coverage Target:** 70%

**Example Component Test:**
```typescript
// tests/unit/components/ListPosts.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ListPosts from '@/components/ListPosts.vue'

describe('ListPosts', () => {
  it('renders empty state when no posts', () => {
    const wrapper = mount(ListPosts, {
      props: { list: [] }
    })
    expect(wrapper.text()).toContain('nothing here yet')
  })

  it('groups posts by year', () => {
    const posts = [
      { data: { date: 'Jan 15, 2025', title: 'Post 1' } },
      { data: { date: 'Dec 20, 2024', title: 'Post 2' } },
    ]
    const wrapper = mount(ListPosts, { props: { list: posts } })
    expect(wrapper.text()).toContain('2025')
    expect(wrapper.text()).toContain('2024')
  })

  it('renders redirect links with target="_blank"', () => {
    const posts = [
      { 
        slug: 'test',
        data: { 
          date: 'Jan 15, 2025',
          title: 'External Post',
          redirect: 'https://example.com'
        }
      }
    ]
    const wrapper = mount(ListPosts, { props: { list: posts } })
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('https://example.com')
    expect(link.attributes('target')).toBe('_blank')
  })
})
```

#### Phase 3: Composables (Week 3)
**Goal:** Test shared logic with proper mocking

1. **`useHeaderScroll.ts`**
   - Mock `@vueuse/core` composables
   - Mock DOM (querySelector, classList)
   - Test scroll thresholds
   - Test event listener cleanup
   - **Coverage Target:** 80%

**Example Composable Test:**
```typescript
// tests/unit/composables/useHeaderScroll.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useHeaderScroll } from '@/composables/useHeaderScroll'
import { ref } from 'vue'

vi.mock('@vueuse/core', () => ({
  useWindowScroll: vi.fn(() => ({ y: ref(0) })),
  useThrottleFn: vi.fn((fn) => fn),
}))

describe('useHeaderScroll', () => {
  let mockHeaderEl: HTMLElement
  
  beforeEach(() => {
    mockHeaderEl = {
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
      }
    } as any
    
    document.querySelector = vi.fn(() => mockHeaderEl)
  })

  it('adds blur class when scrolled > 100px on mount', () => {
    document.documentElement.scrollTop = 150
    useHeaderScroll()
    expect(mockHeaderEl.classList.add).toHaveBeenCalledWith('header-bg-blur')
  })

  it('does not add blur when scroll < 100px', () => {
    document.documentElement.scrollTop = 50
    useHeaderScroll()
    expect(mockHeaderEl.classList.add).not.toHaveBeenCalled()
  })
})
```

#### Phase 4: E2E Critical Flows (Week 4)
**Goal:** Test user-facing functionality

1. **Navigation**
   - ✅ Header navigation works
   - ✅ Mobile drawer opens/closes
   - ✅ Theme toggle persists

2. **Content Rendering**
   - ✅ Blog posts render correctly
   - ✅ Draft posts hidden in production build
   - ✅ Markdown content renders
   - ✅ Code blocks syntax highlighted

3. **SEO & Meta**
   - ✅ Meta tags generated correctly
   - ✅ Sitemap accessible
   - ✅ RSS feed valid

**Example E2E Test:**
```typescript
// tests/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('header navigation links work', async ({ page }) => {
    await page.goto('/')
    
    await page.click('a[href="/blog"]')
    await expect(page).toHaveURL(/\/blog/)
    
    await page.click('a[href="/projects"]')
    await expect(page).toHaveURL(/\/projects/)
  })

  test('mobile drawer opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Open drawer
    await page.click('[class*="i-ri-menu"]')
    await expect(page.locator('nav drawer')).toBeVisible()
    
    // Close drawer
    await page.click('button[aria-label="Close"]')
    await expect(page.locator('nav drawer')).not.toBeVisible()
  })

  test('theme toggle works and persists', async ({ page }) => {
    await page.goto('/')
    
    const html = page.locator('html')
    await expect(html).not.toHaveClass(/dark/)
    
    await page.click('button[aria-label*="Theme"]')
    await expect(html).toHaveClass(/dark/)
    
    // Reload page
    await page.reload()
    await expect(html).toHaveClass(/dark/)
  })
})
```

#### Phase 5: Visual Regression (Optional, Week 5)
**Goal:** Catch unintended UI changes

**Tool:** Playwright's screenshot comparison

```typescript
// tests/visual/pages.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Visual Regression', () => {
  test('homepage looks correct', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveScreenshot('homepage.png')
  })

  test('blog listing looks correct', async ({ page }) => {
    await page.goto('/blog')
    await expect(page).toHaveScreenshot('blog-listing.png')
  })

  test('dark mode looks correct', async ({ page }) => {
    await page.goto('/')
    await page.click('button[aria-label*="Theme"]')
    await expect(page).toHaveScreenshot('homepage-dark.png')
  })
})
```

---

### 3.3 Coverage Targets

| Component Type | Target | Priority |
|----------------|--------|----------|
| Utilities (`src/utils/`) | 100% | 🔴 Critical |
| Composables (`src/composables/`) | 80% | 🟡 High |
| Vue Components (logic) | 70% | 🟡 High |
| Content Schema | 90% | 🟡 High |
| Astro Components | 50% | 🟢 Medium |
| E2E Critical Flows | 100% | 🔴 Critical |
| Overall Project | 75% | Target |

---

## 4. Testability Assessment

### 4.1 Well-Designed for Testing ✅

**Utility Functions** (`src/utils/`)
- Pure functions with clear inputs/outputs
- No side effects
- Easy to test in isolation
- **Example:** `sortPostsByDate`, `getLinkTarget`

**TypeScript Types** (`src/types.ts`)
- Strong typing reduces runtime errors
- Compile-time validation
- Self-documenting interfaces

**Content Collections** (`src/content/config.ts`)
- Zod schemas provide runtime validation
- Centralized schema definitions
- Easy to test schema transformations

### 4.2 Testability Challenges ⚠️

#### Challenge 1: Tight Coupling to Browser APIs

**Problem Areas:**
- `ThemeToggle.vue`: Uses experimental View Transition API
  ```typescript
  // Line 16: Feature detection without abstraction
  if (!document.startViewTransition) {
    toggleDark()
    return
  }
  ```
- `useHeaderScroll.ts`: Direct DOM manipulation
  ```typescript
  // Line 9: Hard-coded DOM query
  const headerEl = document.querySelector('#header') as HTMLElement
  ```

**Impact:**
- Requires complex mocking setup
- Tests become brittle (coupled to DOM structure)
- Hard to test in isolation

**Solution:**
- Create abstraction layer for browser APIs
- Use dependency injection for DOM access
- Example refactor:

```typescript
// Before (hard to test)
export function useHeaderScroll() {
  const headerEl = document.querySelector('#header')
  // ...
}

// After (easy to test)
export function useHeaderScroll(
  options: {
    selector?: string
    window?: Window
  } = {}
) {
  const selector = options.selector ?? '#header'
  const win = options.window ?? window
  const headerEl = win.document.querySelector(selector)
  // ...
}

// Test
useHeaderScroll({
  window: mockWindow,
  selector: '#test-header'
})
```

#### Challenge 2: Side Effects in Computed Properties

**Problem:**
`Header.vue:20-33` - Mutating object inside filter
```typescript
const socialLinks = computed(() => {
  return siteConfig.socialLinks.filter((link: SocialLink) => {
    // ...
    link.icon = link.header.includes('i-') ? link.header : link.icon // Mutation!
    return link
  })
})
```

**Impact:**
- Filter has side effect (mutates original array)
- Violates functional programming principles
- Hard to predict behavior in tests

**Solution:**
```typescript
const socialLinks = computed(() => {
  return siteConfig.socialLinks
    .filter(link => link.header) // Pure predicate
    .map(link => ({
      ...link,
      icon: typeof link.header === 'string' && link.header.includes('i-')
        ? link.header
        : link.icon
    }))
})
```

#### Challenge 3: Import.meta.env Coupling

**Problem:**
`posts.ts:10` - Environment-dependent logic
```typescript
return (await getCollection(collection, (post) => {
  return (import.meta.env.PROD ? post.data.draft !== true : true) && ...
}))
```

**Impact:**
- Can't easily test both production and development behavior in same run
- Requires mocking Vite's import.meta.env

**Solution:**
```typescript
// Add parameter with default
export async function getPosts(
  path?: string,
  collection: PostKey = 'blog',
  options: { 
    isProd?: boolean 
  } = {}
) {
  const isProd = options.isProd ?? import.meta.env.PROD
  
  return (await getCollection(collection, (post) => {
    return (isProd ? post.data.draft !== true : true) && ...
  }))
}

// Test both modes easily
await getPosts(undefined, 'blog', { isProd: true })
await getPosts(undefined, 'blog', { isProd: false })
```

#### Challenge 4: No Separation of Concerns

**Problem:**
Components mix presentation and business logic

**Example:** `ListPosts.vue` contains date formatting logic
- Should be extracted to utility functions
- Easier to test pure functions than component methods

**Solution:**
```typescript
// src/utils/date.ts (new file)
export function formatDate(date: string | Date): string {
  return new Date(date).toISOString()
}

export function getYear(date: string | Date | number): number {
  return new Date(date).getFullYear()
}

export function isSameYear(a: Date | string | number, b: Date | string | number): boolean {
  return a && b && getYear(a) === getYear(b)
}

// tests/unit/utils/date.test.ts
describe('date utils', () => {
  it('formats dates correctly', () => {
    expect(formatDate('2025-01-15')).toBe('2025-01-15T00:00:00.000Z')
  })
})
```

### 4.3 Missing Testing Infrastructure

**No Test Helpers/Fixtures**
- Need factory functions for test data
- Need mock builders for API responses
- Example:

```typescript
// tests/fixtures/posts.ts
export function createMockPost(overrides = {}) {
  return {
    id: 'test-post',
    slug: 'test-post',
    body: '',
    collection: 'blog',
    data: {
      title: 'Test Post',
      date: 'Jan 15, 2025',
      draft: false,
      ...overrides
    }
  }
}

// Usage in tests
const post = createMockPost({ draft: true })
const posts = [
  createMockPost({ date: 'Jan 15, 2025' }),
  createMockPost({ date: 'Dec 20, 2024' })
]
```

---

## 5. CI/CD Testing Integration

### 5.1 Current State

**Pre-commit** (`.git/hooks/pre-commit`):
```bash
npx lint-staged  # Runs lint:fix on staged files
```

**CI Workflow** (`.github/workflows/ci.yml`):
- Linting only
- No build step
- No type checking
- No tests

**Deploy Workflow** (`.github/workflows/deploy.yml`):
- Build step validates TypeScript
- No explicit test step
- Failures block deployment

### 5.2 Recommended CI Pipeline

#### Updated `.github/workflows/ci.yml`
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Unit tests
        run: npm run test
      
      - name: Build
        run: npm run build

  coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate coverage
        run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          fail_ci_if_error: false

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Build site
        run: npm run build
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

#### Updated `package.json` scripts
```json
{
  "scripts": {
    "dev": "astro dev --host",
    "build": "astro build",
    "preview": "astro preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "release": "bumpp"
  }
}
```

### 5.3 Pre-commit Hook Enhancement

**Updated `.simple-git-hooks` and `lint-staged`:**
```json
{
  "simple-git-hooks": {
    "pre-commit": "npx lint-staged"
  },
  "lint-staged": {
    "*.{ts,vue,astro}": [
      "eslint --fix",
      "vitest related --run"
    ]
  }
}
```

This runs tests related to staged files before commit.

### 5.4 Branch Protection Rules

**Recommended GitHub settings:**
1. Require status checks to pass:
   - `quality` job
   - `coverage` job (optional, can be non-blocking)
   - `e2e` job
2. Require branches to be up to date
3. Require signed commits (optional)

---

## 6. Quick Wins (Immediate Actions)

### Week 1 Priority List

1. **Install Vitest** (30 minutes)
   ```bash
   npm install -D vitest @vitest/ui @vitest/coverage-v8
   npm install -D @vue/test-utils jsdom
   ```

2. **Create `vitest.config.ts`** (15 minutes)
   - Copy configuration from Section 3.1

3. **Write First Test** (1 hour)
   - Test `sortPostsByDate` in `src/utils/posts.ts`
   - File: `tests/unit/utils/posts.test.ts`
   
   ```typescript
   import { describe, it, expect } from 'vitest'
   import { sortPostsByDate } from '@/utils/posts'

   describe('sortPostsByDate', () => {
     it('sorts posts by date descending', () => {
       const posts = [
         { data: { date: 'Jan 15, 2024' } },
         { data: { date: 'Dec 20, 2025' } },
         { data: { date: 'Jun 10, 2024' } },
       ] as any
       
       const sorted = posts.sort(sortPostsByDate)
       
       expect(sorted[0].data.date).toBe('Dec 20, 2025')
       expect(sorted[1].data.date).toBe('Jun 10, 2024')
       expect(sorted[2].data.date).toBe('Jan 15, 2024')
     })
   })
   ```

4. **Update CI Pipeline** (30 minutes)
   - Add `type-check` script to package.json
   - Add test step to `.github/workflows/ci.yml`

5. **Add Coverage Badge** (15 minutes)
   - Setup Codecov or similar
   - Add badge to README.md

**Total Time Investment: ~3 hours**  
**Impact: Establishes testing foundation**

---

## 7. Long-term Recommendations

### Testing Culture
1. **Test-Driven Development (TDD):** For new features, write tests first
2. **Code Review Standards:** Require tests for all PRs
3. **Documentation:** Maintain testing guidelines in `/docs/testing.md`

### Monitoring & Metrics
1. **Coverage Trends:** Track coverage over time (aim for 75%+)
2. **Test Performance:** Monitor test execution time (keep under 2 minutes)
3. **Flaky Tests:** Track and fix unreliable tests

### Advanced Testing
1. **Mutation Testing:** Use Stryker to test test quality
2. **Accessibility Testing:** Add axe-core to E2E tests
3. **Performance Testing:** Use Lighthouse CI in pipeline
4. **Security Testing:** Add npm audit to CI

---

## 8. Appendix: Testing Resources

### Documentation
- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)

### Example Test Files

#### `tests/setup.ts`
```typescript
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/vue'
import matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})
```

#### `tests/fixtures/posts.ts`
```typescript
import type { CollectionPosts } from '@/types'

export function createMockPost(overrides: Partial<CollectionPosts> = {}): CollectionPosts {
  return {
    id: 'test-post',
    slug: 'test/post',
    body: '# Test Content',
    collection: 'blog',
    data: {
      title: 'Test Post',
      date: 'Jan 15, 2025',
      description: 'Test description',
      duration: '5 min read',
      draft: false,
      lang: 'en-US',
      video: false,
      ...overrides.data
    },
    ...overrides
  } as CollectionPosts
}
```

---

## Conclusion

This codebase has a **critical testing gap** that poses risks to stability and maintainability. However, the code is generally well-structured and amenable to testing with proper setup.

**Immediate Action Required:**
1. Install Vitest and write utility tests (Week 1)
2. Add CI pipeline testing (Week 1)
3. Implement component tests (Week 2-3)

**Expected Outcomes:**
- 75% code coverage within 1 month
- Zero production bugs from untested code paths
- Faster development velocity (catch bugs earlier)
- Improved code quality and confidence in refactoring

**Next Steps:**
1. Review and approve testing framework choices
2. Allocate development time for Phase 1 implementation
3. Set up Codecov or similar coverage tracking
4. Schedule testing workshops for team alignment
