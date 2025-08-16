import { NextRequest, NextResponse } from 'next/server';
import { getContactData, updateContactData } from '../../../lib/contact-mongo';
import { requireAuth } from '../../../lib/admin-auth';

export async function GET(_request: NextRequest) {
  try {
    await requireAuth();
    const contactData = await getContactData();
    return NextResponse.json(contactData);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching contact data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth();
    const updates = await request.json();
    const updatedData = await updateContactData(updates);
    return NextResponse.json({
      success: true,
      message: 'Contact data updated successfully',
      data: updatedData
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error updating contact data:', error);
    return NextResponse.json(
      { error: 'Failed to update contact data', details: (error as any)?.message },
      { status: 500 }
    );
  }
}
