# Security Analysis Report
**Astro + Vue Portfolio Website**  
**Generated:** 2025-11-10  
**Analyzed by:** Claude Code Security Scan

---

## Executive Summary

This security analysis examines a static Astro 4 + Vue 3 portfolio/blog website. The codebase demonstrates **good security practices** overall, particularly in content handling and XSS prevention. However, there are **critical dependency vulnerabilities** and some **missing security headers** that should be addressed.

**Risk Level:** 🟡 **MODERATE** (primarily due to outdated dependencies)

---

## 1. XSS Vulnerabilities

### ✅ Findings: LOW RISK

**Positive Security Practices:**
- ✅ No use of `v-html` in Vue components
- ✅ No `innerHTML` or `dangerouslySetInnerHTML` usage
- ✅ Proper Vue template interpolation (automatic HTML escaping)
- ✅ No dynamic script injection
- ✅ All user-facing content uses safe rendering methods

**Specific File Analysis:**
```
✓ src/components/Header.vue - Safe template interpolation
✓ src/components/ListPosts.vue - Escaped {{ }} bindings
✓ src/components/ListProjects.vue - Escaped text/description
✓ src/components/Footer.vue - Safe author rendering
✓ src/pages/posts/[...slug].astro - Content rendered via <Content /> component
```

**Recommendation:** No changes needed for XSS protection in templates.

---

## 2. Content Injection

### ✅ Findings: LOW RISK

**Content Security:**
- ✅ Markdown/MDX content processed through Astro's built-in sanitization
- ✅ Content collections use Zod schema validation (`src/content/config.ts`)
- ✅ No user-generated content at runtime
- ✅ Static site generation prevents dynamic injection

**Content Schema Validation:**
```typescript
// src/content/config.ts
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    // ... all fields validated
  }),
})
```

**Markdown Processing:**
```typescript
// astro.config.ts - Uses safe defaults
markdown: {
  shikiConfig: {
    themes: { light: 'github-light-default', dark: 'github-dark-default' },
    wrap: true,
  },
}
```

**Recommendation:** Content handling is secure. Continue using Astro's built-in markdown processors.

---

## 3. External Links Security

### ⚠️ Findings: MEDIUM RISK

**Issues Identified:**

| File | Line | Issue | Risk |
|------|------|-------|------|
| `src/components/Footer.vue` | 9 | Missing `rel="noopener noreferrer"` | Medium |
| `src/components/ListProjects.vue` | 20 | Missing `rel="noopener noreferrer"` | Medium |
| `src/pages/index.astro` | 68 | Missing `rel="noopener noreferrer"` | Medium |
| `src/utils/link.ts` | 1-7 | `getLinkTarget()` doesn't add rel attributes | Medium |

**Current Implementation:**
```typescript
// src/utils/link.ts - INCOMPLETE
export function getLinkTarget(link: string) {
  return link.includes('http') ? '_blank' : '_self'
}
```

**Vulnerable Code Examples:**

**Footer.vue (Line 9):**
```vue
<!-- ❌ VULNERABLE -->
<a nav-link href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">
  CC BY-NC-SA 4.0
</a>
```

**ListProjects.vue (Line 20):**
```vue
<!-- ❌ VULNERABLE -->
<a flex items-center target="_blank" :href="project.href">
```

**index.astro (Lines 64-73):**
```astro
<!-- ❌ VULNERABLE -->
{siteConfig.socialLinks.map((link) => (
  <a aria-label={link.text} href={link.href} target="_blank" class="prose-link">
    <i class:list={[link.icon]} />
    {link.text}
  </a>
))}
```

**Good Examples (for reference):**
```vue
<!-- ✅ SECURE - Header.vue line 65, 68 -->
<a :target="getLinkTarget(link.href)" :href="link.href" rel="noopener noreferrer" />
<a target="_blank" href="/rss.xml" rel="noopener noreferrer" />

<!-- ✅ SECURE - ListPosts.vue line 56 -->
<a :rel="post.data.redirect ? 'noopener noreferrer' : undefined">
```

**Security Impact:**
- **Tabnabbing Attack:** Malicious sites can access `window.opener` and redirect the original tab
- **Information Leakage:** Referrer information may be passed to external sites

**Recommendations:**

1. **Update `src/utils/link.ts`:**
```typescript
export function getLinkTarget(link: string) {
  return link.includes('http') ? '_blank' : '_self'
}

export function getLinkRel(link: string) {
  return link.includes('http') ? 'noopener noreferrer' : undefined
}
```

2. **Fix Footer.vue:**
```vue
<a nav-link href="https://creativecommons.org/licenses/by-nc-sa/4.0/" 
   target="_blank" rel="noopener noreferrer">
  CC BY-NC-SA 4.0
</a>
```

3. **Fix ListProjects.vue:**
```vue
<a flex items-center target="_blank" :href="project.href" 
   :aria-label="project.text" rel="noopener noreferrer">
```

4. **Fix index.astro:**
```astro
{siteConfig.socialLinks.map((link) => (
  <a aria-label={link.text} href={link.href} target="_blank" 
     class="prose-link" rel="noopener noreferrer">
    <i class:list={[link.icon]} />
    {link.text}
  </a>
))}
```

---

## 4. Dependency Vulnerabilities

### 🔴 Findings: HIGH RISK

**Critical Issues from npm audit:**

```
Total Vulnerabilities: 13
  - Critical: 0
  - High: 1
  - Moderate: 11
  - Low: 1
```

### High Severity

| Package | Severity | CVE/Advisory | Fix |
|---------|----------|--------------|-----|
| **devalue** | HIGH | GHSA-vj54-72f3-p5jv | Update to ≥5.3.2 |

**Details:**
- **Vulnerability:** Prototype pollution vulnerability
- **Impact:** Could allow attackers to pollute object prototypes
- **Current Version:** <5.3.2
- **Used By:** Astro framework (indirect dependency)

### Moderate Severity

#### Astro Framework
| Advisory | Description | CVSS | Fix |
|----------|-------------|------|-----|
| GHSA-xf8x-j4p2-f749 | Unauthorized third-party images in `_image` endpoint | N/A | Update to >4.16.18 |
| GHSA-5ff5-9fcw-vg88 | `X-Forwarded-Host` reflected without validation | 6.5 | Update to ≥5.14.3 |

**Current Version:** 4.11.3 → **Needs update to ≥5.14.3**

#### Vite
| Advisory | Description | CVSS | Fix |
|----------|-------------|------|-----|
| GHSA-356w-63v5-8wf4 | `server.fs.deny` bypass with invalid `request-target` | N/A | Update to ≥5.4.18 |
| GHSA-859w-5945-r5v3 | `server.fs.deny` bypass with `/` for files under project root | N/A | Update to ≥5.4.18 |
| GHSA-93m4-6634-74q7 | `server.fs.deny` bypass via backslash on Windows | N/A | Update to ≥5.4.20 |

**Note:** Vite vulnerabilities primarily affect **development server**, not production builds.

#### UnoCSS
| Package | Issue | Fix |
|---------|-------|-----|
| unocss | Indirect vulnerabilities via `unconfig` → `importx` → `esbuild` | Update to latest |

#### esbuild
| Advisory | Description | CVSS | Fix |
|----------|-------------|------|-----|
| GHSA-67mh-4wv8-2f99 | Dev server allows any website to send requests and read responses | 5.3 | Update to >0.24.2 |

### Low Severity

| Package | Advisory | Description | CVSS |
|---------|----------|-------------|------|
| brace-expansion | GHSA-v6h2-p8h4-qcjw | ReDoS vulnerability | 3.1 |

**Impact:** Regular Expression Denial of Service (ReDoS) - unlikely to be exploited in this context.

### Recommendations

**Immediate Actions:**

1. **Update all dependencies:**
```bash
npm update astro @astrojs/mdx @astrojs/vue unocss
npm audit fix
```

2. **Verify updates:**
```bash
npm audit
```

3. **Test thoroughly after updates:**
```bash
npm run dev
npm run build
npm run preview
```

**Expected Results:**
- Astro: 4.11.3 → ≥5.14.3
- UnoCSS: 0.61.0 → Latest
- All indirect dependencies should auto-update

**Production vs. Development Risk:**
- Most Vite/esbuild vulnerabilities affect **dev server only**
- Astro and devalue vulnerabilities could affect **production builds**
- Priority: Update Astro and resolve devalue dependency first

---

## 5. API/Data Exposure

### ✅ Findings: LOW RISK

**Analysis:**

**No Sensitive Data Exposure:**
- ✅ No `.env` files in repository (checked with Glob)
- ✅ No API keys or secrets in code
- ✅ `site-config.ts` contains only public information
- ✅ RSS feed (`/rss.xml`) exposes only intended public content

**Environment Variable Usage:**
```typescript
// src/utils/posts.ts (Line 10) - SAFE
import.meta.env.PROD ? post.data.draft !== true : true

// src/components/PovBlock.astro (Lines 94, 104) - SAFE  
if (import.meta.env.DEV) {
  console.error(...)
}
```

**Usage Assessment:**
- Only uses `import.meta.env.DEV` and `import.meta.env.PROD` (Astro built-ins)
- No custom environment variables
- No secret keys or tokens

**Public Data in site-config.ts:**
```typescript
export const siteConfig = {
  author: 'Brennon Williams',
  email: 'brennon@brennonw.com',  // ✅ Public contact email
  socialLinks: [/* GitHub, LinkedIn */],  // ✅ Public profiles
  // No sensitive data
}
```

**RSS Feed Analysis:**
- Endpoint: `/rss.xml` (public)
- Exposes: Blog posts, titles, descriptions (intended for public consumption)
- No leakage of draft posts (filtered in production)

**Recommendation:** No changes needed. Data exposure is appropriate for a public portfolio site.

---

## 6. Content Security Policy (CSP)

### ⚠️ Findings: MEDIUM-HIGH RISK

**Issues:**

1. **No CSP Headers Configured**
   - File: `astro.config.ts`
   - No security headers middleware
   - No CSP meta tags in `BaseHead.astro`

2. **Missing Security Headers:**
   - Content-Security-Policy
   - X-Content-Type-Options
   - X-Frame-Options
   - Referrer-Policy
   - Permissions-Policy

**Current Configuration:**
```typescript
// astro.config.ts - NO SECURITY HEADERS
export default defineConfig({
  site: 'https://brennontwilliams.github.io',
  integrations: [mdx(), sitemap(), UnoCSS(), vue()],
  // ❌ No middleware or security configuration
})
```

**Security Impact:**
- **No CSP:** Vulnerable to inline script injection if XSS occurs
- **No X-Frame-Options:** Site could be embedded in iframe (clickjacking)
- **No X-Content-Type-Options:** MIME-sniffing attacks possible

**Recommendations:**

### Option 1: GitHub Pages Headers (Recommended for this deployment)

Create `.github/workflows/deploy.yml` or use GitHub Pages settings to add headers.

**Note:** GitHub Pages has **limited header support**. For full CSP, consider alternative hosting (Netlify, Vercel, Cloudflare Pages).

### Option 2: Add CSP via Meta Tag (Limited Protection)

**Update `src/components/BaseHead.astro`:**
```astro
<!-- Add after line 43 -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self';
  frame-ancestors 'none';
">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
<meta name="referrer" content="strict-origin-when-cross-origin">
```

**Note:** `'unsafe-inline'` needed for:
- UnoCSS inline styles
- Astro inline scripts (ViewTransitions, nprogress)
- animejs in PovBlock.astro

### Option 3: Migrate to Netlify/Vercel (Best Security)

Create `netlify.toml` or `vercel.json` with proper headers:

**`netlify.toml` example:**
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; frame-ancestors 'none'"
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

**Recommended Action:**
1. Short-term: Add meta tag CSP to `BaseHead.astro`
2. Long-term: Consider migrating to Netlify/Vercel for proper header support

---

## 7. Input Validation

### ✅ Findings: LOW RISK

**Analysis:**

**No User Input Fields:**
- ✅ No `<form>` elements found (searched entire codebase)
- ✅ No `<input>` or `<textarea>` elements
- ✅ No contact forms or comment systems
- ✅ No search functionality with user input

**Content Validation:**
```typescript
// src/content/config.ts - Strong schema validation
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    duration: z.string().optional(),
    date: z.string().or(z.date()).transform(...),
    draft: z.boolean().default(false).optional(),
    tag: z.string().optional(),
    redirect: z.string().optional(),
    // ✅ All fields strictly typed with Zod
  }),
})
```

**Static Content Flow:**
1. Author writes markdown in `src/content/blog/`
2. Zod validates frontmatter against schema
3. Astro processes at **build time** (not runtime)
4. No user input possible in production

**Recommendation:** No changes needed. The static nature of the site eliminates runtime input validation concerns.

---

## 8. Additional Security Considerations

### Client-Side Code Analysis

**PovBlock.astro (Interactive Carousel):**
```typescript
// Lines 75-281 - Client-side JavaScript
// ✅ No eval() or Function() calls
// ✅ No dynamic code execution
// ✅ Uses animejs library (reputable)
// ✅ Proper event listener cleanup
```

**Event Handlers:**
- ✅ All event handlers use TypeScript type safety
- ✅ No string-based event handlers (e.g., `onclick="..."`)
- ✅ Proper use of `addEventListener` with passive/capture options

**Third-Party Scripts:**
```typescript
// BaseHead.astro - nprogress for page transitions
import nprogress from 'nprogress'
// ✅ Installed via npm (not CDN)
// ✅ Version controlled in package.json
```

**Recommendations:**
- ✅ Current implementation is secure
- Consider adding Subresource Integrity (SRI) if using CDN in future

### HTTPS/Transport Security

**Configuration:**
```typescript
// astro.config.ts
site: 'https://brennontwilliams.github.io'
```

- ✅ Site configured for HTTPS
- ✅ GitHub Pages enforces HTTPS by default
- ⚠️ No HSTS (HTTP Strict Transport Security) header - requires GitHub Pages configuration

**Recommendation:**
- GitHub Pages automatically enforces HTTPS
- No additional action needed unless migrating to custom hosting

---

## 9. Authentication & Authorization

### ✅ Findings: NOT APPLICABLE

- ✅ No authentication system
- ✅ No user accounts or sessions
- ✅ No admin panel or CMS
- ✅ Static site with no protected content

**Recommendation:** N/A for this project type.

---

## 10. Server-Side Security

### ✅ Findings: MINIMAL RISK

**Static Site Generation:**
- ✅ No server-side code execution in production
- ✅ No database connections
- ✅ No API endpoints (except static RSS)
- ✅ All pages pre-rendered at build time

**Development Server:**
- ⚠️ Vite dev server has known vulnerabilities (see Section 4)
- ✅ Dev server should never be exposed to public internet
- ✅ Production builds unaffected

**RSS Generation:**
```typescript
// src/pages/rss.xml.ts
export async function GET(context: Context) {
  const posts = await getPosts()
  return rss({ /* safe static data */ })
}
```
- ✅ No user input
- ✅ Only exposes public blog content
- ✅ Generated at build time

**Recommendation:** Continue using SSG. Ensure dev server runs only on localhost.

---

## Priority Action Items

### 🔴 Critical (Fix Immediately)

1. **Update Dependencies**
   ```bash
   npm update astro @astrojs/mdx @astrojs/vue unocss
   npm audit fix
   ```
   - **Files Affected:** `package.json`, `package-lock.json`
   - **Risk:** High/Moderate vulnerabilities in Astro, Vite, devalue
   - **Effort:** 15 minutes + testing

### 🟡 High Priority (Fix This Week)

2. **Add `rel="noopener noreferrer"` to External Links**
   - **Files to Fix:**
     - `src/components/Footer.vue` (line 9)
     - `src/components/ListProjects.vue` (line 20)
     - `src/pages/index.astro` (line 68)
   - **Risk:** Tabnabbing attacks
   - **Effort:** 5 minutes

3. **Add Security Headers**
   - **File:** `src/components/BaseHead.astro`
   - **Add:** CSP meta tags (see Section 6)
   - **Risk:** XSS, clickjacking, MIME sniffing
   - **Effort:** 10 minutes

### 🟢 Medium Priority (Fix This Month)

4. **Consider Hosting Migration**
   - **Options:** Netlify, Vercel, Cloudflare Pages
   - **Benefit:** Proper HTTP header support for CSP
   - **Effort:** 30-60 minutes

5. **Add Security Testing to CI/CD**
   - Add `npm audit` to GitHub Actions
   - Fail builds on high/critical vulnerabilities
   - **Effort:** 15 minutes

---

## Security Checklist

| Category | Status | Notes |
|----------|--------|-------|
| ✅ XSS Prevention | **PASS** | No unsafe HTML rendering |
| ✅ Content Injection | **PASS** | Proper markdown sanitization |
| ⚠️ External Links | **PARTIAL** | Missing rel attributes in 3 files |
| 🔴 Dependencies | **FAIL** | 13 vulnerabilities (1 high, 11 moderate) |
| ✅ Data Exposure | **PASS** | No sensitive data leakage |
| ⚠️ CSP Headers | **FAIL** | No Content Security Policy |
| ✅ Input Validation | **N/A** | No user input fields |
| ✅ HTTPS | **PASS** | Enforced by GitHub Pages |
| ✅ Authentication | **N/A** | Not applicable |
| ✅ Server Security | **PASS** | Static site generation |

---

## Testing Recommendations

### After Implementing Fixes

1. **Dependency Updates:**
   ```bash
   npm run dev  # Test locally
   npm run build  # Test production build
   npm run preview  # Test preview server
   ```

2. **External Link Security:**
   - Open browser DevTools → Network tab
   - Click external links
   - Verify `Referrer-Policy` is `no-referrer` or `strict-origin-when-cross-origin`

3. **CSP Validation:**
   - Use [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
   - Check browser console for CSP violations
   - Test with [Security Headers](https://securityheaders.com/)

4. **Automated Security Scanning:**
   ```bash
   npm audit
   npx @lhci/cli@latest collect --url=http://localhost:4321
   ```

---

## Long-Term Security Strategy

### Automation

1. **Dependabot (GitHub)**
   - Enable in repository settings
   - Auto-create PRs for dependency updates

2. **GitHub Actions Security Workflow**
   ```yaml
   # .github/workflows/security.yml
   name: Security Audit
   on: [push, pull_request]
   jobs:
     audit:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - run: npm audit --audit-level=high
   ```

3. **Scheduled Scans**
   - Run `npm audit` weekly
   - Review advisories monthly
   - Update dependencies quarterly (minimum)

### Monitoring

- Subscribe to Astro security advisories
- Monitor Vue.js security releases
- Track UnoCSS updates

---

## Conclusion

This portfolio website demonstrates **solid security fundamentals** with excellent XSS prevention and content handling. The primary concerns are:

1. **Outdated dependencies** with known vulnerabilities (especially Astro)
2. **Missing external link protections** (`rel="noopener noreferrer"`)
3. **Absence of Content Security Policy** headers

**Overall Assessment:** The site is **reasonably secure for a static portfolio**, but should address the critical dependency updates immediately. The lack of user input and server-side code significantly reduces attack surface.

**Estimated Time to Remediate:** ~60 minutes for all high-priority fixes.

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Astro Security Best Practices](https://docs.astro.build/en/guides/security/)
- [MDN: rel="noopener"](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/noopener)
- [Content Security Policy Guide](https://content-security-policy.com/)
- [npm audit documentation](https://docs.npmjs.com/cli/v10/commands/npm-audit)

---

**Report Generated by:** Claude Code Security Analysis  
**Date:** 2025-11-10  
**Version:** 1.0
