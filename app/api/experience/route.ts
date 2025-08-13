import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Experience from '@/app/models/Experience';

export async function GET() {
  try {
    await connectDB();
    const experiences = await Experience.find().sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: experiences
    });
  } catch (error) {
    console.error('Experience API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch experiences'
    }, { status: 500 });
  }
}
