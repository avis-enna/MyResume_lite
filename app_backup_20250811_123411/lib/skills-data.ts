import { promises as fs } from 'fs';
import path from 'path';

export interface SkillCategory {
  id: string;
  title: string;
  skills: string[];
}

export interface SkillsData {
  skillCategories: SkillCategory[];
  certifications: string[];
  technicalExpertise: {
    title: string;
    description: string;
  };
}

const DATA_FILE = path.join(process.cwd(), 'app/data/skills.json');

const defaultSkillsData: SkillsData = {
  skillCategories: [
    {
      id: "cloud-devops",
      title: "Cloud & DevOps",
      skills: ["Kubernetes", "Docker", "Helm", "FluxCD", "CI/CD", "AWS", "GCP"]
    },
    {
      id: "programming",
      title: "Programming Languages",
      skills: ["Java", "Python", "JavaScript", "SQL", "Shell Scripting", "COBOL"]
    },
    {
      id: "backend",
      title: "Backend",
      skills: ["Spring Boot", "REST APIs", "SOAP Web Services", "Microservices"]
    },
    {
      id: "frontend",
      title: "Frontend",
      skills: ["React", "JavaScript", "HTML", "CSS"]
    },
    {
      id: "databases",
      title: "Databases",
      skills: ["SQL", "MongoDB", "IBM DB2", "VSAM"]
    },
    {
      id: "mainframe",
      title: "Mainframe",
      skills: ["JCL", "COBOL"]
    },
    {
      id: "networking",
      title: "Networking",
      skills: ["TCP/IP", "HTTP", "Network Device Configuration & Troubleshooting"]
    }
  ],
  certifications: [
    "Cisco Certified DevNet Associate (DEVASC)",
    "Cisco Certified Network Associate (CCNA)",
    "Cisco Certified Cybersecurity Associate (CCCA)"
  ],
  technicalExpertise: {
    title: "Technical Expertise",
    description: "A results-driven Software Engineer with hands-on experience in migrating legacy systems to modern, cloud-native environments. Proven expertise in the full software development lifecycle, from backend development with Java/Spring Boot to frontend implementation with React. Specialized in Kubernetes, Docker, and GitOps workflows using Helm and FluxCD."
  }
};

export async function getSkillsData(): Promise<SkillsData> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    console.log('Skills data loaded from file');
    return JSON.parse(data);
  } catch (error) {
    console.log('Skills file not found, using defaults');
    await saveSkillsData(defaultSkillsData);
    return defaultSkillsData;
  }
}

export async function saveSkillsData(data: SkillsData): Promise<void> {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(DATA_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    console.log('Skills data saved to file');
  } catch (error) {
    console.error('Error saving skills data:', error);
    throw error;
  }
}

export async function updateSkillsData(updates: Partial<SkillsData>): Promise<SkillsData> {
  try {
    const currentData = await getSkillsData();
    const updatedData = { ...currentData, ...updates };
    await saveSkillsData(updatedData);
    console.log('Skills data updated');
    return updatedData;
  } catch (error) {
    console.error('Error updating skills data:', error);
    throw error;
  }
}

export async function updateSkillCategory(categoryId: string, updates: Partial<SkillCategory>): Promise<SkillsData> {
  try {
    const currentData = await getSkillsData();
    const categoryIndex = currentData.skillCategories.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex === -1) {
      throw new Error(`Skill category with id ${categoryId} not found`);
    }
    
    currentData.skillCategories[categoryIndex] = {
      ...currentData.skillCategories[categoryIndex],
      ...updates
    };
    
    await saveSkillsData(currentData);
    console.log(`Skills category ${categoryId} updated`);
    return currentData;
  } catch (error) {
    console.error('Error updating skills category:', error);
    throw error;
  }
}
