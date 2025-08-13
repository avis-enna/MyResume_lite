import { NextResponse } from 'next/server';
import { getSkillsData } from '../../lib/skills-data';

export async function GET() {
  try {
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
