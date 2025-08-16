/**
 * Deterministic test data seeding for admin panel tests
 * Creates baseline documents for About, Contact, Skills, and Experience
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../app/lib/mongodb';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Test data schemas
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
    description: ['Lead full-stack development team', 'Architect scalable web applications'],
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
  },
  {
    title: 'Software Engineer',
    company: 'StartupXYZ',
    duration: '2018 - 2020',
    description: ['Full-stack development', 'API design and implementation'],
    responsibilities: [
      'Develop and maintain web applications',
      'Implement RESTful APIs',
      'Write comprehensive unit tests'
    ],
    achievements: [
      'Built core product features from scratch',
      'Improved test coverage to 90%'
    ],
    technologies: ['Vue.js', 'Express.js', 'PostgreSQL'],
    type: 'full-time',
    current: false,
    startDate: new Date('2018-06-01'),
    endDate: new Date('2020-01-01')
  }
];

async function seedTestData() {
  try {
    console.log('🌱 Starting test data seeding...');
    await connectDB();

    // Create models if they don't exist
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
      description: [String],
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
    console.log('🧹 Clearing existing test data...');
    await About.deleteMany({});
    await Contact.deleteMany({});
    await Skill.deleteMany({});
    await Experience.deleteMany({ company: { $in: ['Tech Corp Inc.', 'StartupXYZ'] } });

    // Seed About data
    console.log('📝 Seeding About data...');
    const about = new About(aboutTestData);
    await about.save();
    console.log('✅ About data seeded');

    // Seed Contact data
    console.log('📞 Seeding Contact data...');
    const contact = new Contact(contactTestData);
    await contact.save();
    console.log('✅ Contact data seeded');

    // Seed Skills data
    console.log('🛠️ Seeding Skills data...');
    await Skill.insertMany(skillsTestData);
    console.log(`✅ ${skillsTestData.length} skills seeded`);

    // Seed Experience data
    console.log('💼 Seeding Experience data...');
    await Experience.insertMany(experienceTestData);
    console.log(`✅ ${experienceTestData.length} experiences seeded`);

    console.log('🎉 Test data seeding completed successfully!');
    
    // Verify seeded data
    const counts = {
      about: await About.countDocuments(),
      contact: await Contact.countDocuments(),
      skills: await Skill.countDocuments(),
      experience: await Experience.countDocuments()
    };
    
    console.log('📊 Seeded data counts:', counts);
    
    return counts;

  } catch (error) {
    console.error('❌ Test data seeding failed:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

async function clearTestData() {
  try {
    console.log('🧹 Clearing test data...');
    await connectDB();

    // Clear all test data
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }
    await mongoose.connection.db.collection('abouts').deleteMany({});
    await mongoose.connection.db.collection('contacts').deleteMany({});
    await mongoose.connection.db.collection('skills').deleteMany({});
    await mongoose.connection.db.collection('experiences').deleteMany({
      company: { $in: ['Tech Corp Inc.', 'StartupXYZ'] }
    });

    console.log('✅ Test data cleared successfully');

  } catch (error) {
    console.error('❌ Test data clearing failed:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'seed':
    seedTestData();
    break;
  case 'clear':
    clearTestData();
    break;
  default:
    console.log(`
🌱 Test Data Seeding Script

Usage:
  npm run seed:test-data seed   - Seed test data
  npm run seed:test-data clear  - Clear test data

This script creates deterministic test data for:
  - About section (name, title, bio, experience)
  - Contact information (email, phone, social links)
  - Skills (6 skills across different categories)
  - Experience (2 work experiences)
`);
    break;
}

export { seedTestData, clearTestData };
