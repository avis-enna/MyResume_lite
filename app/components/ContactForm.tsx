'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          subject: `Portfolio Contact from ${formData.name}`
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        console.error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-lg p-8">
      {submitted ? (
        <div className="text-center py-8">
          <div className="text-green-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-light text-gray-300 mb-2">Message Sent!</h3>
          <p className="text-gray-400 font-light">Thank you for reaching out. I'll get back to you soon.</p>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-black border border-gray-800 rounded text-gray-300 placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-black border border-gray-800 rounded text-gray-300 placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors"
            />
          </div>
          <div>
            <textarea
              name="message"
              rows={4}
              placeholder="Message"
              value={formData.message}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-black border border-gray-800 rounded text-gray-300 placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-8 py-3 bg-gray-800 text-gray-300 font-light tracking-[0.1em] uppercase text-sm hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}
