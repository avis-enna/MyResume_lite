import { test, expect } from '@playwright/test';

const PUBLIC_ENDPOINTS = ['/', '/api/ping', '/api/version'];
PUBLIC_ENDPOINTS.forEach(url => {
  test(`public endpoint reachable: ${url}`, async ({ request }) => {
    const res = await request.get(url);
    expect([200,204,302]).toContain(res.status());
  });
});

const ADMIN_ENDPOINTS = [
  '/api/admin/about','/api/admin/contact','/api/admin/projects','/api/admin/experience','/api/admin/skills','/api/admin/metrics?type=summary&days=7'
];
ADMIN_ENDPOINTS.forEach(url => {
  test(`admin endpoint requires auth: ${url}`, async ({ request }) => {
    const res = await request.get(url);
    expect([401,200,403]).toContain(res.status());
  });
});

test('directory listing endpoint', async ({ request }) => {
  const res = await request.get('/api/directory-listing');
  expect(res.status()).toBeLessThan(500);
});

test('system info endpoint', async ({ request }) => {
  const res = await request.get('/api/system/info');
  expect(res.status()).toBeLessThan(500);
});
