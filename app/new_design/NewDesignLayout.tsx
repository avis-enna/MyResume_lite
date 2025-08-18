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
  const [data, setData] = useState({
    aboutData: null,
    contactData: null,
    skillsData: null,
    experiences: [],
    projects: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch data from API endpoints
        const [aboutRes, contactRes, experienceRes] = await Promise.all([
          fetch('/api/about'),
          fetch('/api/contact'),
          fetch('/api/experience')
        ]);

        const [aboutData, contactData, experienceData] = await Promise.all([
          aboutRes.json(),
          contactRes.json(),
          experienceRes.json()
        ]);

        console.log('Fetched data:', { aboutData, contactData, experienceData });

        // For skills and projects, use default data since the endpoints don't exist publicly
        const defaultSkillsData = {
          skillCategories: [
            {
              title: "Cloud & DevOps",
              skills: ["Kubernetes", "Docker", "Helm", "FluxCD", "CI/CD", "AWS", "GCP"]
            },
            {
              title: "Programming Languages",
              skills: ["Java", "Python", "JavaScript", "SQL", "Shell Scripting", "COBOL"]
            },
            {
              title: "Backend",
              skills: ["Spring Boot", "REST APIs", "SOAP Web Services", "Microservices"]
            },
            {
              title: "Frontend",
              skills: ["React", "JavaScript", "HTML", "CSS"]
            },
            {
              title: "Databases",
              skills: ["SQL", "MongoDB", "IBM DB2", "VSAM"]
            },
            {
              title: "Mainframe",
              skills: ["JCL", "COBOL"]
            },
            {
              title: "Networking",
              skills: ["TCP/IP", "HTTP", "Network Device Configuration & Troubleshooting"]
            }
          ],
          certifications: [
            "Cisco Certified DevNet Associate (DEVASC)",
            "Cisco Certified Network Associate (CCNA)",
            "Cisco Certified Cybersecurity Associate (CCCA)"
          ],
          technicalExpertise: {
            description: "A results-driven Software Engineer with hands-on experience in migrating legacy systems to modern, cloud-native environments. Proven expertise in the full software development lifecycle, from backend development with Java/Spring Boot to frontend implementation with React. Specialized in Kubernetes, Docker, and GitOps workflows using Helm and FluxCD."
          }
        };

        const defaultProjectsData = [
          {
            title: "IoT Control Center Migration",
            description: "Led the migration of IoT Control Center's core services from Docker to scalable Kubernetes architecture, improving service reliability and deployment velocity.",
            technologies: ["Kubernetes", "Docker", "Helm", "FluxCD", "Java", "Spring Boot"],
            featured: true
          },
          {
            title: "HLR Network Service",
            description: "Developed and maintained resilient Java Spring Boot microservices for HLR-level network service, designing and exposing both REST and SOAP APIs.",
            technologies: ["Java", "Spring Boot", "REST APIs", "SOAP", "Microservices"],
            featured: true
          },
          {
            title: "SSO Integration",
            description: "Implemented Single Sign-On (SSO) for new services using Duo, enhancing security and streamlining user access.",
            technologies: ["SSO", "Duo", "Security", "Authentication"],
            featured: false
          },
          {
            title: "Data Analytics Tool",
            description: "Developed a data analytics tool by integrating with Jira APIs to pull, model, and visualize project data, enabling predictive insights into team productivity.",
            technologies: ["Jira APIs", "Data Analytics", "Visualization", "React"],
            featured: false
          }
        ];

        const processedData = {
          aboutData: aboutData.personal || aboutData,
          contactData: contactData.contacts?.[0] || contactData,
          skillsData: defaultSkillsData,
          experiences: experienceData.data || experienceData,
          projects: defaultProjectsData
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
