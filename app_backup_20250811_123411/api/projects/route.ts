import { NextResponse } from 'next/server';
import { getProjectsData } from '../../lib/projects-data';

// Public API endpoint to get projects
export async function GET() {
  try {
    const projects = getProjectsData();
    return NextResponse.json({
      success: true,
      projects: projects,
      count: projects.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
