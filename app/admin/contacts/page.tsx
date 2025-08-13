'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/session-check');
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.authenticated) {
        router.push('/admin');
      }
    } catch (_err) {
      router.push('/admin');
    }
  }, [router]);

  const loadContacts = useCallback(async () => {
    try {
      const response = await fetch('/api/contact');
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts || []);
      }
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    loadContacts();
  }, [checkAuth, loadContacts]);

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
      });

      if (response.ok) {
        setContacts(contacts.map(contact => 
          contact._id === id ? { ...contact, read: true } : contact
        ));
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContacts(contacts.filter(contact => contact._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const unreadCount = contacts.filter(contact => !contact.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                ← Back to Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Contact Messages</h1>
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {contacts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages</h3>
              <p className="text-gray-600">Contact form submissions will appear here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {contacts.map((contact) => (
                <div key={contact._id} className={`card ${!contact.read ? 'border-blue-200 bg-blue-50/30' : ''}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{contact.subject}</h3>
                        {!contact.read && (
                          <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="font-medium">{contact.name}</span>
                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-700" title={`Email ${contact.name}`}>
                          {contact.email}
                        </a>
                        <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{contact.message}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {!contact.read && (
                        <button
                          onClick={() => markAsRead(contact._id)}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Mark as Read
                        </button>
                      )}
                      <a
                        href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                        className="text-green-600 hover:text-green-700 text-sm"
                        title={`Reply to ${contact.email}`}
                      >
                        Reply
                      </a>
                      <button
                        onClick={() => deleteContact(contact._id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
