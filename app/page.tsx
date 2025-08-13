import connectDB from '@/app/lib/mongodb';
import Experience from '@/app/models/Experience';

// Fetch experiences data directly from database
async function getExperiences() {
  try {
    await connectDB();
    const experiences = await Experience.find().sort({ order: 1, createdAt: -1 });
    return JSON.parse(JSON.stringify(experiences)); // Serialize for Next.js
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }
}

export default async function Home() {
  const experiences = await getExperiences();
  return (
    <div className="min-h-screen bg-black text-white font-serif">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-amber-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <div className="text-2xl font-light tracking-[0.3em] text-amber-100 font-serif">V.V.S.R</div>

            <div className="hidden md:flex items-center space-x-12">
              <a href="#home" className="text-sm font-light tracking-[0.2em] transition-all text-amber-200/70 hover:text-amber-100 uppercase">home</a>
              <a href="#about" className="text-sm font-light tracking-[0.2em] transition-all text-amber-200/70 hover:text-amber-100 uppercase">about</a>
              <a href="#skills" className="text-sm font-light tracking-[0.2em] transition-all text-amber-200/70 hover:text-amber-100 uppercase">expertise</a>
              <a href="#experience" className="text-sm font-light tracking-[0.2em] transition-all text-amber-200/70 hover:text-amber-100 uppercase">experience</a>
              <a href="#projects" className="text-sm font-light tracking-[0.2em] transition-all text-amber-200/70 hover:text-amber-100 uppercase">portfolio</a>
              <a href="/blog" className="text-sm font-light tracking-[0.2em] transition-all text-amber-200/70 hover:text-amber-100 uppercase">journal</a>
              <a href="#contact" className="text-sm font-light tracking-[0.2em] transition-all text-amber-200/70 hover:text-amber-100 uppercase">contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/5 via-transparent to-amber-800/5" />
        </div>

        <div className="relative z-10 text-center px-6">
          <div className="mb-8">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent mx-auto mb-8"></div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.3em] mb-8">
            <div className="text-amber-100">VENNA VENKATA</div>
            <div className="text-3xl md:text-5xl lg:text-6xl mt-4 text-amber-200/80 tracking-[0.2em]">SIVA REDDY</div>
          </h1>

          <div className="mb-12">
            <p className="text-lg md:text-xl font-light tracking-[0.25em] text-amber-300/70 mb-4 uppercase">
              Software Engineer
            </p>
            <p className="text-sm tracking-[0.15em] text-amber-400/60 uppercase">
              Cisco Systems • Bengaluru, India
            </p>
          </div>

          <p className="text-base md:text-lg font-light leading-relaxed text-amber-200/60 max-w-4xl mx-auto mb-16 italic">
            "A results-driven engineer specializing in cloud-native architectures and enterprise systems.
            Proven expertise in migrating legacy systems to modern environments with Kubernetes, Docker, and GitOps workflows."
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <a
              href="#experience"
              className="px-12 py-4 border border-amber-600/50 text-amber-200 font-light tracking-[0.2em] uppercase text-sm hover:border-amber-500 hover:text-amber-100 hover:bg-amber-900/10 transition-all duration-500"
            >
              Experience
            </a>
            <a
              href="#contact"
              className="px-12 py-4 bg-amber-900/30 border border-amber-700/50 text-amber-100 font-light tracking-[0.2em] uppercase text-sm hover:bg-amber-800/40 hover:border-amber-600 transition-all duration-500"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="absolute bottom-12 right-12 text-right">
          <div className="text-sm font-light tracking-[0.3em] text-amber-600/60 uppercase">Portfolio</div>
          <div className="text-xs font-light tracking-[0.4em] text-amber-700/50 mt-2">MMXXIV</div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 bg-gradient-to-b from-black via-amber-950/5 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent mx-auto mb-12"></div>
            <h2 className="text-4xl md:text-6xl font-light tracking-[0.3em] mb-8 text-amber-100 uppercase">About</h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="border-l-2 border-amber-600/30 pl-8">
                <h3 className="text-2xl font-light tracking-[0.2em] text-amber-200 mb-6 uppercase">Professional Summary</h3>
                <p className="text-lg font-light leading-relaxed text-amber-200/70 italic">
                  A results-driven Software Engineer with hands-on experience in migrating legacy systems
                  to modern, cloud-native environments. Proven expertise in the full software development lifecycle,
                  from backend development with Java/Spring Boot to frontend implementation with React.
                </p>
              </div>

              <div className="border-l-2 border-amber-600/30 pl-8">
                <h3 className="text-2xl font-light tracking-[0.2em] text-amber-200 mb-6 uppercase">Specialization</h3>
                <p className="text-lg font-light leading-relaxed text-amber-200/70 italic">
                  Specialized in Kubernetes, Docker, and GitOps workflows using Helm and FluxCD.
                  A proactive problem-solver with unique cross-functional experience in network engineering (CCNA)
                  and data analytics, passionate about building scalable, mission-critical software.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-amber-950/20 border border-amber-800/30 p-8 rounded">
                <h4 className="text-xl font-light tracking-[0.2em] text-amber-200 mb-4 uppercase">Current Role</h4>
                <p className="text-amber-200/80 font-light">Software Engineer</p>
                <p className="text-amber-300/60 font-light">Cisco Systems</p>
                <p className="text-amber-400/50 font-light text-sm mt-2">August 2024 - Present</p>
              </div>

              <div className="bg-amber-950/20 border border-amber-800/30 p-8 rounded">
                <h4 className="text-xl font-light tracking-[0.2em] text-amber-200 mb-4 uppercase">Education</h4>
                <p className="text-amber-200/80 font-light">Bachelor of Engineering</p>
                <p className="text-amber-300/60 font-light">Electronics & Telecommunication</p>
                <p className="text-amber-400/50 font-light text-sm mt-2">Sir M Visvesvaraya Institute of Technology</p>
              </div>

              <div className="bg-amber-950/20 border border-amber-800/30 p-8 rounded">
                <h4 className="text-xl font-light tracking-[0.2em] text-amber-200 mb-4 uppercase">Location</h4>
                <p className="text-amber-200/80 font-light">Bengaluru, India</p>
                <p className="text-amber-300/60 font-light">Available for Remote & On-site</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent mx-auto mb-12"></div>
            <h2 className="text-4xl md:text-6xl font-light tracking-[0.3em] mb-8 text-amber-100 uppercase">Technical Expertise</h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-amber-950/10 border border-amber-800/20 p-8 rounded">
              <h3 className="text-xl font-light tracking-[0.2em] text-amber-200 mb-6 uppercase">Cloud & DevOps</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-amber-200/80 font-light">Kubernetes</span>
                  <div className="w-20 h-1 bg-amber-900/30 rounded"><div className="w-full h-full bg-amber-600/70 rounded"></div></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-200/80 font-light">Docker</span>
                  <div className="w-20 h-1 bg-amber-900/30 rounded"><div className="w-full h-full bg-amber-600/70 rounded"></div></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-200/80 font-light">Helm</span>
                  <div className="w-20 h-1 bg-amber-900/30 rounded"><div className="w-5/6 h-full bg-amber-600/70 rounded"></div></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-200/80 font-light">FluxCD</span>
                  <div className="w-20 h-1 bg-amber-900/30 rounded"><div className="w-5/6 h-full bg-amber-600/70 rounded"></div></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-200/80 font-light">AWS</span>
                  <div className="w-20 h-1 bg-amber-900/30 rounded"><div className="w-4/5 h-full bg-amber-600/70 rounded"></div></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-200/80 font-light">GCP</span>
                  <div className="w-20 h-1 bg-amber-900/30 rounded"><div className="w-4/5 h-full bg-amber-600/70 rounded"></div></div>
                </div>
              </div>
            </div>

            <div className="bg-amber-950/10 border border-amber-800/20 p-8 rounded">
              <h3 className="text-xl font-light tracking-[0.2em] text-amber-200 mb-6 uppercase">Programming</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-amber-200/80 font-light">Java</span>
                  <div className="w-20 h-1 bg-amber-900/30 rounded"><div className="w-full h-full bg-amber-600/70 rounded"></div></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-200/80 font-light">Python</span>
                  <div className="w-20 h-1 bg-amber-900/30 rounded"><div className="w-5/6 h-full bg-amber-600/70 rounded"></div></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-200/80 font-light">JavaScript</span>
                  <div className="w-20 h-1 bg-amber-900/30 rounded"><div className="w-5/6 h-full bg-amber-600/70 rounded"></div></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-200/80 font-light">SQL</span>
                  <div className="w-20 h-1 bg-amber-900/30 rounded"><div className="w-5/6 h-full bg-amber-600/70 rounded"></div></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-200/80 font-light">Shell Scripting</span>
                  <div className="w-20 h-1 bg-amber-900/30 rounded"><div className="w-4/5 h-full bg-amber-600/70 rounded"></div></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-200/80 font-light">COBOL</span>
                  <div className="w-20 h-1 bg-amber-900/30 rounded"><div className="w-3/4 h-full bg-amber-600/70 rounded"></div></div>
                </div>
              </div>
            </div>

            <div className="bg-amber-950/10 border border-amber-800/20 p-8 rounded">
              <h3 className="text-xl font-light tracking-[0.2em] text-amber-200 mb-6 uppercase">Frameworks & Tools</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-amber-200/80 font-light">Spring Boot</span>
                  <div className="w-20 h-1 bg-amber-900/30 rounded"><div className="w-full h-full bg-amber-600/70 rounded"></div></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-200/80 font-light">React</span>
                  <div className="w-20 h-1 bg-amber-900/30 rounded"><div className="w-5/6 h-full bg-amber-600/70 rounded"></div></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-200/80 font-light">REST APIs</span>
                  <div className="w-20 h-1 bg-amber-900/30 rounded"><div className="w-full h-full bg-amber-600/70 rounded"></div></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-200/80 font-light">SOAP</span>
                  <div className="w-20 h-1 bg-amber-900/30 rounded"><div className="w-5/6 h-full bg-amber-600/70 rounded"></div></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-200/80 font-light">MongoDB</span>
                  <div className="w-20 h-1 bg-amber-900/30 rounded"><div className="w-4/5 h-full bg-amber-600/70 rounded"></div></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-200/80 font-light">DB2</span>
                  <div className="w-20 h-1 bg-amber-900/30 rounded"><div className="w-4/5 h-full bg-amber-600/70 rounded"></div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="bg-amber-950/20 border border-amber-800/30 p-8 rounded max-w-4xl mx-auto">
              <h3 className="text-2xl font-light tracking-[0.2em] text-amber-200 mb-6 uppercase">Certifications</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-amber-300/80 font-light text-lg">DEVASC</div>
                  <div className="text-amber-400/60 font-light text-sm">Cisco Certified DevNet Associate</div>
                </div>
                <div className="text-center">
                  <div className="text-amber-300/80 font-light text-lg">CCNA</div>
                  <div className="text-amber-400/60 font-light text-sm">Cisco Certified Network Associate</div>
                </div>
                <div className="text-center">
                  <div className="text-amber-300/80 font-light text-lg">CCCA</div>
                  <div className="text-amber-400/60 font-light text-sm">Cisco Certified Cybersecurity Associate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-32 px-6 bg-gradient-to-b from-black via-amber-950/5 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent mx-auto mb-12"></div>
            <h2 className="text-4xl md:text-6xl font-light tracking-[0.3em] mb-8 text-amber-100 uppercase">Professional Experience</h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent mx-auto"></div>
          </div>

          <div className="space-y-16">
            {experiences.length > 0 ? (
              experiences.map((experience, index) => (
                <div key={experience._id} className={`border-l-4 ${index === 0 ? 'border-amber-600/30' : 'border-amber-600/20'} pl-12 relative`}>
                  <div className={`absolute -left-3 top-0 w-6 h-6 ${index === 0 ? 'bg-amber-600/50' : 'bg-amber-600/30'} rounded-full border-4 border-black`}></div>
                  <div className={`${index === 0 ? 'bg-amber-950/20 border-amber-800/30' : 'bg-amber-950/10 border-amber-800/20'} border p-8 rounded`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                      <div>
                        <h3 className={`text-2xl font-light tracking-[0.2em] ${index === 0 ? 'text-amber-200' : 'text-amber-200/70'} mb-2 uppercase`}>
                          {experience.title}
                        </h3>
                        <h4 className={`text-xl font-light ${index === 0 ? 'text-amber-300/80' : 'text-amber-300/60'}`}>
                          {experience.company}
                        </h4>
                        <p className={`${index === 0 ? 'text-amber-400/60' : 'text-amber-400/50'} font-light`}>
                          {experience.location}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <span className={`${index === 0 ? 'bg-amber-900/30 border-amber-700/50 text-amber-200' : 'bg-amber-900/20 border-amber-700/30 text-amber-200/70'} border px-4 py-2 rounded text-sm font-light tracking-[0.1em]`}>
                          {experience.startDate} - {experience.endDate || 'Present'}
                        </span>
                      </div>
                    </div>

                    {experience.description && (
                      <div className="mb-6">
                        <p className={`${index === 0 ? 'text-amber-200/80' : 'text-amber-200/60'} font-light italic leading-relaxed`}>
                          {experience.description}
                        </p>
                      </div>
                    )}

                    {experience.responsibilities && experience.responsibilities.length > 0 && (
                      <div className="mb-6">
                        <h5 className={`text-lg font-light tracking-[0.1em] ${index === 0 ? 'text-amber-200/90' : 'text-amber-200/70'} mb-4 uppercase`}>
                          Key Responsibilities
                        </h5>
                        <ul className="space-y-3">
                          {experience.responsibilities.map((responsibility, respIndex) => (
                            <li key={respIndex} className="flex items-start">
                              <span className={`${index === 0 ? 'text-amber-600/70' : 'text-amber-600/50'} mr-3 mt-2`}>•</span>
                              <span className={`${index === 0 ? 'text-amber-200/70' : 'text-amber-200/60'} font-light italic`}>
                                {responsibility}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {experience.achievements && experience.achievements.length > 0 && (
                      <div className="mb-6">
                        <h5 className={`text-lg font-light tracking-[0.1em] ${index === 0 ? 'text-amber-200/90' : 'text-amber-200/70'} mb-4 uppercase`}>
                          Key Achievements
                        </h5>
                        <ul className="space-y-3">
                          {experience.achievements.map((achievement, achIndex) => (
                            <li key={achIndex} className="flex items-start">
                              <span className={`${index === 0 ? 'text-amber-600/70' : 'text-amber-600/50'} mr-3 mt-2`}>○</span>
                              <span className={`${index === 0 ? 'text-amber-200/70' : 'text-amber-200/60'} font-light italic`}>
                                {achievement}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {experience.technologies && experience.technologies.length > 0 && (
                      <div className="mt-6">
                        <h5 className={`text-lg font-light tracking-[0.1em] ${index === 0 ? 'text-amber-200/90' : 'text-amber-200/70'} mb-4 uppercase`}>
                          Technologies
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {experience.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className={`${index === 0 ? 'bg-amber-900/20 border-amber-700/40 text-amber-200/80' : 'bg-amber-900/10 border-amber-700/30 text-amber-200/60'} border px-3 py-1 rounded text-sm font-light`}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <p className="text-amber-200/60 font-light italic">No experience data available.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent mx-auto mb-12"></div>
            <h2 className="text-4xl md:text-6xl font-light tracking-[0.3em] mb-8 text-amber-100 uppercase">Featured Projects</h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent mx-auto"></div>
          </div>

          <div className="bg-amber-950/20 border border-amber-800/30 p-12 rounded">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-3xl font-light tracking-[0.2em] text-amber-200 mb-4 uppercase">IoT-Based Continuous Abiotic Factor Monitoring</h3>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-amber-900/30 border border-amber-700/50 text-amber-200/80 px-3 py-1 rounded text-sm font-light">Java</span>
                  <span className="bg-amber-900/30 border border-amber-700/50 text-amber-200/80 px-3 py-1 rounded text-sm font-light">Spring Boot</span>
                  <span className="bg-amber-900/30 border border-amber-700/50 text-amber-200/80 px-3 py-1 rounded text-sm font-light">React</span>
                  <span className="bg-amber-900/30 border border-amber-700/50 text-amber-200/80 px-3 py-1 rounded text-sm font-light">SQL</span>
                </div>
              </div>
              <div className="bg-amber-900/20 border border-amber-700/30 text-amber-200/70 px-4 py-2 rounded text-sm font-light tracking-[0.1em] uppercase">
                Featured
              </div>
            </div>

            <p className="text-lg font-light leading-relaxed text-amber-200/70 italic mb-8">
              Built, tested, and deployed a full-stack, real-world application from the ground up, applying computer science knowledge
              of data structures and algorithms for environmental monitoring using IoT sensors.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-light tracking-[0.1em] text-amber-200/90 mb-4 uppercase">Key Features</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-amber-600/70 mr-3 mt-2">•</span>
                    <span className="text-amber-200/70 font-light italic">Backend web service using Java & Spring Boot to expose REST APIs for data ingestion and retrieval</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600/70 mr-3 mt-2">•</span>
                    <span className="text-amber-200/70 font-light italic">Responsive user interface using JavaScript and React to visualize real-time data</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-light tracking-[0.1em] text-amber-200/90 mb-4 uppercase">Recognition</h4>
                <div className="bg-amber-900/20 border border-amber-700/30 p-6 rounded">
                  <h5 className="text-lg font-light text-amber-200/80 mb-2">📄 Published Research</h5>
                  <p className="text-amber-200/70 font-light italic">
                    "IoT-Based Continuous Abiotic Factor Monitoring" - IJFMR, May–June 2023
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 bg-gradient-to-b from-black via-amber-950/5 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent mx-auto mb-12"></div>
            <h2 className="text-4xl md:text-6xl font-light tracking-[0.3em] mb-8 text-amber-100 uppercase">Contact</h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="border-l-2 border-amber-600/30 pl-8">
                <h3 className="text-2xl font-light tracking-[0.2em] text-amber-200 mb-6 uppercase">Get In Touch</h3>
                <p className="text-lg font-light leading-relaxed text-amber-200/70 italic mb-8">
                  I'm always interested in new opportunities, collaborations, and interesting projects.
                  Let's connect and discuss how we can work together to build something exceptional.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-amber-900/30 border border-amber-700/50 rounded-full flex items-center justify-center">
                    <span className="text-amber-200/80">✉</span>
                  </div>
                  <div>
                    <p className="text-amber-200/80 font-light">
                      <a href="mailto:vsivareddy.venna@gmail.com" className="hover:text-amber-100 transition-colors">
                        vsivareddy.venna@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-amber-900/30 border border-amber-700/50 rounded-full flex items-center justify-center">
                    <span className="text-amber-200/80">📞</span>
                  </div>
                  <div>
                    <p className="text-amber-200/80 font-light">
                      <a href="tel:+919398961541" className="hover:text-amber-100 transition-colors">
                        +91 93989 61541
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-amber-900/30 border border-amber-700/50 rounded-full flex items-center justify-center">
                    <span className="text-amber-200/80">🔗</span>
                  </div>
                  <div>
                    <p className="text-amber-200/80 font-light">
                      <a href="https://linkedin.com/in/sivavenna" target="_blank" rel="noopener noreferrer" className="hover:text-amber-100 transition-colors">
                        linkedin.com/in/sivavenna
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-amber-900/30 border border-amber-700/50 rounded-full flex items-center justify-center">
                    <span className="text-amber-200/80">📍</span>
                  </div>
                  <div>
                    <p className="text-amber-200/80 font-light">Bengaluru, India</p>
                    <p className="text-amber-300/60 font-light text-sm">Available for Remote & On-site</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-950/20 border border-amber-800/30 p-8 rounded">
              <form className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    required
                    className="w-full px-6 py-4 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50 transition-colors font-light"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="w-full px-6 py-4 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50 transition-colors font-light"
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Message"
                    required
                    className="w-full px-6 py-4 bg-black/50 border border-amber-800/30 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none focus:border-amber-600/50 transition-colors resize-none font-light"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-amber-900/30 border border-amber-700/50 text-amber-100 font-light tracking-[0.2em] uppercase text-sm hover:bg-amber-800/40 hover:border-amber-600 transition-all duration-500"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-amber-900/20 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent mx-auto mb-8"></div>
            <div className="text-3xl font-light tracking-[0.4em] text-amber-200/60 mb-6 font-serif">V.V.S.R</div>
            <p className="text-sm font-light tracking-[0.2em] text-amber-400/50 uppercase italic">
              Crafted with precision & passion
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <h4 className="text-lg font-light tracking-[0.2em] text-amber-200/70 mb-4 uppercase">Navigation</h4>
              <div className="space-y-2">
                <a href="#about" className="block text-amber-300/50 hover:text-amber-200/70 transition-colors font-light">About</a>
                <a href="#experience" className="block text-amber-300/50 hover:text-amber-200/70 transition-colors font-light">Experience</a>
                <a href="#projects" className="block text-amber-300/50 hover:text-amber-200/70 transition-colors font-light">Projects</a>
              </div>
            </div>

            <div className="text-center">
              <h4 className="text-lg font-light tracking-[0.2em] text-amber-200/70 mb-4 uppercase">Connect</h4>
              <div className="space-y-2">
                <a href="mailto:vsivareddy.venna@gmail.com" className="block text-amber-300/50 hover:text-amber-200/70 transition-colors font-light">Email</a>
                <a href="https://linkedin.com/in/sivavenna" className="block text-amber-300/50 hover:text-amber-200/70 transition-colors font-light">LinkedIn</a>
                <a href="/blog" className="block text-amber-300/50 hover:text-amber-200/70 transition-colors font-light">Journal</a>
              </div>
            </div>

            <div className="text-center">
              <h4 className="text-lg font-light tracking-[0.2em] text-amber-200/70 mb-4 uppercase">Location</h4>
              <div className="space-y-2">
                <p className="text-amber-300/50 font-light">Bengaluru, India</p>
                <p className="text-amber-400/40 font-light text-sm">Available Worldwide</p>
              </div>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-amber-900/10">
            <p className="text-xs font-light tracking-[0.2em] text-amber-500/40 uppercase">
              © MMXXIV • Venna Venkata Siva Reddy • All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
