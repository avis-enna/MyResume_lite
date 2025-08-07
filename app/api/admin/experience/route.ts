import { NextRequest, NextResponse } from 'next/server';
import { getExperienceData, updateExperienceData } from '../../../lib/experience-data';
import { checkAdminAuthSimple } from '../../../lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuthSimple();
    if (!isAuthenticated) {
      console.error('Experience GET: Authentication failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const experienceData = await getExperienceData();
    console.log('Experience GET: Data fetched successfully');
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
    console.log('Experience PUT: Starting update request');
    const isAuthenticated = await checkAdminAuthSimple();
    if (!isAuthenticated) {
      console.error('Experience PUT: Authentication failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    console.log('Experience PUT: Received updates:', Object.keys(updates));

    const updatedData = await updateExperienceData(updates);
    console.log('Experience PUT: Data updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Experience data updated successfully',
      data: updatedData
    });
  } catch (error) {
    console.error('Error updating experience data:', error);
    return NextResponse.json(
      { error: 'Failed to update experience data', details: error.message },
      { status: 500 }
    );
  }
}
