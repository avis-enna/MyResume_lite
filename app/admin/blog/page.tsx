'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost, BlogData } from '../../lib/blog-data';

export default function AdminBlogPage() {
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  useEffect(() => {
    loadBlogData();
  }, []);

  // Load blog data with local storage fallback
  const loadBlogData = async () => {
    try {
      const response = await fetch('/api/admin/blog');
      if (response.ok) {
        const data = await response.json();
        setBlogData(data);
        console.log('Blog data loaded from API');
      } else {
        console.error('Failed to load from API, checking local storage backup');
        loadFromBackup();
      }
    } catch (error) {
      console.error('Error loading blog data:', error);
      loadFromBackup();
    } finally {
      setLoading(false);
    }
  };

  // Load from local storage backup
  const loadFromBackup = () => {
    try {
      const backup = localStorage.getItem('admin-blog-backup');
      if (backup) {
        const { data, timestamp } = JSON.parse(backup);
        const backupAge = Date.now() - timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (backupAge < maxAge) {
          setBlogData(data);
          console.log('Blog data loaded from local storage backup');
          alert('Loaded data from local backup. Please save to sync with server.');
        } else {
          console.log('Local backup is too old, ignoring');
        }
      }
    } catch (error) {
      console.error('Error loading from backup:', error);
    }
  };

  // Create new post
  const handleCreatePost = async (postData: Partial<BlogPost>) => {
    setSaving(true);
    
    // Save to local storage as backup
    try {
      localStorage.setItem('admin-blog-backup', JSON.stringify({
        data: blogData,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to backup to local storage:', error);
    }

    try {
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert('Blog post created successfully!');
        setShowNewPostForm(false);
        loadBlogData();
        localStorage.removeItem('admin-blog-backup');
      } else {
        alert(`Failed to create blog post: ${responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
      alert(`Error creating blog post: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Update existing post
  const handleUpdatePost = async (id: string, updates: Partial<BlogPost>) => {
    setSaving(true);

    try {
      const response = await fetch('/api/admin/blog', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert('Blog post updated successfully!');
        setEditingPost(null);
        loadBlogData();
      } else {
        alert(`Failed to update blog post: ${responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating blog post:', error);
      alert(`Error updating blog post: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Delete post
  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/admin/blog', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert('Blog post deleted successfully!');
        loadBlogData();
      } else {
        alert(`Failed to delete blog post: ${responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert(`Error deleting blog post: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!blogData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div>Failed to load blog data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Edit Blog</h1>
            <div className="flex gap-4">
              <Link
                href="/admin/dashboard"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </Link>
              <button
                type="button"
                onClick={() => setShowNewPostForm(true)}
                disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'New Post'}
              </button>
            </div>
          </div>

          {/* Blog Posts List */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Blog Posts ({blogData.posts.length})</h2>
            
            {blogData.posts.length === 0 ? (
              <p className="text-gray-400">No blog posts yet. Create your first post!</p>
            ) : (
              <div className="space-y-4">
                {blogData.posts.map((post) => (
                  <div key={post.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        <p className="text-gray-300 text-sm mt-1">{post.excerpt}</p>
                        <div className="flex gap-4 text-xs text-gray-400 mt-2">
                          <span>Status: {post.status}</span>
                          <span>Published: {new Date(post.publishedAt).toLocaleDateString()}</span>
                          <span>Reading time: {post.readingTime} min</span>
                          <span>Tags: {post.tags.join(', ')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          type="button"
                          onClick={() => setEditingPost(post)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePost(post.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostForm && (
        <BlogPostModal
          post={null}
          onSave={handleCreatePost}
          onCancel={() => setShowNewPostForm(false)}
          saving={saving}
        />
      )}

      {/* Edit Post Modal */}
      {editingPost && (
        <BlogPostModal
          post={editingPost}
          onSave={(updates) => handleUpdatePost(editingPost.id, updates)}
          onCancel={() => setEditingPost(null)}
          saving={saving}
        />
      )}
    </div>
  );
}

// Blog Post Modal Component
function BlogPostModal({
  post,
  onSave,
  onCancel,
  saving
}: {
  post: BlogPost | null;
  onSave: (postData: Partial<BlogPost>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    author: post?.author || 'Venna Venkata Siva Reddy',
    status: post?.status || 'draft',
    tags: post?.tags?.join(', ') || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    onSave(postData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {post ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                placeholder="auto-generated if empty"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 h-20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Content (Markdown)</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 h-64 font-mono text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : (post ? 'Update Post' : 'Create Post')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
