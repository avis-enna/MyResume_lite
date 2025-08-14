/**
 * About API endpoint - serves about data for the admin panel
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import mongoose from 'mongoose';

// About model schema
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

export async function GET() {
  try {
    await connectDB();

    const About = mongoose.models.About || mongoose.model('About', aboutSchema);
    
    // Get the first (and should be only) about document
    const aboutDoc = await About.findOne();
    
    if (!aboutDoc) {
      // Return empty structure if no data exists
      return NextResponse.json({
        personal: {
          name: '',
          title: '',
          profileImage: '',
          socialLinks: {
            linkedin: '',
            github: '',
            email: ''
          }
        },
        bio: {
          paragraph1: '',
          paragraph2: ''
        }
      });
    }

    // Transform the data to match the expected format
    const responseData = {
      personal: {
        name: aboutDoc.name || '',
        title: aboutDoc.title || '',
        profileImage: '',
        socialLinks: {
          linkedin: '',
          github: '',
          email: ''
        }
      },
      bio: {
        paragraph1: aboutDoc.bio?.paragraph1 || '',
        paragraph2: aboutDoc.bio?.paragraph2 || ''
      }
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('About API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const About = mongoose.models.About || mongoose.model('About', aboutSchema);
    const data = await request.json();

    // Transform the incoming data to match our schema
    const updateData = {
      name: data.name || data.personal?.name || '',
      title: data.title || data.personal?.title || '',
      bio: {
        paragraph1: data.bio1 || data.bio?.paragraph1 || '',
        paragraph2: data.bio2 || data.bio?.paragraph2 || ''
      },
      updatedAt: new Date()
    };

    // Update or create the about document
    const aboutDoc = await About.findOneAndUpdate(
      {}, // Find any document (should be only one)
      updateData,
      { 
        new: true, 
        upsert: true, // Create if doesn't exist
        runValidators: true 
      }
    );

    return NextResponse.json({
      success: true,
      message: 'About data updated successfully',
      data: aboutDoc
    });

  } catch (error) {
    console.error('About API update error:', error);
    return NextResponse.json(
      { error: 'Failed to update about data' },
      { status: 500 }
    );
  }
}
