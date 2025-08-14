/**
 * Test data seeding API endpoint
 * Only available in test/development environment
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import mongoose from 'mongoose';

const isTestEnvironment = process.env.NODE_ENV === 'test' || 
                         process.env.PLAYWRIGHT_TEST === '1' ||
                         process.env.CI === 'true' ||
                         process.env.NODE_ENV === 'development';

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
    duration: '2020 - Present',
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
    startDate: new Date('2020-01-01'),
    endDate: null
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
      title: String,
      company: String,
      duration: String,
      description: String,
      responsibilities: [String],
      achievements: [String],
      technologies: [String],
      type: String,
      current: Boolean,
      startDate: Date,
      endDate: Date,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }));

    // Clear existing test data
    await About.deleteMany({});
    await Contact.deleteMany({});
    await Skill.deleteMany({});
    await Experience.deleteMany({ company: 'Tech Corp Inc.' });

    // Seed new data
    const about = new About(aboutTestData);
    await about.save();

    const contact = new Contact(contactTestData);
    await contact.save();

    await Skill.insertMany(skillsTestData);
    await Experience.insertMany(experienceTestData);

    // Get counts
    const counts = {
      about: await About.countDocuments(),
      contact: await Contact.countDocuments(),
      skills: await Skill.countDocuments(),
      experience: await Experience.countDocuments()
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
    await mongoose.connection.db.collection('abouts').deleteMany({});
    await mongoose.connection.db.collection('contacts').deleteMany({});
    await mongoose.connection.db.collection('skills').deleteMany({});
    await mongoose.connection.db.collection('experiences').deleteMany({
      company: 'Tech Corp Inc.'
    });

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
