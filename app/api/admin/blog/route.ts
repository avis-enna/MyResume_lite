import { NextRequest, NextResponse } from 'next/server';
import { 
  getBlogData, 
  addBlogPost, 
  updateBlogPost, 
  deleteBlogPost,
  generateSlug,
  calculateReadingTime
} from '../../../lib/blog-data';
import { checkAdminAuthSimple } from '../../../lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuthSimple();
    if (!isAuthenticated) {
      console.error('Blog GET: Authentication failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const blogData = getBlogData();
    console.log('Blog GET: Data fetched successfully');
    return NextResponse.json(blogData);
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Blog POST: Starting create request');
    const isAuthenticated = await checkAdminAuthSimple();
    if (!isAuthenticated) {
      console.error('Blog POST: Authentication failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const postData = await request.json();
    console.log('Blog POST: Received post data:', postData.title);

    // Generate slug if not provided
    if (!postData.slug) {
      postData.slug = generateSlug(postData.title);
    }

    // Calculate reading time
    postData.readingTime = calculateReadingTime(postData.content);

    // Set timestamps
    postData.publishedAt = postData.publishedAt || new Date().toISOString();

    const newPost = addBlogPost(postData);
    console.log('Blog POST: Post created successfully');

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      post: newPost
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('Blog PUT: Starting update request');
    const isAuthenticated = await checkAdminAuthSimple();
    if (!isAuthenticated) {
      console.error('Blog PUT: Authentication failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, ...updates } = await request.json();
    console.log('Blog PUT: Updating post:', id);

    // Update reading time if content changed
    if (updates.content) {
      updates.readingTime = calculateReadingTime(updates.content);
    }

    // Update slug if title changed
    if (updates.title && !updates.slug) {
      updates.slug = generateSlug(updates.title);
    }

    const updatedPost = updateBlogPost(id, updates);
    
    if (!updatedPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    console.log('Blog PUT: Post updated successfully');
    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('Blog DELETE: Starting delete request');
    const isAuthenticated = await checkAdminAuthSimple();
    if (!isAuthenticated) {
      console.error('Blog DELETE: Authentication failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    console.log('Blog DELETE: Deleting post:', id);

    const deleted = deleteBlogPost(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    console.log('Blog DELETE: Post deleted successfully');
    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post', details: error.message },
      { status: 500 }
    );
  }
}
