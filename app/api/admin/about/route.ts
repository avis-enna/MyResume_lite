import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/admin-auth';
import connectDB from '../../../lib/mongodb';
import mongoose from 'mongoose';
import { MetricsTracker } from '../../../lib/metrics';

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
    await requireAuth();
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
          profileImage: '/profile-photo.png',
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
      }, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

    // Transform the data to match the expected format
    const responseData = {
      personal: {
        name: aboutDoc.name || '',
        title: aboutDoc.title || '',
        profileImage: '/profile-photo.png',
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

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth();
    await connectDB();

    const data = await request.json();
    const About = mongoose.models.About || mongoose.model('About', aboutSchema);

    // Transform the incoming data to match our schema
    const updateData = {
      name: data.name || '',
      title: data.title || '',
      bio: {
        paragraph1: data.bio1 || '',
        paragraph2: data.bio2 || ''
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

    // Return data in the format expected by the frontend
    const responseData = {
      personal: {
        name: aboutDoc.name || '',
        title: aboutDoc.title || '',
        profileImage: '/profile-photo.png',
        socialLinks: {
          linkedin: data.linkedin || '',
          github: data.github || '',
          email: data.email || ''
        }
      },
      bio: {
        paragraph1: aboutDoc.bio?.paragraph1 || '',
        paragraph2: aboutDoc.bio?.paragraph2 || ''
      },
      lastUpdated: aboutDoc.updatedAt
    };

    // Track metrics
    await MetricsTracker.aboutUpdated(request, {
      name: data.name,
      title: data.title,
      bio1: data.bio1,
      bio2: data.bio2
    });

    return NextResponse.json({ success: true, data: responseData });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error updating about data:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}
