import connectDB from './mongodb';
import Skills from '../models/Skills';

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
    description: "Comprehensive technical skills and experience in modern software development practices."
  }
};

export async function getSkillsData(): Promise<SkillsData> {
  try {
    await connectDB();
    let skillsDoc = await Skills.findOne();
    
    if (!skillsDoc) {
      // Create default skills document if none exists
      skillsDoc = await Skills.create(defaultSkillsData);
    }
    
    return {
      skillCategories: skillsDoc.skillCategories || [],
      certifications: skillsDoc.certifications || [],
      technicalExpertise: skillsDoc.technicalExpertise || defaultSkillsData.technicalExpertise
    };
  } catch (error) {
    console.error('Error fetching skills data:', error);
    return defaultSkillsData;
  }
}

export async function updateSkillsData(updates: Partial<SkillsData>): Promise<SkillsData> {
  try {
    await connectDB();
    
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };
    
    const skillsDoc = await Skills.findOneAndUpdate(
      {}, // Find any document (should be only one)
      updateData,
      {
        new: true,
        upsert: true, // Create if doesn't exist
        runValidators: true
      }
    );
    
    return {
      skillCategories: skillsDoc.skillCategories || [],
      certifications: skillsDoc.certifications || [],
      technicalExpertise: skillsDoc.technicalExpertise || defaultSkillsData.technicalExpertise
    };
  } catch (error) {
    console.error('Error updating skills data:', error);
    throw error;
  }
}

export async function updateSkillCategory(categoryId: string, updates: Partial<SkillCategory>): Promise<SkillsData> {
  try {
    await connectDB();
    
    const skillsDoc = await Skills.findOne();
    if (!skillsDoc) {
      throw new Error('Skills document not found');
    }
    
    const categoryIndex = skillsDoc.skillCategories.findIndex((cat: any) => cat.id === categoryId);
    if (categoryIndex === -1) {
      throw new Error('Skill category not found');
    }
    
    // Update the specific category
    skillsDoc.skillCategories[categoryIndex] = {
      ...skillsDoc.skillCategories[categoryIndex],
      ...updates
    };
    skillsDoc.updatedAt = new Date();
    
    await skillsDoc.save();
    
    return {
      skillCategories: skillsDoc.skillCategories || [],
      certifications: skillsDoc.certifications || [],
      technicalExpertise: skillsDoc.technicalExpertise || defaultSkillsData.technicalExpertise
    };
  } catch (error) {
    console.error('Error updating skill category:', error);
    throw error;
  }
}

export async function addSkillToCategory(categoryId: string, skill: string): Promise<SkillsData> {
  try {
    await connectDB();
    
    const skillsDoc = await Skills.findOne();
    if (!skillsDoc) {
      throw new Error('Skills document not found');
    }
    
    const categoryIndex = skillsDoc.skillCategories.findIndex((cat: any) => cat.id === categoryId);
    if (categoryIndex === -1) {
      throw new Error('Skill category not found');
    }
    
    // Add skill if it doesn't already exist
    if (!skillsDoc.skillCategories[categoryIndex].skills.includes(skill)) {
      skillsDoc.skillCategories[categoryIndex].skills.push(skill);
      skillsDoc.updatedAt = new Date();
      await skillsDoc.save();
    }
    
    return {
      skillCategories: skillsDoc.skillCategories || [],
      certifications: skillsDoc.certifications || [],
      technicalExpertise: skillsDoc.technicalExpertise || defaultSkillsData.technicalExpertise
    };
  } catch (error) {
    console.error('Error adding skill to category:', error);
    throw error;
  }
}

export async function removeSkillFromCategory(categoryId: string, skill: string): Promise<SkillsData> {
  try {
    await connectDB();
    
    const skillsDoc = await Skills.findOne();
    if (!skillsDoc) {
      throw new Error('Skills document not found');
    }
    
    const categoryIndex = skillsDoc.skillCategories.findIndex((cat: any) => cat.id === categoryId);
    if (categoryIndex === -1) {
      throw new Error('Skill category not found');
    }
    
    // Remove skill
    skillsDoc.skillCategories[categoryIndex].skills = skillsDoc.skillCategories[categoryIndex].skills.filter(
      (s: string) => s !== skill
    );
    skillsDoc.updatedAt = new Date();
    await skillsDoc.save();
    
    return {
      skillCategories: skillsDoc.skillCategories || [],
      certifications: skillsDoc.certifications || [],
      technicalExpertise: skillsDoc.technicalExpertise || defaultSkillsData.technicalExpertise
    };
  } catch (error) {
    console.error('Error removing skill from category:', error);
    throw error;
  }
}

export async function addCertification(certification: string): Promise<SkillsData> {
  try {
    await connectDB();
    
    const skillsDoc = await Skills.findOne();
    if (!skillsDoc) {
      throw new Error('Skills document not found');
    }
    
    // Add certification if it doesn't already exist
    if (!skillsDoc.certifications.includes(certification)) {
      skillsDoc.certifications.push(certification);
      skillsDoc.updatedAt = new Date();
      await skillsDoc.save();
    }
    
    return {
      skillCategories: skillsDoc.skillCategories || [],
      certifications: skillsDoc.certifications || [],
      technicalExpertise: skillsDoc.technicalExpertise || defaultSkillsData.technicalExpertise
    };
  } catch (error) {
    console.error('Error adding certification:', error);
    throw error;
  }
}

export async function removeCertification(certification: string): Promise<SkillsData> {
  try {
    await connectDB();
    
    const skillsDoc = await Skills.findOne();
    if (!skillsDoc) {
      throw new Error('Skills document not found');
    }
    
    // Remove certification
    skillsDoc.certifications = skillsDoc.certifications.filter((c: string) => c !== certification);
    skillsDoc.updatedAt = new Date();
    await skillsDoc.save();
    
    return {
      skillCategories: skillsDoc.skillCategories || [],
      certifications: skillsDoc.certifications || [],
      technicalExpertise: skillsDoc.technicalExpertise || defaultSkillsData.technicalExpertise
    };
  } catch (error) {
    console.error('Error removing certification:', error);
    throw error;
  }
}
