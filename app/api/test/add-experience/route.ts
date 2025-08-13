import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Experience from '@/app/models/Experience';

export async function POST(request: NextRequest) {
  try {
    console.log('Test Add Experience API: Starting...');
    await connectDB();
    console.log('Test Add Experience API: Database connected');
    
    const data = await request.json();
    console.log('Test Add Experience API: Data received:', data);

    const experience = new Experience({
      company: data.company,
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      current: data.current || false,
      description: data.description || '',
      responsibilities: data.responsibilities || [],
      achievements: data.achievements || [],
      technologies: data.technologies || [],
      location: data.location,
      order: data.order || 0,
    });

    await experience.save();
    console.log('Test Add Experience API: Experience saved successfully');

    return NextResponse.json({
      success: true,
      message: 'Experience created successfully',
      data: experience
    }, { status: 201 });
  } catch (error) {
    console.error('Test Add Experience API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
