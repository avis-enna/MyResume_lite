import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Experience from '@/app/models/Experience';
import { requireAuth } from '@/app/lib/admin-auth';

export async function GET(_request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();
    const experiences = await Experience.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(experiences);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching experiences:', error);
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();
    const data = await request.json();

    const experience = new Experience({
      title: data.title,
      company: data.company,
      location: data.location,
      startDate: data.startDate,
      endDate: data.endDate,
      current: data.current ?? false,
      description: data.description || [],
      responsibilities: data.responsibilities || [],
      achievements: data.achievements || [],
      technologies: data.technologies || [],
      order: data.order || 0,
    });

    await experience.save();
    return NextResponse.json(experience, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error creating experience:', error);
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();
    const data = await request.json();
    const { id, ...updateData } = data as { id: string; [key: string]: unknown };

    const experience = await Experience.findByIdAndUpdate(id, updateData, { new: true });
    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    return NextResponse.json(experience);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error updating experience:', error);
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAuth();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Experience ID is required' }, { status: 400 });
    }

    await connectDB();
    const experience = await Experience.findByIdAndDelete(id);
    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Experience deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error deleting experience:', error);
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
