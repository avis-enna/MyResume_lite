import { NextResponse } from 'next/server';
import { getExperienceData } from '../../lib/experience-data';

export async function GET() {
  try {
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
