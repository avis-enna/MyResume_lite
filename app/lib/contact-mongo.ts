import connectDB from './mongodb';
import mongoose from 'mongoose';

// Contact model schema - matches the admin API schema
const contactSchema = new mongoose.Schema({
  email: String,
  phone: String,
  location: String,
  linkedin: String,
  github: String,
  website: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export async function getContactData() {
  try {
    await connectDB();
    const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
    
    // Get the first (and should be only) contact document
    const contactDoc = await Contact.findOne();
    
    if (!contactDoc) {
      // Return default structure if no data exists
      return {
        email: 'vsivareddy.venna@gmail.com',
        phone: '+1-555-0123',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/sivavenna',
        github: 'https://github.com/avis-enna',
        website: 'https://portfolio.dev'
      };
    }

    return {
      email: contactDoc.email || 'vsivareddy.venna@gmail.com',
      phone: contactDoc.phone || '+1-555-0123',
      location: contactDoc.location || 'San Francisco, CA',
      linkedin: contactDoc.linkedin || 'https://linkedin.com/in/sivavenna',
      github: contactDoc.github || 'https://github.com/avis-enna',
      website: contactDoc.website || 'https://portfolio.dev'
    };
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return {
      email: 'vsivareddy.venna@gmail.com',
      phone: '+1-555-0123',
      location: 'San Francisco, CA',
      linkedin: 'https://linkedin.com/in/sivavenna',
      github: 'https://github.com/avis-enna',
      website: 'https://portfolio.dev'
    };
  }
}
