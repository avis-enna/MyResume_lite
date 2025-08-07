import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/admin-auth';
import fs from 'fs';
import path from 'path';

const PROJECTS_FILE = path.join(process.cwd(), 'app/data/projects.json');

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(PROJECTS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load projects from JSON file
function loadProjects() {
  try {
    ensureDataDirectory();
    if (fs.existsSync(PROJECTS_FILE)) {
      const data = fs.readFileSync(PROJECTS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
}

// Save projects to JSON file
function saveProjects(projects: any[]) {
  try {
    ensureDataDirectory();
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving projects:', error);
    return false;
  }
}

export async function GET() {
  try {
    await requireAuth();
    const projects = loadProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const { project, action } = await request.json();
    
    let projects = loadProjects();
    
    if (action === 'create') {
      projects.push(project);
    } else if (action === 'update') {
      const index = projects.findIndex((p: any) => p.id === project.id);
      if (index !== -1) {
        projects[index] = project;
      }
    }
    
    if (saveProjects(projects)) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAuth();
    const { projectId } = await request.json();
    
    let projects = loadProjects();
    projects = projects.filter((p: any) => p.id !== projectId);
    
    if (saveProjects(projects)) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
