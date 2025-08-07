import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/admin-auth';

// Default projects data (fallback for when file system isn't available)
const DEFAULT_PROJECTS = [
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

// In-memory storage for Vercel compatibility
let projectsData: any[] = [...DEFAULT_PROJECTS];

// Load projects (from memory or default)
function loadProjects() {
  return projectsData;
}

// Save projects (to memory)
function saveProjects(projects: any[]) {
  try {
    projectsData = [...projects];
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
