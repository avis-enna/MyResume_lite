import connectDB from './mongodb';
import mongoose from 'mongoose';

// About model schema - matches the admin API schema
const aboutSchema = new mongoose.Schema({
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
});

export async function getAboutData() {
  try {
    await connectDB();
    const About = mongoose.models.About || mongoose.model('About', aboutSchema);
    
    // Get the first (and should be only) about document
    const aboutDoc = await About.findOne();
    
    if (!aboutDoc) {
      // Return default structure if no data exists
      return {
        name: 'Venna Venkata Siva Reddy',
        title: 'Senior Software Engineer',
        bio: {
          paragraph1: 'Experienced software engineer with expertise in cloud technologies and automation.',
          paragraph2: 'Passionate about building scalable solutions and continuous learning.'
        },
        skills: [],
        achievements: []
      };
    }

    return {
      name: aboutDoc.name || 'Venna Venkata Siva Reddy',
      title: aboutDoc.title || 'Senior Software Engineer',
      bio: {
        paragraph1: aboutDoc.bio?.paragraph1 || 'Experienced software engineer with expertise in cloud technologies and automation.',
        paragraph2: aboutDoc.bio?.paragraph2 || 'Passionate about building scalable solutions and continuous learning.'
      },
      skills: aboutDoc.skills || [],
      achievements: aboutDoc.achievements || []
    };
  } catch (error) {
    console.error('Error fetching about data:', error);
    return {
      name: 'Venna Venkata Siva Reddy',
      title: 'Senior Software Engineer',
      bio: {
        paragraph1: 'Experienced software engineer with expertise in cloud technologies and automation.',
        paragraph2: 'Passionate about building scalable solutions and continuous learning.'
      },
      skills: [],
      achievements: []
    };
  }
}
