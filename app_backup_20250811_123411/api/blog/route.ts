import { NextResponse } from 'next/server';
import { getBlogData, getPublishedPosts } from '../../lib/blog-data';

export async function GET() {
  try {
    const posts = getPublishedPosts();
    return NextResponse.json({
      posts,
      total: posts.length
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
