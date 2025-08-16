import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Experience from '@/app/models/Experience';

export async function GET() {
  try {
    console.log('Test API: Connecting to database...');
    await connectDB();
    console.log('Test API: Database connected');
    
    console.log('Test API: Fetching experiences...');
    const experiences = await Experience.find().sort({ order: 1, createdAt: -1 });
    console.log('Test API: Found experiences:', experiences.length);
    
    return NextResponse.json({
      success: true,
      count: experiences.length,
      data: experiences
    });
  } catch (error) {
    console.error('Test API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
