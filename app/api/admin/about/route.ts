import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireAuth } from '../../../lib/admin-auth';

const dataPath = path.join(process.cwd(), 'app/data/about.json');

export async function PUT(request: NextRequest) {
  try {
    await requireAuth();
    const data = await request.json();

    let currentData: any = {};
    try {
      const fileContent = fs.readFileSync(dataPath, 'utf8');
      currentData = JSON.parse(fileContent);
    } catch {
      // ignore missing file
    }

    const updatedData = {
      ...currentData,
      personal: {
        ...currentData.personal,
        name: data.name ?? currentData.personal?.name ?? '',
        title: data.title ?? currentData.personal?.title ?? '',
        profileImage: data.profileImage ?? currentData.personal?.profileImage ?? '/profile-photo.png',
        socialLinks: {
          ...currentData.personal?.socialLinks,
          linkedin: data.linkedin ?? currentData.personal?.socialLinks?.linkedin ?? '',
          github: data.github ?? currentData.personal?.socialLinks?.github ?? '',
            email: data.email ?? currentData.personal?.socialLinks?.email ?? ''
        }
      },
      bio: {
        ...currentData.bio,
        paragraph1: data.bio1 ?? currentData.bio?.paragraph1 ?? '',
        paragraph2: data.bio2 ?? currentData.bio?.paragraph2 ?? ''
      },
      skillsGrid: data.skillsGrid ?? currentData.skillsGrid ?? [],
      experienceSummary: data.experienceSummary ?? currentData.experienceSummary ?? {},
      lastUpdated: new Date().toISOString()
    };

    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify(updatedData, null, 2));

    return NextResponse.json({ success: true, data: updatedData });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error updating about data:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}
