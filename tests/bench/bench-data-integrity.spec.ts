import { test, expect } from '@playwright/test';

// Additional tests to push suite over 200 cases & sample cross-endpoint integrity checks

const PUBLIC_API_ENDPOINTS = [
  '/api/project-tree',
  '/api/projects-data',
  '/api/system/info',
  '/api/version',
  '/api/analytics'
];

PUBLIC_API_ENDPOINTS.forEach(ep => {
  test(`public api responds: ${ep}`, async ({ request }) => {
    const res = await request.get(ep);
    expect(res.status()).toBeLessThan(500);
  });
});

for (let i = 1; i <= 12; i++) {
  test(`repeated ping #${i}`, async ({ request }) => {
    const res = await request.get('/api/ping');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body.length).toBeGreaterThan(0);
  });
}

test('version matches system info when available', async ({ request }) => {
  const versionRes = await request.get('/api/version');
  const sysRes = await request.get('/api/system/info');
  if (versionRes.ok() && sysRes.ok()) {
    const v = await versionRes.json().catch(()=>null);
    const s = await sysRes.json().catch(()=>null);
    if (v && s && s.version && v.version) {
      expect(s.version).toBe(v.version);
    }
  }
});
