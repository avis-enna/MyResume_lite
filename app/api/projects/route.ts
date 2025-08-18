import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Project from '@/app/models/Project';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get all projects, sorted by order (featured first, then by order)
    const projects = await Project.find({})
      .sort({ featured: -1, order: 1 });
    
    return NextResponse.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
