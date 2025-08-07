import { promises as fs } from 'fs';
import path from 'path';

export interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  technologies: string[];
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  location: string;
  period: string;
  cgpa: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  status: string;
}

export interface ExperienceData {
  experiences: Experience[];
  education: Education;
  certifications: Certification[];
}

const DATA_FILE = path.join(process.cwd(), 'app/data/experience.json');

const defaultExperienceData: ExperienceData = {
  experiences: [
    {
      id: 1,
      title: "Software Engineer",
      company: "Cisco Systems",
      location: "Bengaluru, India",
      period: "August 2024 - Present",
      description: [
        "Led the migration of the IoT Control Center's core services from Docker to a scalable Kubernetes (k8s) architecture, significantly improving service reliability and deployment velocity",
        "Managed Kubernetes applications using Helm charts for packaging and deployed a GitOps workflow with FluxCD for automated, declarative continuous delivery",
        "Developed and maintained resilient Java Spring Boot microservices for the HLR-level network service, designing and exposing both REST and SOAP APIs",
        "Implemented Single Sign-On (SSO) for new services using Duo, enhancing security and streamlining user access",
        "Built and supported frontend modules in React for internal service management dashboards",
        "Leveraged CCNA certification to collaborate with the network engineering team on troubleshooting and configuring network devices",
        "Developed a data analytics tool by integrating with Jira APIs to pull, model, and visualize project data, enabling predictive insights into team productivity"
      ],
      technologies: ["Kubernetes", "Docker", "Helm", "FluxCD", "Java", "Spring Boot", "React", "REST APIs", "SOAP", "SSO", "Jira APIs"]
    },
    {
      id: 2,
      title: "Trainee",
      company: "Cognizant Technology Solutions",
      location: "Bengaluru, India",
      period: "November 2023 - May 2024",
      description: [
        "Maintained and enhanced a large-scale mainframe banking application, gaining deep experience in enterprise-level systems",
        "Developed and modified COBOL programs to implement new business logic and functionality changes",
        "Automated and optimized batch processing jobs using JCL, debugged JCL failures, and implemented changes to system-generated reports",
        "Worked extensively with core mainframe technologies including DB2 for database management and VSAM for indexed data storage"
      ],
      technologies: ["COBOL", "JCL", "DB2", "VSAM", "Mainframe", "Banking Systems"]
    }
  ],
  education: {
    degree: "Bachelor of Engineering (B.E.)",
    field: "Electronics and Telecommunication Engineering",
    institution: "Sir M Visvesvaraya Institute of Technology",
    location: "Bengaluru, India",
    period: "",
    cgpa: ""
  },
  certifications: [
    {
      name: "Cisco Certified DevNet Associate (DEVASC)",
      issuer: "Cisco",
      year: "",
      status: "Certified"
    },
    {
      name: "Cisco Certified Network Associate (CCNA)",
      issuer: "Cisco",
      year: "",
      status: "Certified"
    },
    {
      name: "Cisco Certified Cybersecurity Associate (CCCA)",
      issuer: "Cisco",
      year: "",
      status: "Certified"
    }
  ]
};

export async function getExperienceData(): Promise<ExperienceData> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    console.log('Experience data loaded from file');
    return JSON.parse(data);
  } catch (error) {
    console.log('Experience file not found, using defaults');
    await saveExperienceData(defaultExperienceData);
    return defaultExperienceData;
  }
}

export async function saveExperienceData(data: ExperienceData): Promise<void> {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(DATA_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    console.log('Experience data saved to file');
  } catch (error) {
    console.error('Error saving experience data:', error);
    throw error;
  }
}

export async function updateExperienceData(updates: Partial<ExperienceData>): Promise<ExperienceData> {
  try {
    const currentData = await getExperienceData();
    const updatedData = { ...currentData, ...updates };
    await saveExperienceData(updatedData);
    console.log('Experience data updated');
    return updatedData;
  } catch (error) {
    console.error('Error updating experience data:', error);
    throw error;
  }
}
