import connectDB from './mongodb';
import Project from '../models/Project';

export interface ProjectData {
  _id?: string;
  title: string;
  description: string;
  technologies: string[];
  features: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  order: number;
  createdAt?: Date;
}

export async function getProjects(): Promise<ProjectData[]> {
  try {
    await connectDB();
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    return JSON.parse(JSON.stringify(projects)); // Serialize for Next.js
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<ProjectData[]> {
  try {
    await connectDB();
    const projects = await Project.find({ featured: true }).sort({ order: 1, createdAt: -1 });
    return JSON.parse(JSON.stringify(projects)); // Serialize for Next.js
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

export async function createProject(projectData: Omit<ProjectData, '_id' | 'createdAt'>): Promise<ProjectData | null> {
  try {
    await connectDB();
    const project = new Project(projectData);
    await project.save();
    return JSON.parse(JSON.stringify(project));
  } catch (error) {
    console.error('Error creating project:', error);
    return null;
  }
}

export async function updateProject(id: string, projectData: Partial<ProjectData>): Promise<ProjectData | null> {
  try {
    await connectDB();
    const project = await Project.findByIdAndUpdate(id, projectData, { new: true });
    return project ? JSON.parse(JSON.stringify(project)) : null;
  } catch (error) {
    console.error('Error updating project:', error);
    return null;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    await connectDB();
    await Project.findByIdAndDelete(id);
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
}
