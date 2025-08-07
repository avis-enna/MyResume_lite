import { NextResponse } from 'next/server';

// Import the same data source as the admin system
// This ensures both admin and public API use the same data
let projectsData: any[] = [
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

// Function to get projects data (shared with admin API)
export function getProjectsData() {
  return projectsData;
}

// Function to update projects data (called by admin API)
export function updateProjectsData(newProjects: any[]) {
  projectsData = [...newProjects];
}

// Public API endpoint to get projects
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      projects: projectsData,
      count: projectsData.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
