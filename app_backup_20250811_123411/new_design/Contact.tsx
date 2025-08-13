"use client";

import { useState, useEffect } from "react";
import { useDarkMode } from "./DarkModeContext";

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
}

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

interface ContactContent {
  title: string;
  subtitle: string;
  description: string;
  orderOfService: {
    title: string;
    description: string;
  };
}

interface ContactData {
  contactInfo: ContactInfo;
  socialLinks: SocialLink[];
  content: ContactContent;
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const { isDarkMode } = useDarkMode();
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const response = await fetch('/api/contact');
      if (response.ok) {
        const data = await response.json();
        setContactData(data);
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getSocialIcon = (iconType: string) => {
    switch (iconType) {
      case 'linkedin':
        return <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>;
      case 'github':
        return <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>;
      case 'email':
        return <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819l6.545 4.91 6.545-4.91h3.819A1.636 1.636 0 0 1 24 5.457z"/>;
      default:
        return <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819l6.545 4.91 6.545-4.91h3.819A1.636 1.636 0 0 1 24 5.457z"/>;
    }
  };

  if (loading) {
    return (
      <section id="contact" className={`min-h-screen py-20 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading contact section...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!contactData) {
    return (
      <section id="contact" className={`min-h-screen py-20 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <p className={`transition-colors duration-300 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>Failed to load contact section</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className={`min-h-screen py-20 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-light tracking-[0.1em] uppercase mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>{contactData.content.title}</h2>
            <div className={`w-24 h-px mx-auto transition-colors duration-300 ${isDarkMode ? 'bg-white' : 'bg-stone-400'}`}></div>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div>
              <h3 className={`text-2xl font-light mb-8 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>{contactData.content.subtitle}</h3>
              <p className={`mb-12 leading-relaxed transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {contactData.content.description}
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className={`text-lg font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>Email</h4>
                  <a href={`mailto:${contactData.contactInfo.email}`} className={`transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-stone-600 hover:text-stone-800'}`}>
                    {contactData.contactInfo.email}
                  </a>
                </div>
                <div>
                  <h4 className={`text-lg font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>Phone</h4>
                  <a href={`tel:${contactData.contactInfo.phone.replace(/\s/g, '')}`} className={`transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-stone-600 hover:text-stone-800'}`}>
                    {contactData.contactInfo.phone}
                  </a>
                </div>
                <div>
                  <h4 className={`text-lg font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>Location</h4>
                  <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-stone-600'}`}>{contactData.contactInfo.location}</p>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex justify-center space-x-8 mt-12">
                {contactData.socialLinks.map((link, index) => (
                  <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="group" title={`${link.name} Profile`}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors ${isDarkMode ? 'bg-gray-900/20 border border-gray-800/50' : 'bg-gray-100'}`}>
                      <svg className={`w-8 h-8 group-hover:text-white transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                        {getSocialIcon(link.icon)}
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none cursor-not-allowed opacity-60 transition-colors duration-300 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-600 text-gray-400'
                        : 'bg-gray-100 border-gray-300 text-gray-500'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none cursor-not-allowed opacity-60 transition-colors duration-300 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-600 text-gray-400'
                        : 'bg-gray-100 border-gray-300 text-gray-500'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    disabled
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none resize-none cursor-not-allowed opacity-60 transition-colors duration-300 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-600 text-gray-400'
                        : 'bg-gray-100 border-gray-300 text-gray-500'
                    }`}
                    required
                  />
                </div>
                <button
                  type="button"
                  disabled={true}
                  className={`w-full py-3 rounded-lg font-medium cursor-not-allowed opacity-60 transition-colors duration-300 ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-400 border border-gray-600'
                      : 'bg-gray-300 text-gray-500 border border-gray-400'
                  }`}
                  title="Contact form is disabled - please use direct email or phone"
                >
                  Form Disabled
                </button>

                {/* Subtle form status note */}
                <p className={`text-xs mt-3 text-center transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Having issues? Email me directly at {contactData.contactInfo.email}
                </p>
              </form>
            </div>
          </div>

          {/* Order of Service */}
          <div className="text-center mt-20">
            <h3 className={`text-2xl font-light mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>{contactData.content.orderOfService.title}</h3>
            <div className={`w-16 h-1 mx-auto transition-colors duration-300 ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
            <p className={`mt-8 max-w-2xl mx-auto transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {contactData.content.orderOfService.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
