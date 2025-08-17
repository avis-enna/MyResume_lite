import { Page, APIRequestContext, test as base } from '@playwright/test';

export const ADMIN_EMAIL = 'admin@admin.com';
export const ADMIN_PASSWORD = '$iva@V3nna21';

async function ensureAdminExists(request: APIRequestContext, baseURL: string) {
  const resp = await request.post(baseURL + '/api/test/setup-admin', { data: {} });
  // Accept 200 OK only
  if (resp.ok()) return;
}

export async function uiLogin(page: Page, requestCtx?: APIRequestContext, baseURL?: string) {
  // Ensure admin exists via API first for reliability
  try {
    const effectiveBase = baseURL || (page.url().startsWith('http') ? new URL(page.url()).origin : process.env.BENCH_BASE_URL || 'http://localhost:3001');
  if (requestCtx) await ensureAdminExists(requestCtx, effectiveBase);
  } catch {
    // non-fatal
  }
  await page.goto('/admin');
  await page.fill('input[name="email"]', ADMIN_EMAIL);
  await page.fill('input[name="password"]', ADMIN_PASSWORD);
  await Promise.all([
    page.waitForLoadState('networkidle').catch(()=>{}),
    page.click('button[type="submit"]')
  ]);
  // Poll for cookie & dashboard element deterministically
  const maxWait = Date.now() + 8000;
  let hasToken = false;
  while (Date.now() < maxWait) {
    const cookie = await page.context().cookies();
    hasToken = cookie.some(c => c.name === 'admin_token');
    const h1Text = await page.locator('h1').first().textContent().catch(()=>null);
    if (hasToken && /Dashboard/i.test(h1Text || '')) {
      break;
    }
    await page.waitForTimeout(250);
  }
  // If still on login page or no token, fallback to API-based login injection
  if (!hasToken || /\/admin$/.test(page.url())) {
    if (requestCtx) {
      try {
        const effectiveBase = baseURL || process.env.BENCH_BASE_URL || 'http://localhost:3001';
        const token = await apiLogin(requestCtx, effectiveBase);
        await page.context().addCookies([{ name: 'admin_token', value: token, url: effectiveBase, path: '/', httpOnly: true, sameSite: 'Strict' }]);
      } catch {}
    }
    await page.goto('/admin/dashboard');
  }
}

export async function apiLogin(request: APIRequestContext, baseURL: string) {
  await ensureAdminExists(request, baseURL);
  let res;
  for (let attempt = 0; attempt < 3; attempt++) {
    res = await request.post(baseURL + '/api/admin/login', {
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
      headers: { 'x-forwarded-for': '127.0.0.1', 'x-test-mode': 'true' }
    });
    if (res.status() !== 429) break;
    await new Promise(r => setTimeout(r, 300));
  }
  if (!res || !res.ok()) throw new Error('API login failed ' + res?.status());
  const setCookie = res.headers()['set-cookie'];
  if (!setCookie) throw new Error('No set-cookie header in login response');
  const tokenCookie = /admin_token=([^;]+)/.exec(setCookie);
  if (!tokenCookie) throw new Error('Missing admin_token cookie');
  return tokenCookie[1];
}

// Fixture that performs API login once per worker and injects cookie into each new context
export const test = base.extend<{ adminSession: string }>({
  adminSession: async ({ request, baseURL, context }, use) => {
    if (!baseURL) throw new Error('baseURL not set');
    const token = await apiLogin(request, baseURL);
    await context.addCookies([{
      name: 'admin_token', value: token, url: baseURL, path: '/', httpOnly: true, sameSite: 'Strict'
    }]);
    await use(token);
  }
});
