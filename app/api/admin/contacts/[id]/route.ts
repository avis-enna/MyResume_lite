import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/admin-auth';
import connectDB from '@/app/lib/mongodb';
import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth();
    await connectDB();
    const { id } = params;
    const body = await request.json().catch(() => ({}));

    const contact = await Contact.findByIdAndUpdate(
      id,
      { $set: { read: body.read === true } },
      { new: true }
    );

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json(contact);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth();
    await connectDB();
    const { id } = params;

    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error deleting contact:', error);
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}
