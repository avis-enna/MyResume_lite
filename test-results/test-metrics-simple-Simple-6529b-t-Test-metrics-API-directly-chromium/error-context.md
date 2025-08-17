# Page snapshot

```yaml
- button "Open Next.js Dev Tools":
  - img
- button "Open issues overlay": 1 Issue
- navigation:
  - button "previous" [disabled]:
    - img "previous"
  - text: 1/1
  - button "next" [disabled]:
    - img "next"
- img
- link "Next.js 15.4.2 (stale) Webpack":
  - /url: https://nextjs.org/docs/messages/version-staleness
  - img
  - text: Next.js 15.4.2 (stale) Webpack
- img
- text: Build Error
- button "Copy Stack Trace":
  - img
- link "Go to related documentation":
  - /url: https://nextjs.org/docs/messages/module-not-found
  - img
- link "Learn more about enabling Node.js inspector for server code with Chrome DevTools":
  - /url: https://nextjs.org/docs/app/building-your-application/configuring/debugging#server-side-code
  - img
- paragraph: "Module not found: Can't resolve '../../../lib/auth'"
- img
- text: ./app/api/admin/metrics/route.ts (2:1)
- button "Open in editor":
  - img
- text: "Module not found: Can't resolve '../../../lib/auth' 1 | import { NextRequest, NextResponse } from 'next/server'; > 2 | import { requireAuth } from '../../../lib/auth'; | ^ 3 | import { getMetricsSummary, getMetrics } from '../../../lib/metrics'; 4 | 5 | export async function GET(request: NextRequest) {"
- link "https://nextjs.org/docs/messages/module-not-found":
  - /url: https://nextjs.org/docs/messages/module-not-found
- alert
```