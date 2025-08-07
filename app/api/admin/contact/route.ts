import { NextRequest, NextResponse } from 'next/server';
import { getContactData, updateContactData } from '../../../lib/contact-data';
import { checkAdminAuth } from '../../../lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contactData = await getContactData();
    return NextResponse.json(contactData);
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    const updatedData = await updateContactData(updates);
    
    return NextResponse.json({
      message: 'Contact data updated successfully',
      data: updatedData
    });
  } catch (error) {
    console.error('Error updating contact data:', error);
    return NextResponse.json(
      { error: 'Failed to update contact data' },
      { status: 500 }
    );
  }
}
