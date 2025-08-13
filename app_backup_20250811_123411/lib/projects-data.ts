// Shared projects data store - single source of truth with file persistence
// This ensures admin and public APIs use the exact same data reference

import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'app/data/projects.json');

// Default projects data
const defaultProjectsData = [
  {
    "id": "log-analysis",
    "title": "Log Analysis System",
    "subtitle": "Real-time monitoring platform",
    "description": "A comprehensive log analysis and monitoring system built with Java Spring Boot, featuring real-time log processing, pattern detection, and interactive visualizations.",
    "longDescription": "Enterprise-grade log analysis platform with real-time processing capabilities. Features include pattern detection, security threat analysis, performance monitoring, and interactive dashboards. Built with microservices architecture using Spring Boot, Kafka, and Elasticsearch.",
    "technologies": ["Java 17", "Spring Boot", "Kafka", "Elasticsearch", "PostgreSQL", "Docker", "React"],
    "category": "Backend System",
    "image": "/api/placeholder/400/300",
    "githubUrl": "https://github.com/avis-enna/log-analysis-system",
    "demoUrl": ""
  },
  {
    "id": "iot-monitoring",
    "title": "IoT-Based Continuous Abiotic Factor Monitoring",
    "subtitle": "Full-Stack Application with Research Publication",
    "description": "Built, tested, and deployed a full-stack, real-world application from the ground up, applying computer science knowledge of data structures and algorithms.",
    "longDescription": "Core Technologies: Java, Spring Boot, React, SQL. Built, tested, and deployed a full-stack, real-world application from the ground up, applying computer science knowledge of data structures and algorithms. Developed the backend web service using Java & Spring Boot to expose REST APIs for data ingestion and retrieval. Created a responsive user interface using JavaScript and React to visualize real-time data. Published research paper in International Journal For Multidisciplinary Research (IJFMR), May-June 2023.",
    "technologies": ["Java", "Spring Boot", "React", "SQL", "REST APIs", "JavaScript", "Data Structures", "Algorithms"],
    "category": "Full-Stack Application",
    "image": "/api/placeholder/400/300",
    "githubUrl": "#",
    "demoUrl": ""
  },
  {
    "id": "microservices-ecommerce",
    "title": "Secure E-commerce Platform",
    "subtitle": "Microservices architecture",
    "description": "Secure e-commerce platform built with microservices architecture, featuring user authentication, product management, and payment processing.",
    "longDescription": "Modern e-commerce platform designed with microservices architecture. Implements secure user authentication, product catalog management, shopping cart functionality, and integrated payment processing. Built with Spring Boot microservices and containerized with Docker.",
    "technologies": ["Spring Boot", "Docker", "PostgreSQL", "Redis", "RabbitMQ", "JWT", "OAuth2"],
    "category": "Web Application",
    "image": "/api/placeholder/400/300",
    "githubUrl": "https://github.com/avis-enna/secure-ecommerce",
    "demoUrl": ""
  },
  {
    "id": "library-management",
    "title": "Library Management System",
    "subtitle": "Database-driven application",
    "description": "Comprehensive library management system with book cataloging, member management, and advanced search functionality.",
    "longDescription": "Full-featured library management system with comprehensive book cataloging, member management, borrowing/returning functionality, and advanced search capabilities. Features automated fine calculations, reservation systems, and detailed reporting.",
    "technologies": ["Python", "Flask", "SQLite", "HTML/CSS", "JavaScript", "Bootstrap"],
    "category": "Management System",
    "image": "/api/placeholder/400/300",
    "githubUrl": "https://github.com/avis-enna/library-management",
    "demoUrl": ""
  }
];

// Load projects from file or use defaults
function loadProjectsFromFile(): any[] {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf8');
      const data = JSON.parse(fileContent);
      console.log('Projects loaded from file:', data.length, 'projects');
      return data;
    } else {
      console.log('Projects file not found, using defaults');
      saveProjectsToFile(defaultProjectsData);
      return defaultProjectsData;
    }
  } catch (error) {
    console.error('Error loading projects from file:', error);
    return defaultProjectsData;
  }
}

// Save projects to file
function saveProjectsToFile(projects: any[]): void {
  try {
    // Ensure directory exists
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(projects, null, 2));
    console.log('Projects saved to file:', projects.length, 'projects');
  } catch (error) {
    console.error('Error saving projects to file:', error);
  }
}

// Initialize projects data from file
let projectsData: any[] = loadProjectsFromFile();

// Function to get projects data
export function getProjectsData() {
  return projectsData;
}

// Function to update projects data
export function updateProjectsData(newProjects: any[]) {
  projectsData = [...newProjects];
  saveProjectsToFile(projectsData);
  console.log('Projects data updated. New count:', projectsData.length);
}

// Function to add a project
export function addProject(project: any) {
  projectsData.push(project);
  saveProjectsToFile(projectsData);
  console.log('Project added. New count:', projectsData.length);
}

// Function to update a project
export function updateProject(projectId: string, updatedProject: any) {
  const index = projectsData.findIndex(p => p.id === projectId);
  if (index !== -1) {
    projectsData[index] = updatedProject;
    saveProjectsToFile(projectsData);
    console.log('Project updated:', projectId);
  }
}

// Function to delete a project
export function deleteProject(projectId: string) {
  const originalLength = projectsData.length;
  projectsData = projectsData.filter(p => p.id !== projectId);
  const deleted = originalLength > projectsData.length;
  if (deleted) {
    saveProjectsToFile(projectsData);
  }
  console.log(`Delete project ${projectId}: ${deleted ? 'SUCCESS' : 'NOT FOUND'}. Count: ${originalLength} → ${projectsData.length}`);
  return deleted;
}
