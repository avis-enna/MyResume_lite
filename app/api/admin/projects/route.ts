import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Project from '@/app/models/Project';
import { requireAuth } from '@/app/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    await connectDB();
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });

    return NextResponse.json(projects);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    await connectDB();
    const data = await request.json();

    const project = new Project({
      title: data.title,
      description: data.description,
      technologies: data.technologies || [],
      features: data.features || [],
      githubUrl: data.githubUrl,
      liveUrl: data.liveUrl,
      imageUrl: data.imageUrl,
      featured: data.featured || false,
      publication: data.publication,
      order: data.order || 0,
    });

    await project.save();

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth();

    await connectDB();
    const data = await request.json();
    const { id, ...updateData } = data;

    const project = await Project.findByIdAndUpdate(id, updateData, { new: true });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAuth();

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    await connectDB();
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
