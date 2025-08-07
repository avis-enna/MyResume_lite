import { NextRequest, NextResponse } from 'next/server';
import { getSkillsData, updateSkillsData } from '../../../lib/skills-data';
import { checkAdminAuthSimple } from '../../../lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuthSimple();
    if (!isAuthenticated) {
      console.error('Skills GET: Authentication failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const skillsData = await getSkillsData();
    console.log('Skills GET: Data fetched successfully');
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
    console.log('Skills PUT: Starting update request');
    const isAuthenticated = await checkAdminAuthSimple();
    if (!isAuthenticated) {
      console.error('Skills PUT: Authentication failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    console.log('Skills PUT: Received updates:', Object.keys(updates));

    const updatedData = await updateSkillsData(updates);
    console.log('Skills PUT: Data updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Skills data updated successfully',
      data: updatedData
    });
  } catch (error) {
    console.error('Error updating skills data:', error);
    return NextResponse.json(
      { error: 'Failed to update skills data', details: error.message },
      { status: 500 }
    );
  }
}
