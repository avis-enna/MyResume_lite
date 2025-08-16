/**
 * Migration script to move skills data from JSON file to MongoDB
 * Run this once to migrate existing data
 */

import { promises as fs } from 'fs';
import path from 'path';
import { updateSkillsData } from '../app/lib/skills-mongo';

async function migrateSkillsToMongo() {
  try {
    console.log('🔄 Starting skills migration from JSON to MongoDB...');
    
    // Read existing JSON file
    const skillsFilePath = path.join(process.cwd(), 'app/data/skills.json');
    
    let skillsData;
    try {
      const fileContent = await fs.readFile(skillsFilePath, 'utf-8');
      skillsData = JSON.parse(fileContent);
      console.log('✅ Successfully read skills.json file');
    } catch (error) {
      console.log('⚠️  No existing skills.json file found, using default data');
      skillsData = {
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
    }
    
    // Save to MongoDB
    await updateSkillsData(skillsData);
    console.log('✅ Successfully migrated skills data to MongoDB');
    
    // Optionally backup the JSON file
    try {
      const backupPath = path.join(process.cwd(), 'app/data/skills.json.backup');
      await fs.copyFile(skillsFilePath, backupPath);
      console.log('✅ Created backup of skills.json');
    } catch (error) {
      console.log('⚠️  Could not create backup (file may not exist)');
    }
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateSkillsToMongo()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export { migrateSkillsToMongo };
