import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/admin-auth';
import { getProjectsData, updateProjectsData, addProject, updateProject, deleteProject } from '../../../lib/projects-data';

// Load projects (from shared data source)
function loadProjects() {
  return getProjectsData();
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

    console.log(`Admin API: ${action} project`, project.id);

    if (action === 'create') {
      addProject(project);
    } else if (action === 'update') {
      updateProject(project.id, project);
    }

    return NextResponse.json({
      success: true,
      message: `Project ${action}d successfully`,
      projectCount: getProjectsData().length
    });
  } catch (error) {
    console.error('Admin POST error:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAuth();
    const { projectId } = await request.json();

    console.log('Admin API: Deleting project with ID:', projectId);

    const deleted = deleteProject(projectId);
    const remainingCount = getProjectsData().length;

    if (deleted) {
      console.log('Admin API: Project deleted successfully');
      return NextResponse.json({
        success: true,
        message: `Project ${projectId} deleted successfully`,
        remainingProjects: remainingCount
      });
    } else {
      console.error('Admin API: Project not found for deletion');
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Admin DELETE error:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Server error during deletion' }, { status: 500 });
  }
}
