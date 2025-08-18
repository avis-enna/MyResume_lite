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
  skillsData: any;
  experiences: any[];
  projects: any[];
}

function LayoutContent({ aboutData, contactData, skillsData, experiences, projects }: LayoutContentProps) {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      <DotMatrixBackground />
      <Navigation />
      <Hero aboutData={aboutData} contactData={contactData} />
      <About aboutData={aboutData} contactData={contactData} />
      <Skills skillsData={skillsData} />
      <Experience experiences={experiences} />
      <Projects projects={projects} />
      <Contact contactData={contactData} />
      <Footer aboutData={aboutData} contactData={contactData} />
    </div>
  );
}

export default function NewDesignLayout() {
  console.log('NewDesignLayout component mounted');

  const [data, setData] = useState({
    aboutData: null,
    contactData: null,
    skillsData: null,
    experiences: [],
    projects: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useEffect running - starting to fetch data');

    async function fetchData() {
      console.log('fetchData function called');
      try {
        // Fetch data from API endpoints
        const [aboutRes, contactRes, experienceRes, skillsRes, projectsRes] = await Promise.all([
          fetch('/api/about'),
          fetch('/api/contact'),
          fetch('/api/experience'),
          fetch('/api/skills'),
          fetch('/api/projects')
        ]);

        const [aboutData, contactData, experienceData, skillsData, projectsData] = await Promise.all([
          aboutRes.json(),
          contactRes.json(),
          experienceRes.json(),
          skillsRes.json(),
          projectsRes.json()
        ]);

        console.log('Fetched data:', { aboutData, contactData, experienceData, skillsData, projectsData });

        const processedData = {
          aboutData: aboutData.personal || aboutData,
          contactData: contactData.contacts?.[0] || contactData,
          skillsData: skillsData,
          experiences: experienceData.data || experienceData,
          projects: projectsData.data || projectsData
        };

        console.log('Processed data:', processedData);
        setData(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set default data on error
        setData({
          aboutData: { name: 'Venna Venkata Siva Reddy', title: 'Software Engineer' },
          contactData: { email: 'vsivareddy.venna@gmail.com', location: 'Bengaluru, India' },
          skillsData: { skillCategories: [], certifications: [] },
          experiences: [],
          projects: []
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
        skillsData={data.skillsData}
        experiences={data.experiences}
        projects={data.projects}
      />
    </DarkModeProvider>
  );
}
