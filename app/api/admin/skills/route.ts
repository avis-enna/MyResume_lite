import { NextRequest, NextResponse } from 'next/server';
import { getSkillsData, updateSkillsData } from '../../../lib/skills-data';
import { checkAdminAuth } from '../../../lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const skillsData = await getSkillsData();
    return NextResponse.json(skillsData);
  } catch (error) {
    console.error('Error fetching skills data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    const updatedData = await updateSkillsData(updates);
    
    return NextResponse.json({
      message: 'Skills data updated successfully',
      data: updatedData
    });
  } catch (error) {
    console.error('Error updating skills data:', error);
    return NextResponse.json(
      { error: 'Failed to update skills data' },
      { status: 500 }
    );
  }
}
