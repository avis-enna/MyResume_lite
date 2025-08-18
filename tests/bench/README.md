# Test Bench (Playwright)

Extended parameterized Playwright bench suite (>200 test cases) for broad validation.

Key Features:
- Separate config: `playwright.bench.config.ts`
- Custom reporter writes JSONL summaries to `test-results/bench-runs.jsonl` + `bench-latest.json`
- Parametric generation for authentication, CRUD, validation, metrics, health.

Run:
```
npx playwright test -c playwright.bench.config.ts
```
Env vars:
- BENCH_BASE_URL (default http://localhost:3001)
- BENCH_START_CMD custom start command

Artifacts:
- HTML report: playwright-report-bench/
- JSON Lines: test-results/bench-runs.jsonl
- Latest summary: test-results/bench-latest.json
