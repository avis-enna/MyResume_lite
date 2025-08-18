import { NextRequest, NextResponse } from 'next/server';
import { getSkillsData } from '@/app/lib/skills-mongo';

export async function GET(request: NextRequest) {
  try {
    const skillsData = await getSkillsData();
    return NextResponse.json(skillsData);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}
