import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/admin-auth';
import { getProjectsData, updateProjectsData } from '../../projects/route';

// Load projects (from shared data source)
function loadProjects() {
  return getProjectsData();
}

// Save projects (to shared data source)
function saveProjects(projects: any[]) {
  try {
    updateProjectsData(projects);
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

    console.log('Deleting project with ID:', projectId);

    let projects = loadProjects();
    const originalLength = projects.length;
    projects = projects.filter((p: any) => p.id !== projectId);

    console.log(`Projects before: ${originalLength}, after: ${projects.length}`);

    if (saveProjects(projects)) {
      console.log('Project deleted successfully');
      return NextResponse.json({
        success: true,
        message: `Project ${projectId} deleted successfully`,
        remainingProjects: projects.length
      });
    } else {
      console.error('Failed to save projects after deletion');
      return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
  } catch (error) {
    console.error('Delete error:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Server error during deletion' }, { status: 500 });
  }
}
