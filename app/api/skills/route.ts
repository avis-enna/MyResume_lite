import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Skills from '@/app/models/Skills';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get the skills document (there should be only one)
    const skillsDoc = await Skills.findOne({});

    if (!skillsDoc) {
      // Return default structure if no skills found
      return NextResponse.json({
        skillCategories: [],
        certifications: [],
        technicalExpertise: {
          title: "Technical Expertise",
          description: "A results-driven Software Engineer with hands-on experience in migrating legacy systems to modern, cloud-native environments."
        }
      });
    }

    return NextResponse.json({
      skillCategories: skillsDoc.skillCategories || [],
      certifications: skillsDoc.certifications || [],
      technicalExpertise: skillsDoc.technicalExpertise || {
        title: "Technical Expertise",
        description: "A results-driven Software Engineer with hands-on experience in migrating legacy systems to modern, cloud-native environments."
      }
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}
