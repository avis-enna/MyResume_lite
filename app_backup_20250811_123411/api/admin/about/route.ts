import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'app/data/about.json');

// Simple auth check
function isAuthenticated(request: NextRequest) {
  const cookie = request.cookies.get('admin_session');
  return cookie?.value === 'true' || process.env.NODE_ENV === 'development';
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Read current data
    let currentData: any = {};
    try {
      const fileContent = fs.readFileSync(dataPath, 'utf8');
      currentData = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist, start with empty object
    }

    // Update with new data in the correct nested structure
    const updatedData = {
      ...currentData,
      personal: {
        ...currentData.personal,
        name: data.name || currentData.personal?.name || '',
        title: data.title || currentData.personal?.title || '',
        profileImage: data.profileImage || currentData.personal?.profileImage || '/profile-photo.png',
        socialLinks: {
          ...currentData.personal?.socialLinks,
          linkedin: data.linkedin || currentData.personal?.socialLinks?.linkedin || '',
          github: data.github || currentData.personal?.socialLinks?.github || '',
          email: data.email || currentData.personal?.socialLinks?.email || ''
        }
      },
      bio: {
        ...currentData.bio,
        paragraph1: data.bio1 || currentData.bio?.paragraph1 || '',
        paragraph2: data.bio2 || currentData.bio?.paragraph2 || ''
      },
      skillsGrid: data.skillsGrid || currentData.skillsGrid || [],
      experienceSummary: data.experienceSummary || currentData.experienceSummary || {},
      lastUpdated: new Date().toISOString()
    };

    // Write back to file
    fs.writeFileSync(dataPath, JSON.stringify(updatedData, null, 2));

    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    console.error('Error updating about data:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}
