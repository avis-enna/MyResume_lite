import type { Reporter, TestCase, TestResult, TestError } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

interface BenchTestRecord {
  id: string;
  title: string;
  fullTitle: string;
  file: string;
  project: string | undefined;
  status: TestResult['status'];
  duration: number;
  errors?: { message?: string; stack?: string }[];
  annotations?: any[];
}

interface BenchRunSummary {
  timestamp: string;
  startedAt: number;
  finishedAt: number;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  interrupted: number;
  durationMs: number;
  tests: BenchTestRecord[];
  environment: {
    node: string;
    ci: boolean;
    baseURL: string | undefined;
  };
  coverage?: any;
}

class BenchReporter implements Reporter {
  private records: BenchTestRecord[] = [];
  private started = Date.now();

  onTestEnd(test: TestCase, result: TestResult) {
    this.records.push({
      id: test.id,
      title: test.title,
      fullTitle: test.titlePath().join(' > '),
      file: test.location.file,
      project: test.parent.project()?.name,
      status: result.status,
      duration: result.duration,
      annotations: result.annotations,
      errors: result.errors?.map((e: TestError) => ({ message: e.message, stack: e.stack }))
    });
  }

  async onEnd() {
    const finished = Date.now();
    const summary: BenchRunSummary = {
      timestamp: new Date().toISOString(),
      startedAt: this.started,
      finishedAt: finished,
      durationMs: finished - this.started,
      total: this.records.length,
      passed: this.records.filter(r => r.status === 'passed').length,
      failed: this.records.filter(r => r.status === 'failed').length,
      skipped: this.records.filter(r => r.status === 'skipped').length,
  // Playwright core statuses exclude 'flaky' in result.status; treat retries that ultimately pass as passed.
  flaky: 0,
      interrupted: this.records.filter(r => r.status === 'interrupted').length,
      tests: this.records,
      environment: {
        node: process.version,
        ci: !!process.env.CI,
        baseURL: process.env.BENCH_BASE_URL || process.env.BASE_URL || 'http://localhost:3001'
      }
    };

    const outDir = path.join(process.cwd(), 'test-results');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const line = JSON.stringify(summary);
    const jsonl = path.join(outDir, 'bench-runs.jsonl');
    fs.appendFileSync(jsonl, line + '\n');
    fs.writeFileSync(path.join(outDir, 'bench-latest.json'), JSON.stringify(summary, null, 2));
    console.log(`\n🧪 Bench run summary written: ${jsonl}`);
  }
}

export default BenchReporter;
