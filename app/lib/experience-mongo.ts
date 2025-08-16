import connectDB from './mongodb';
import Experience from '../models/Experience';

export async function getExperiences() {
  try {
    await connectDB();
    const experiences = await Experience.find().sort({ order: 1, createdAt: -1 });
    return JSON.parse(JSON.stringify(experiences)); // Serialize for Next.js
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }
}
