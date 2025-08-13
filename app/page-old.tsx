import Link from 'next/link';

export default function Home() {



  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-light tracking-[0.2em] text-white">V.V.S.R</div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-sm font-light tracking-[0.1em] transition-colors text-gray-500 hover:text-gray-300">home</a>
              <a href="#about" className="text-sm font-light tracking-[0.1em] transition-colors text-gray-500 hover:text-gray-300">about</a>
              <a href="#skills" className="text-sm font-light tracking-[0.1em] transition-colors text-gray-500 hover:text-gray-300">expertise</a>
              <a href="#experience" className="text-sm font-light tracking-[0.1em] transition-colors text-gray-500 hover:text-gray-300">experience</a>
              <a href="#projects" className="text-sm font-light tracking-[0.1em] transition-colors text-gray-500 hover:text-gray-300">portfolio</a>
              <Link href="/blog" className="text-sm font-light tracking-[0.1em] transition-colors text-gray-500 hover:text-gray-300">blog</Link>
              <a href="#contact" className="text-sm font-light tracking-[0.1em] transition-colors text-gray-500 hover:text-gray-300">contact</a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                title="Toggle mobile menu"
                className="text-gray-500 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-16">
        {/* Subtle Dot Matrix Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 dot-pattern" />
        </div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.2em] mb-6">
            <div className="text-white">VENNA VENKATA</div>
            <div className="text-3xl md:text-5xl lg:text-6xl mt-2 text-gray-300">SIVA REDDY</div>
          </h1>
          <p className="text-lg md:text-xl font-light tracking-[0.15em] text-gray-500 mb-12">
            software engineer
          </p>
          <p className="text-base md:text-lg font-light leading-relaxed text-gray-400 max-w-3xl mx-auto mb-12">
            Distinguished software engineer specializing in cloud-native architectures and enterprise systems.
            Currently architecting scalable solutions at Cisco Systems with expertise in Kubernetes and modern development practices.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="#projects"
              className="px-8 py-3 border border-gray-600 text-gray-300 font-light tracking-[0.1em] uppercase text-sm hover:border-white hover:text-white transition-all duration-300"
            >
              portfolio
            </a>
            <a
              href="#contact"
              className="px-8 py-3 bg-gray-800 text-white font-light tracking-[0.1em] uppercase text-sm hover:bg-gray-700 transition-all duration-300"
            >
              contact
            </a>
          </div>
        </div>

        {/* Portfolio Badge */}
        <div className="absolute bottom-8 right-8 text-right">
          <div className="text-sm font-light tracking-[0.2em] text-gray-600">PORTFOLIO</div>
          <div className="text-xs font-light tracking-[0.3em] text-gray-700 mt-1">MMXXIV</div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-light tracking-[0.2em] mb-8 text-white">
                about
              </h2>
              <div className="space-y-6 text-gray-400 font-light leading-relaxed">
                <p>
                  A results-driven Software Engineer with hands-on experience in migrating legacy systems
                  to modern, cloud-native environments. Proven expertise in the full software development
                  lifecycle, from backend development with Java/Spring Boot to frontend implementation with React.
                </p>
                <p>
                  Specialized in Kubernetes, Docker, and GitOps workflows using Helm and FluxCD.
                  A proactive problem-solver with unique cross-functional experience in network engineering (CCNA)
                  and data analytics, passionate about building scalable, mission-critical software.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gray-950 rounded-lg border border-gray-800 flex items-center justify-center">
                <div className="text-gray-700 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <p className="text-sm font-light">Professional Photo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light tracking-[0.2em] mb-16 text-center text-white">
            expertise
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Cloud & DevOps",
                skills: ["Kubernetes", "Docker", "Helm", "FluxCD", "CI/CD", "AWS", "GCP"]
              },
              {
                title: "Programming",
                skills: ["Java", "Python", "JavaScript", "SQL", "Shell Scripting", "COBOL"]
              },
              {
                title: "Backend & Frontend",
                skills: ["Spring Boot", "REST APIs", "Microservices", "React", "HTML", "CSS"]
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
                skills: ["TCP/IP", "HTTP", "Network Configuration", "Troubleshooting"]
              }
            ].map((category, index) => (
              <div key={index} className="bg-black border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
                <h3 className="text-lg font-light tracking-[0.1em] text-gray-300 mb-4">
                  {category.title}
                </h3>
                <ul className="space-y-2">
                  {category.skills.map((skill, idx) => (
                    <li key={idx} className="text-gray-500 font-light text-sm">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light tracking-[0.2em] mb-16 text-center text-white">
            experience
          </h2>

          <div className="space-y-12">
            {[
              {
                company: "Cisco Systems",
                position: "Software Engineer",
                period: "Aug 2024 - Present",
                description: "Led migration of IoT Control Center's core services from Docker to Kubernetes architecture. Managed applications using Helm charts and deployed GitOps workflow with FluxCD.",
                technologies: ["Kubernetes", "Docker", "Helm", "FluxCD", "Java", "Spring Boot", "React"]
              },
              {
                company: "Cognizant Technology Solutions",
                position: "Trainee",
                period: "Nov 2023 - May 2024",
                description: "Maintained and enhanced large-scale mainframe banking application. Developed COBOL programs and automated batch processing jobs using JCL.",
                technologies: ["COBOL", "JCL", "IBM DB2", "VSAM", "Mainframe"]
              }
            ].map((exp, index) => (
              <div key={index} className="bg-gray-950 border border-gray-800 rounded-lg p-8 hover:border-gray-700 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-light tracking-[0.1em] text-gray-300 mb-2">
                      {exp.position}
                    </h3>
                    <h4 className="text-lg font-light text-gray-400 mb-2">
                      {exp.company}
                    </h4>
                  </div>
                  <div className="text-sm font-light tracking-[0.1em] text-gray-600">
                    {exp.period}
                  </div>
                </div>

                <p className="text-gray-400 font-light leading-relaxed mb-6">
                  {exp.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-900 text-gray-400 text-xs font-light tracking-[0.05em] rounded border border-gray-800">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light tracking-[0.2em] mb-16 text-center text-white">
            portfolio
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-black border border-gray-800 rounded-lg p-8 hover:border-gray-700 transition-colors">
              <h3 className="text-xl font-light tracking-[0.1em] text-gray-300 mb-4">
                IoT-Based Continuous Abiotic Factor Monitoring
              </h3>
              <p className="text-gray-400 font-light leading-relaxed mb-6">
                A full-stack, real-world application for monitoring environmental factors using IoT sensors.
                Built from the ground up applying computer science knowledge of data structures and algorithms.
              </p>

              <div className="mb-6">
                <h4 className="text-sm font-light tracking-[0.1em] text-gray-500 mb-3 uppercase">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {["Java", "Spring Boot", "React", "SQL", "JavaScript"].map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-900 text-gray-400 text-xs font-light tracking-[0.05em] rounded border border-gray-800">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded p-4">
                <p className="text-gray-400 text-sm font-light">
                  📄 Published in IJFMR, May–June 2023
                </p>
              </div>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-lg p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4 text-gray-600">🚀</div>
                <h3 className="text-lg font-light tracking-[0.1em] text-gray-500 mb-2">
                  More Projects Coming Soon
                </h3>
                <p className="text-gray-600 font-light text-sm">
                  Currently working on exciting new projects
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light tracking-[0.2em] mb-16 text-center text-white">
            contact
          </h2>

          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h3 className="text-xl font-light tracking-[0.1em] text-gray-300 mb-8">
                Get In Touch
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-light tracking-[0.1em] text-gray-500 mb-2 uppercase">Email</h4>
                  <a href="mailto:vsivareddy.venna@gmail.com" className="text-gray-400 font-light hover:text-gray-300 transition-colors">
                    vsivareddy.venna@gmail.com
                  </a>
                </div>
                <div>
                  <h4 className="text-sm font-light tracking-[0.1em] text-gray-500 mb-2 uppercase">Phone</h4>
                  <a href="tel:+919398961541" className="text-gray-400 font-light hover:text-gray-300 transition-colors">
                    +91 93989 61541
                  </a>
                </div>
                <div>
                  <h4 className="text-sm font-light tracking-[0.1em] text-gray-500 mb-2 uppercase">Location</h4>
                  <p className="text-gray-400 font-light">Bengaluru, India</p>
                </div>
                <div>
                  <h4 className="text-sm font-light tracking-[0.1em] text-gray-500 mb-2 uppercase">LinkedIn</h4>
                  <a href="https://linkedin.com/in/sivavenna" target="_blank" rel="noopener noreferrer" className="text-gray-400 font-light hover:text-gray-300 transition-colors">
                    linkedin.com/in/sivavenna
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-lg p-8">
              <form className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-800 rounded text-gray-300 placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-800 rounded text-gray-300 placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors"
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Message"
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-800 rounded text-gray-300 placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-8 py-3 bg-gray-800 text-gray-300 font-light tracking-[0.1em] uppercase text-sm hover:bg-gray-700 transition-all"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-900 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-light tracking-[0.3em] text-gray-600 mb-4">
            SVR.
          </div>
          <p className="text-xs font-light tracking-[0.1em] text-gray-700">
            design & coding by me
          </p>
        </div>
      </footer>
    </div>
  );
}
