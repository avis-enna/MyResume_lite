import { NextRequest, NextResponse } from 'next/server';
import { getAboutData, updateAboutData, updateAboutSection } from '../../../lib/about-data';
import { checkAdminAuth } from '../../../lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const aboutData = getAboutData();
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
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { section, data } = body;

    if (section) {
      // Update specific section
      updateAboutSection(section, data);
    } else {
      // Update entire about data
      updateAboutData(body);
    }

    return NextResponse.json({ 
      success: true, 
      message: section ? `${section} section updated successfully` : 'About data updated successfully' 
    });
  } catch (error) {
    console.error('Error updating about data:', error);
    return NextResponse.json(
      { error: 'Failed to update about data' },
      { status: 500 }
    );
  }
}
