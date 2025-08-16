import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Project from '@/app/models/Project';
import { requireAuth } from '@/app/lib/admin-auth';

const seedProjects = [
  {
    title: "IoT-Based Continuous Abiotic Factor Monitoring",
    description: "A full-stack, real-world application for monitoring environmental factors using IoT sensors. Built from the ground up applying computer science knowledge of data structures and algorithms.",
    technologies: ["Java", "Spring Boot", "React", "SQL", "JavaScript"],
    features: [
      "Backend web service using Java & Spring Boot to expose REST APIs for data ingestion and retrieval",
      "Responsive user interface using JavaScript and React to visualize real-time data",
      "Real-time data processing and visualization",
      "RESTful API design for sensor data management",
      "Database optimization for time-series data"
    ],
    githubUrl: "https://github.com/avis-enna/iot-monitoring",
    liveUrl: "",
    imageUrl: "",
    featured: true,
    order: 1
  },
  {
    title: "AI Chatbot Microservice",
    description: "Production-ready AI chatbot microservice with Ollama integration, featuring real-time WebSocket communication, embeddable widget, session management, and comprehensive API.",
    technologies: ["Node.js", "TypeScript", "Express.js", "Socket.io", "Ollama", "SQLite", "Docker", "WebSocket"],
    features: [
      "Real-time WebSocket communication",
      "Embeddable chat widget",
      "Session management and persistence",
      "Rate limiting and authentication",
      "Docker containerization",
      "Comprehensive REST API"
    ],
    githubUrl: "https://github.com/avis-enna/ai-chatbot-microservice",
    liveUrl: "https://reader-santa-accessories-scout.trycloudflare.com",
    imageUrl: "",
    featured: true,
    order: 2
  },
  {
    title: "Network Automation Toolkit",
    description: "Enterprise-grade network automation solution for device discovery, configuration backup, and bulk deployment with rollback capabilities.",
    technologies: ["Python", "Flask", "SNMP", "SSH", "Jinja2", "SQLite"],
    features: [
      "Automated device discovery via SNMP",
      "Configuration backup and versioning",
      "Bulk configuration deployment",
      "Rollback system for failed deployments",
      "Web-based management interface",
      "Template-based configuration generation"
    ],
    githubUrl: "https://github.com/avis-enna/network-automation",
    liveUrl: "",
    imageUrl: "",
    featured: false,
    order: 3
  }
];

export async function POST() {
  try {
    await requireAuth();
    await connectDB();

    // Check if projects already exist
    const existingProjects = await Project.countDocuments();
    if (existingProjects > 0) {
      return NextResponse.json({ 
        message: 'Projects already exist',
        count: existingProjects 
      });
    }

    // Create seed projects
    const createdProjects = await Project.insertMany(seedProjects);

    return NextResponse.json({
      message: 'Seed projects created successfully',
      count: createdProjects.length,
      projects: createdProjects
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error seeding projects:', error);
    return NextResponse.json({ error: 'Failed to seed projects' }, { status: 500 });
  }
}
