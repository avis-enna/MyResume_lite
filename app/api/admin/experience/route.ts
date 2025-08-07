import { NextRequest, NextResponse } from 'next/server';
import { getExperienceData, updateExperienceData } from '../../../lib/experience-data';
import { checkAdminAuth } from '../../../lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const experienceData = await getExperienceData();
    return NextResponse.json(experienceData);
  } catch (error) {
    console.error('Error fetching experience data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experience data' },
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
    const updatedData = await updateExperienceData(updates);
    
    return NextResponse.json({
      message: 'Experience data updated successfully',
      data: updatedData
    });
  } catch (error) {
    console.error('Error updating experience data:', error);
    return NextResponse.json(
      { error: 'Failed to update experience data' },
      { status: 500 }
    );
  }
}
