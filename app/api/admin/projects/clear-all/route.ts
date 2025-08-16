import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Project from '@/app/models/Project';

export async function DELETE() {
  try {
    // Only allow in test environment
    if (process.env.NODE_ENV !== 'test') {
      return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
    }

    await connectDB();
    
    // Delete all projects
    const result = await Project.deleteMany({});
    
    return NextResponse.json({
      message: 'All projects cleared successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error clearing projects:', error);
    return NextResponse.json({ error: 'Failed to clear projects' }, { status: 500 });
  }
}
