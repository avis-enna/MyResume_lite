import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/auth';
import { getMetricsSummary, getMetrics } from '../../../lib/metrics';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '7');
    const type = url.searchParams.get('type') || 'summary';

    if (type === 'summary') {
      const summary = await getMetricsSummary(days);
      return NextResponse.json(summary, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    } else if (type === 'raw') {
      const metrics = await getMetrics(days);
      return NextResponse.json(metrics, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    } else {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
