"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: string;
  image: string;
  githubUrl?: string;
  demoUrl?: string;
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    loadProjects();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/verify');
      const data = await response.json();
      
      if (!data.authenticated) {
        router.push('/admin');
      }
    } catch (error) {
      router.push('/admin');
    }
  };

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProject = async (project: Project) => {
    setSaving(true);
    try {
      console.log('Saving project:', project);
      console.log('Action:', editingProject ? 'update' : 'create');

      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project, action: editingProject ? 'update' : 'create' }),
      });

      const data = await response.json();
      console.log('Save response:', data);

      if (response.ok) {
        console.log('Save successful, reloading projects...');
        await loadProjects();
        setEditingProject(null);
        setShowAddForm(false);
        alert(`Project ${editingProject ? 'updated' : 'created'} successfully! Total projects: ${data.projectCount || 'unknown'}`);
      } else {
        console.error('Save failed:', data);
        alert(`Failed to save project: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(`Network error while saving project: ${error}`);
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      console.log('Attempting to delete project:', projectId);

      const response = await fetch('/api/admin/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });

      const data = await response.json();
      console.log('Delete response:', data);

      if (response.ok) {
        console.log('Delete successful, reloading projects...');
        await loadProjects();
        alert(`Project deleted successfully! ${data.remainingProjects || 0} projects remaining.`);
      } else {
        console.error('Delete failed:', data);
        alert(`Failed to delete project: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Network error while deleting project: ${error}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <Link href="/admin/dashboard" className="text-purple-300 hover:text-white mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-light text-white">Projects Management</h1>
              <p className="text-gray-300">Manage your portfolio projects</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              Add New Project
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-medium text-white mb-2">{project.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{project.subtitle}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span key={tech} className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded text-xs">
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="text-gray-400 text-xs">+{project.technologies.length - 3} more</span>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingProject(project)}
                  className="bg-blue-500/20 text-blue-200 px-3 py-1 rounded text-sm hover:bg-blue-500/30 transition-all duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="bg-red-500/20 text-red-200 px-3 py-1 rounded text-sm hover:bg-red-500/30 transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Form Modal */}
        {(showAddForm || editingProject) && (
          <ProjectForm
            project={editingProject}
            onSave={saveProject}
            onCancel={() => {
              setEditingProject(null);
              setShowAddForm(false);
            }}
            saving={saving}
          />
        )}
      </main>
    </div>
  );
}

// Project Form Component
function ProjectForm({ 
  project, 
  onSave, 
  onCancel, 
  saving 
}: { 
  project: Project | null;
  onSave: (project: Project) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState<Project>(
    project || {
      id: '',
      title: '',
      subtitle: '',
      description: '',
      longDescription: '',
      technologies: [],
      category: '',
      image: '/api/placeholder/400/300',
      githubUrl: '',
      demoUrl: ''
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const projectToSave = { ...formData };
    if (!projectToSave.id) {
      projectToSave.id = projectToSave.title.toLowerCase().replace(/\s+/g, '-');
    }
    console.log('Submitting project:', projectToSave);
    onSave(projectToSave);
  };

  const handleTechnologiesChange = (value: string) => {
    setFormData({
      ...formData,
      technologies: value.split(',').map(tech => tech.trim()).filter(tech => tech)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-medium text-white mb-6">
          {project ? 'Edit Project' : 'Add New Project'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white h-20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Technologies (comma-separated)</label>
            <input
              type="text"
              value={formData.technologies.join(', ')}
              onChange={(e) => handleTechnologiesChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              placeholder="React, Node.js, TypeScript"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200"
            >
              {saving ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
