import { NextRequest, NextResponse } from 'next/server';
import { getContactData, updateContactData } from '../../../lib/contact-data';
import { checkAdminAuthSimple } from '../../../lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuthSimple();
    if (!isAuthenticated) {
      console.error('Contact GET: Authentication failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contactData = await getContactData();
    console.log('Contact GET: Data fetched successfully');
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
    console.log('Contact PUT: Starting update request');
    const isAuthenticated = await checkAdminAuthSimple();
    if (!isAuthenticated) {
      console.error('Contact PUT: Authentication failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    console.log('Contact PUT: Received updates:', Object.keys(updates));

    const updatedData = await updateContactData(updates);
    console.log('Contact PUT: Data updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Contact data updated successfully',
      data: updatedData
    });
  } catch (error) {
    console.error('Error updating contact data:', error);
    return NextResponse.json(
      { error: 'Failed to update contact data', details: error.message },
      { status: 500 }
    );
  }
}
