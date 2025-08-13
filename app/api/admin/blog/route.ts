import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import BlogPost from '@/app/models/BlogPost';
import { requireAuth } from '@/app/lib/admin-auth';

export async function GET(_request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();
    const data = await request.json();

    const post = await BlogPost.create({
      title: data.title,
      slug: data.slug || (data.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      excerpt: data.excerpt || '',
      content: data.content || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      published: !!data.published,
      publishedAt: data.published ? new Date() : undefined,
      imageUrl: data.imageUrl || undefined,
      readTime: typeof data.readTime === 'number' ? data.readTime : Math.ceil(((data.content || '').split(/\s+/).length || 0) / 200),
      views: typeof data.views === 'number' ? data.views : 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();
    const data = await request.json();
    const { id, ...updates } = data as { id: string; [key: string]: unknown };

    if (typeof updates.title === 'string' && !updates['slug']) {
      updates['slug'] = updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    if (typeof updates['content'] === 'string') {
      const words = (updates['content'] as string).split(/\s+/).length;
      updates['readTime'] = Math.ceil(words / 200);
    }

    if (typeof updates['published'] === 'boolean') {
      updates['publishedAt'] = updates['published'] ? new Date() : undefined;
    }

    const post = await BlogPost.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true });
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
