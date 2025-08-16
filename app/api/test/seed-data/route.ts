/**
 * Test data seeding API endpoint
 * Only available in test/development environment
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import mongoose from 'mongoose';
import { updateSkillsData } from '@/app/lib/skills-mongo';
import Project from '@/app/models/Project';

const isTestEnvironment = process.env.NODE_ENV === 'test' ||
                         process.env.PLAYWRIGHT_TEST === '1' ||
                         process.env.CI === 'true' ||
                         process.env.NODE_ENV === 'development';

// Default skills data for testing
const defaultSkillsData = {
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

// Test data
const aboutTestData = {
  name: 'John Doe',
  title: 'Senior Software Engineer',
  bio: {
    paragraph1: 'Experienced software engineer with 8+ years of expertise in full-stack development.',
    paragraph2: 'Passionate about creating scalable web applications and mentoring junior developers.'
  },
  experience: {
    years: 8,
    description: 'Specialized in React, Node.js, and cloud technologies'
  },
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB'],
  achievements: [
    'Led development of 5+ major web applications',
    'Mentored 10+ junior developers',
    'Reduced application load time by 40%'
  ]
};

const contactTestData = {
  email: 'john.doe@example.com',
  phone: '+1-555-0123',
  location: 'San Francisco, CA',
  linkedin: 'https://linkedin.com/in/johndoe',
  github: 'https://github.com/johndoe',
  website: 'https://johndoe.dev'
};

const skillsTestData = [
  { name: 'JavaScript', level: 95, category: 'Programming Languages' },
  { name: 'TypeScript', level: 90, category: 'Programming Languages' },
  { name: 'React', level: 92, category: 'Frontend Frameworks' },
  { name: 'Node.js', level: 88, category: 'Backend Technologies' },
  { name: 'MongoDB', level: 85, category: 'Databases' },
  { name: 'AWS', level: 80, category: 'Cloud Platforms' }
];

const experienceTestData = [
  {
    title: 'Senior Software Engineer',
    company: 'Tech Corp Inc.',

    description: 'Lead full-stack development team and architect scalable web applications',
    responsibilities: [
      'Design and implement complex web applications',
      'Mentor junior developers and conduct code reviews',
      'Collaborate with product managers and designers'
    ],
    achievements: [
      'Reduced application load time by 40%',
      'Led migration to microservices architecture'
    ],
    technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
    type: 'full-time',
    current: true,
    startDate: '2020-01',
    endDate: '',
    location: 'San Francisco, CA',
    order: 1
  }
];

const projectTestData = [
  {
    title: "Test Portfolio Project",
    description: "A comprehensive test project for demonstrating admin-portfolio integration with real-time updates.",
    technologies: ["React", "Node.js", "MongoDB", "TypeScript"],
    features: [
      "Real-time data synchronization",
      "Admin panel integration",
      "Responsive design",
      "Modern UI/UX"
    ],
    githubUrl: "https://github.com/test/portfolio-project",
    liveUrl: "https://test-portfolio.example.com",
    imageUrl: "",
    featured: true,
    order: 1
  },
  {
    title: "API Testing Framework",
    description: "A lightweight testing framework for REST API validation and monitoring.",
    technologies: ["JavaScript", "Jest", "Express"],
    features: [
      "Automated API testing",
      "Performance monitoring",
      "Custom assertions",
      "CI/CD integration"
    ],
    githubUrl: "https://github.com/test/api-framework",
    liveUrl: "",
    imageUrl: "",
    featured: false,
    order: 2
  }
];

export async function POST(request: NextRequest) {
  if (!isTestEnvironment) {
    return NextResponse.json(
      { error: 'This endpoint is only available in test environment' },
      { status: 403 }
    );
  }

  try {
    await connectDB();

    // Create models
    const About = mongoose.models.About || mongoose.model('About', new mongoose.Schema({
      name: String,
      title: String,
      bio: {
        paragraph1: String,
        paragraph2: String
      },
      experience: {
        years: Number,
        description: String
      },
      skills: [String],
      achievements: [String],
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }));

    const Contact = mongoose.models.Contact || mongoose.model('Contact', new mongoose.Schema({
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String,
      website: String,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }));

    const Skill = mongoose.models.Skill || mongoose.model('Skill', new mongoose.Schema({
      name: String,
      level: Number,
      category: String,
      createdAt: { type: Date, default: Date.now }
    }));

    const Experience = mongoose.models.Experience || mongoose.model('Experience', new mongoose.Schema({
      title: { type: String, required: true },
      company: { type: String, required: true },
      startDate: { type: String, required: true },
      endDate: { type: String },
      current: { type: Boolean, default: false },
      description: { type: String },
      responsibilities: [{ type: String }],
      achievements: [{ type: String }],
      technologies: [{ type: String }],
      location: { type: String },
      order: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }));

    // Clear existing test data
    await About.deleteMany({});
    await Contact.deleteMany({});
    await Skill.deleteMany({});
    await Experience.deleteMany({ company: 'Tech Corp Inc.' });
    await Project.deleteMany({ title: { $regex: /Test|API Testing/ } });

    // Seed new data
    const about = new About(aboutTestData);
    await about.save();

    const contact = new Contact(contactTestData);
    await contact.save();

    await Skill.insertMany(skillsTestData);
    await Experience.insertMany(experienceTestData);
    await Project.insertMany(projectTestData);

    // Reset skills data to clean state in MongoDB
    await updateSkillsData(defaultSkillsData);

    // Get counts
    const counts = {
      about: await About.countDocuments(),
      contact: await Contact.countDocuments(),
      skills: await Skill.countDocuments(),
      experience: await Experience.countDocuments(),
      projects: await Project.countDocuments()
    };

    return NextResponse.json({
      success: true,
      message: 'Test data seeded successfully',
      counts
    });

  } catch (error) {
    console.error('Test data seeding error:', error);
    return NextResponse.json(
      { error: 'Failed to seed test data' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isTestEnvironment) {
    return NextResponse.json(
      { error: 'This endpoint is only available in test environment' },
      { status: 403 }
    );
  }

  try {
    await connectDB();

    // Clear test data
    if (mongoose.connection.db) {
      await mongoose.connection.db.collection('abouts').deleteMany({});
      await mongoose.connection.db.collection('contacts').deleteMany({});
      await mongoose.connection.db.collection('skills').deleteMany({}); // Individual skills (legacy)
      await mongoose.connection.db.collection('skillss').deleteMany({}); // Skills document (new)
      await mongoose.connection.db.collection('experiences').deleteMany({
        company: 'Tech Corp Inc.'
      });
      await mongoose.connection.db.collection('projects').deleteMany({
        title: { $regex: /Test|API Testing/ }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Test data cleared successfully'
    });

  } catch (error) {
    console.error('Test data clearing error:', error);
    return NextResponse.json(
      { error: 'Failed to clear test data' },
      { status: 500 }
    );
  }
}
