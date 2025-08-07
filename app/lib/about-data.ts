// About section data management with file persistence
import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'app/data/about.json');

// Default about data structure
const defaultAboutData = {
  personal: {
    name: "Venna Venkata Siva Reddy",
    title: "Software Engineer · Cisco Systems",
    profileImage: "/profile-photo.png",
    socialLinks: {
      linkedin: "https://linkedin.com/in/sivavenna",
      github: "https://github.com/avis-enna",
      email: "vsivareddy.venna@gmail.com"
    }
  },
  bio: {
    paragraph1: "A results-driven Software Engineer with hands-on experience in migrating legacy systems to modern, cloud-native environments. Proven expertise in the full software development lifecycle, from backend development with Java/Spring Boot to frontend implementation with React.",
    paragraph2: "Specialized in Kubernetes, Docker, and GitOps workflows using Helm and FluxCD. A proactive problem-solver with unique cross-functional experience in network engineering (CCNA) and data analytics, passionate about building scalable, mission-critical software."
  },
  skillsGrid: [
    {
      id: "network-security",
      title: "Network & Security",
      description: "CCNA, CCCA certified with expertise in TCP/IP, routing, switching",
      icon: "shield"
    },
    {
      id: "full-stack",
      title: "Full Stack Development", 
      description: "Java Spring Boot, React, REST APIs, database design",
      icon: "star"
    },
    {
      id: "system-admin",
      title: "System Administration",
      description: "Linux, Windows Server, automation scripting",
      icon: "desktop"
    },
    {
      id: "devops-cloud",
      title: "DevOps & Cloud",
      description: "Docker, CI/CD, monitoring, infrastructure automation",
      icon: "check"
    }
  ],
  experienceSummary: {
    experienced: {
      title: "I've had experiences with",
      items: [
        "Network Monitoring & Analysis",
        "PostgreSQL & MongoDB", 
        "GIT, GitHub, Version Control",
        "Python & Shell Scripting",
        "Docker & Containerization",
        "System Administration",
        "Database Design",
        "REST API Development"
      ]
    },
    years: {
      title: "I have years of experience with",
      items: [
        "Network Engineering (CCNA/CCCA)",
        "Java Spring Boot",
        "TCP/IP, Routing & Switching", 
        "Linux System Administration",
        "Security Implementation",
        "Performance Optimization",
        "Enterprise System Design",
        "Network Troubleshooting"
      ]
    },
    current: {
      title: "I work and study about",
      items: [
        "Cloud Technologies (AWS, Azure)",
        "Microservices Architecture",
        "DevOps & CI/CD Practices",
        "Network Security & Compliance",
        "IoT & Real-time Systems",
        "Log Analysis & Monitoring",
        "Automation & Orchestration",
        "Modern Web Technologies"
      ]
    }
  }
};

// Load about data from file or use defaults
function loadAboutFromFile(): any {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf8');
      const data = JSON.parse(fileContent);
      console.log('About data loaded from file');
      return data;
    } else {
      console.log('About file not found, using defaults');
      saveAboutToFile(defaultAboutData);
      return defaultAboutData;
    }
  } catch (error) {
    console.error('Error loading about data from file:', error);
    return defaultAboutData;
  }
}

// Save about data to file
function saveAboutToFile(aboutData: any): void {
  try {
    // Ensure directory exists
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(aboutData, null, 2));
    console.log('About data saved to file');
  } catch (error) {
    console.error('Error saving about data to file:', error);
  }
}

// Initialize about data from file
let aboutData: any = loadAboutFromFile();

// Function to get about data
export function getAboutData() {
  return aboutData;
}

// Function to update about data
export function updateAboutData(newAboutData: any) {
  aboutData = { ...newAboutData };
  saveAboutToFile(aboutData);
  console.log('About data updated');
}

// Function to update specific section
export function updateAboutSection(section: string, sectionData: any) {
  aboutData[section] = sectionData;
  saveAboutToFile(aboutData);
  console.log('About section updated:', section);
}
