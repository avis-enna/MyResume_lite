'use client';

import { useState, useEffect, useCallback, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  features: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  order?: number;
  publication?: string;
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    technologies: '',
    features: '',
    githubUrl: '',
    liveUrl: '',
    imageUrl: '',
    featured: false,
    order: 0,
  });

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/session-check');
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.authenticated) {
        router.push('/admin');
        return;
      }
      setAuthChecked(true);
    } catch {
      router.push('/admin');
    }
  }, [router]);

  const loadProject = useCallback(async () => {
    if (!projectId) return;
    try {
      const res = await fetch('/api/admin/projects');
      if (res.ok) {
        const list: Project[] = await res.json();
        const p = list.find(pr => pr._id === projectId);
        if (p) {
          setForm({
            title: p.title || '',
            description: p.description || '',
            technologies: p.technologies?.join(', ') || '',
            features: p.features?.join('\n') || '',
            githubUrl: p.githubUrl || '',
            liveUrl: p.liveUrl || '',
            imageUrl: p.imageUrl || '',
            featured: !!p.featured,
            order: p.order || 0,
          });
        } else {
          setError('Project not found');
        }
      } else {
        setError('Failed to load project');
      }
    } catch {
      setError('Network error loading project');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => { if (authChecked) loadProject(); }, [authChecked, loadProject]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as any;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        id: projectId,
        ...form,
        technologies: form.technologies.split(',').map(s => s.trim()).filter(Boolean),
        features: form.features.split('\n').map(s => s.trim()).filter(Boolean),
      };
      const res = await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push('/admin/projects');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to update project');
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  if (!authChecked || loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/projects" className="text-gray-600 hover:text-gray-900">← Projects</Link>
            <h1 className="text-xl font-semibold text-gray-900">Edit Project</h1>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input name="title" aria-label="Project title" value={form.title} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" aria-label="Project description" value={form.description} onChange={handleChange} required rows={4} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Technologies (comma separated)</label>
            <input name="technologies" aria-label="Technologies" value={form.technologies} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
            <textarea name="features" aria-label="Features" value={form.features} onChange={handleChange} rows={4} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
              <input name="githubUrl" aria-label="GitHub URL" value={form.githubUrl} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Live URL</label>
              <input name="liveUrl" aria-label="Live URL" value={form.liveUrl} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input name="imageUrl" aria-label="Image URL" value={form.imageUrl} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order (number)</label>
              <input type="number" name="order" aria-label="Order" value={form.order} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input id="featured" type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="h-4 w-4" />
            <label htmlFor="featured" className="text-sm text-gray-700">Featured project</label>
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href="/admin/projects" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
