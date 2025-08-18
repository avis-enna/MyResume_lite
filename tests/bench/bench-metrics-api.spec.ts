import { test, expect } from '@playwright/test';

const TYPES = ['summary','raw','paginated'];
const DAY_RANGES = [1,3,7,14,30];

test.describe('Metrics API Variants', () => {
  TYPES.forEach(type => {
    DAY_RANGES.forEach(days => {
      test(`metrics endpoint type=${type} days=${days}`, async ({ request }) => {
        const res = await request.get(`/api/admin/metrics?type=${type}&days=${days}`);
        expect(res.status(), `status for ${type}/${days}`).toBeLessThan(500);
        const body = await res.json();
        expect(body).toBeTruthy();
      });
    });
  });

  Array.from({ length: 25 }).forEach((_, i) => {
    test(`paginated metrics page iteration #${i + 1}`, async ({ request }) => {
      const page = (i % 5) + 1;
      const limit = ((i % 4) + 1) * 5;
      const res = await request.get(`/api/admin/metrics?type=paginated&days=7&page=${page}&limit=${limit}`);
      expect(res.status()).toBeLessThan(500);
      const json = await res.json();
      expect(json).toBeTruthy();
    });
  });
});
