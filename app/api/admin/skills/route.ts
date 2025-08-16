import { NextRequest, NextResponse } from 'next/server';
import { getSkillsData, updateSkillsData } from '../../../lib/skills-mongo';
import { requireAuth } from '../../../lib/admin-auth';

export async function GET(_request: NextRequest) {
  try {
    await requireAuth();
    const skillsData = await getSkillsData();
    return NextResponse.json(skillsData);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching skills data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth();
    const updates = await request.json();
    const updatedData = await updateSkillsData(updates);
    return NextResponse.json({
      success: true,
      message: 'Skills data updated successfully',
      data: updatedData
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error updating skills data:', error);
    return NextResponse.json(
      { error: 'Failed to update skills data', details: (error as any)?.message },
      { status: 500 }
    );
  }
}
