'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  publishedAt?: string;
  tags: string[];
  views: number;
  createdAt: string;
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/session-check');
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.authenticated) {
        router.push('/admin');
      }
    } catch (_err) {
      router.push('/admin');
    }
  }, [router]);

  const loadPosts = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/blog');
      if (response.ok) {
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    loadPosts();
  }, [checkAuth, loadPosts]);

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter(post => post._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const togglePublish = async (id: string, published: boolean) => {
    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !published }),
      });

      if (response.ok) {
        setPosts(posts.map(post => 
          post._id === id 
            ? { ...post, published: !published, publishedAt: !published ? new Date().toISOString() : undefined }
            : post
        ));
      }
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                ← Back to Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Manage Blog Posts</h1>
            </div>
            <Link href="/admin/blog/new" className="btn-primary">
              Write New Post
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts</h3>
              <p className="text-gray-600 mb-6">Get started by writing your first blog post.</p>
              <Link href="/admin/blog/new" className="btn-primary">
                Write New Post
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post._id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          post.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Slug: /{post.slug}</span>
                        <span>Views: {post.views}</span>
                        <span>
                          {post.published && post.publishedAt 
                            ? `Published: ${new Date(post.publishedAt).toLocaleDateString()}`
                            : `Created: ${new Date(post.createdAt).toLocaleDateString()}`
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => togglePublish(post._id, post.published)}
                        className={`text-sm px-3 py-1 rounded ${
                          post.published
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {post.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <Link
                        href={`/admin/blog/${post._id}/edit`}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deletePost(post._id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {post.tags.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">Tags:</h4>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
