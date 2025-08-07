import { NextRequest, NextResponse } from 'next/server';
import { getAboutData, updateAboutData, updateAboutSection } from '../../../lib/about-data';
import { checkAdminAuthSimple } from '../../../lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuthSimple();
    if (!isAuthenticated) {
      console.error('About GET: Authentication failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const aboutData = getAboutData();
    console.log('About GET: Data fetched successfully');
    return NextResponse.json(aboutData);
  } catch (error) {
    console.error('Error fetching about data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('About PUT: Starting update request');
    const isAuthenticated = await checkAdminAuthSimple();
    if (!isAuthenticated) {
      console.error('About PUT: Authentication failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { section, data } = body;
    console.log('About PUT: Received updates for section:', section || 'all');

    if (section) {
      // Update specific section
      updateAboutSection(section, data);
    } else {
      // Update entire about data
      updateAboutData(body);
    }

    console.log('About PUT: Data updated successfully');
    return NextResponse.json({
      success: true,
      message: section ? `${section} section updated successfully` : 'About data updated successfully'
    });
  } catch (error) {
    console.error('Error updating about data:', error);
    return NextResponse.json(
      { error: 'Failed to update about data', details: error.message },
      { status: 500 }
    );
  }
}
