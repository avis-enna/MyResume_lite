'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  published: boolean;
}

export default function EditBlogPost() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: '' as string,
    published: false,
  });

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/session-check');
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.authenticated) {
        router.push('/admin');
        return false;
      }
      return true;
    } catch (_err) {
      router.push('/admin');
      return false;
    }
  }, [router]);

  const loadPost = useCallback(async () => {
    if (!id) return;
    const authed = await checkAuth();
    if (!authed) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`);
      if (!res.ok) throw new Error('Failed to load');
      const post: BlogPost = await res.json();
      setForm({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        tags: (post.tags || []).join(', '),
        published: !!post.published,
      });
      setLoading(false);
    } catch (_err) {
      setError('Failed to load post');
      setLoading(false);
    }
  }, [id, checkAuth]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        title: form.title,
        slug: form.slug || undefined,
        excerpt: form.excerpt,
        content: form.content,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        published: form.published,
      };

      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/admin/blog');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || 'Failed to update post');
      }
    } catch (_err) {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading post...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Edit Post</h1>
            <button onClick={() => router.push('/admin/blog')} className="text-gray-600 hover:text-gray-900">Back</button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-6 px-4">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Enter the title of the blog post"
              aria-label="Title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (optional)</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter a custom slug for the post"
              aria-label="Slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              rows={2}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter a short excerpt of the post"
              aria-label="Excerpt"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={10}
              className="w-full border rounded px-3 py-2"
              placeholder="Write the content of the post here"
              aria-label="Content"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter tags for the post, separated by commas"
              aria-label="Tags"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="published"
              name="published"
              type="checkbox"
              checked={form.published}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              aria-label="Publish"
            />
            <label htmlFor="published" className="text-sm text-gray-700">Published</label>
          </div>

          <div>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
