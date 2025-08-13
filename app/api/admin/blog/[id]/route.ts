import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import BlogPost from '@/app/models/BlogPost';
import { requireAuth } from '@/app/lib/admin-auth';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth();
    await connectDB();
    const post = await BlogPost.findById(params.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth();
    await connectDB();
    const id = params.id;
    const updates = await request.json();

    const updateDoc: Record<string, unknown> = { ...updates, updatedAt: new Date() };

    if (typeof updates.title === 'string' && !updates.slug) {
      updateDoc.slug = updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    if (typeof updates.content === 'string') {
      const words = (updates.content as string).split(/\s+/).length;
      updateDoc.readTime = Math.ceil(words / 200);
    }

    if (typeof updates.published === 'boolean') {
      updateDoc.publishedAt = updates.published ? new Date() : undefined;
    }

    const post = await BlogPost.findByIdAndUpdate(id, updateDoc, { new: true });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth();
    await connectDB();
    const id = params.id;

    const deleted = await BlogPost.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
