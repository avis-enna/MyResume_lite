import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Experience from '@/app/models/Experience';

export async function GET() {
  try {
    console.log('TEST: Connecting to database...');
    await connectDB();
    
    console.log('TEST: Fetching experiences...');
    const experiences = await Experience.find().sort({ order: 1, createdAt: -1 });
    
    console.log('TEST: Found experiences:', experiences.length);
    console.log('TEST: First experience:', experiences[0]);
    
    return NextResponse.json({
      success: true,
      count: experiences.length,
      data: experiences,
      message: 'Test API working'
    });
  } catch (error) {
    console.error('TEST: Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      message: 'Test API failed'
    }, { status: 500 });
  }
}
