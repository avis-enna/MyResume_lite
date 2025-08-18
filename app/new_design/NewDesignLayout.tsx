"use client";

import { DarkModeProvider, useDarkMode } from "./DarkModeContext";
import Navigation from "./Navigation";
import Hero from "./Hero";
import About from "./About";
import Skills from "./Skills";
import Experience from "./Experience";
import Projects from "./Projects";
import Contact from "./Contact";
import Footer from "./Footer";
import DotMatrixBackground from "./DotMatrixBackground";
import { useState, useEffect } from 'react';

interface LayoutContentProps {
  aboutData: any;
  contactData: any;
  experiences: any[];
  projects: any[];
}

function LayoutContent({ aboutData, contactData, experiences, projects }: LayoutContentProps) {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      <DotMatrixBackground />
      <Navigation />
      <Hero aboutData={aboutData} contactData={contactData} />
      <About aboutData={aboutData} contactData={contactData} />
      <Skills />
      <Experience experiences={experiences} />
      <Projects projects={projects} />
      <Contact contactData={contactData} />
      <Footer aboutData={aboutData} contactData={contactData} />
    </div>
  );
}

export default function NewDesignLayout() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState({
    aboutData: { name: 'John Doe', title: 'Senior Software Engineer' },
    contactData: { email: 'john.doe@example.com', location: 'San Francisco, CA' },
    experiences: [],
    projects: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    async function fetchData() {
      try {
        console.log('🔍 CLIENT: Starting to fetch data...');

        const timestamp = Date.now();
        const [aboutRes, contactRes, experienceRes, projectsRes] = await Promise.all([
          fetch(`/api/about?t=${timestamp}`, { cache: 'no-store' }),
          fetch(`/api/contact?t=${timestamp}`, { cache: 'no-store' }),
          fetch(`/api/experience?t=${timestamp}`, { cache: 'no-store' }),
          fetch(`/api/projects?t=${timestamp}`, { cache: 'no-store' })
        ]);

        const [aboutData, contactData, experienceData, projectsData] = await Promise.all([
          aboutRes.json(),
          contactRes.json(),
          experienceRes.json(),
          projectsRes.json()
        ]);

        console.log('🔍 CLIENT: Fetched data:', {
          about: aboutData,
          experience: experienceData,
          projects: projectsData
        });

        const newData = {
          aboutData: aboutData.personal || aboutData,
          contactData: contactData.contacts?.[0] || contactData,
          experiences: experienceData.data || experienceData,
          projects: projectsData.data || projectsData
        };

        console.log('🔍 CLIENT: Setting new data:', newData);

        setData(newData);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-light tracking-wider">Mounting...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <DarkModeProvider>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-light tracking-wider">Loading...</p>
          </div>
        </div>
      </DarkModeProvider>
    );
  }

  return (
    <DarkModeProvider>
      <LayoutContent
        aboutData={data.aboutData}
        contactData={data.contactData}
        experiences={data.experiences}
        projects={data.projects}
      />
    </DarkModeProvider>
  );
}
