export default function Projects() {
  const projects = [
    {
      title: "IoT-Based Continuous Abiotic Factor Monitoring",
      description: "A full-stack, real-world application for monitoring environmental factors using IoT sensors. Built from the ground up applying computer science knowledge of data structures and algorithms.",
      technologies: ["Java", "Spring Boot", "React", "SQL", "JavaScript"],
      features: [
        "Backend web service using Java & Spring Boot to expose REST APIs for data ingestion and retrieval",
        "Responsive user interface using JavaScript and React to visualize real-time data",
        "Real-time data processing and visualization",
        "RESTful API design for sensor data management",
        "Database optimization for time-series data"
      ],
      githubUrl: "",
      liveUrl: "",
      imageUrl: "",
      featured: true,
      publication: {
        title: "IoT-Based Continuous Abiotic Factor Monitoring",
        journal: "IJFMR",
        date: "May–June 2023"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] text-white mb-4">Projects</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
            A showcase of my technical projects, from IoT applications to full-stack web development.
          </p>
        </div>

        <div className="space-y-12">
          {projects.map((project, index) => (
            <div key={index} className={`bg-gray-950 border border-gray-800 rounded-lg p-8 hover:border-gray-700 transition-colors ${project.featured ? 'border-gray-700' : ''}`}>
              {project.featured && (
                <div className="mb-4">
                  <span className="inline-block bg-gray-900 text-gray-400 px-3 py-1 rounded border border-gray-800 text-sm font-light">
                    Featured Project
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-light tracking-[0.1em] text-gray-300 mb-4">{project.title}</h2>
                <p className="text-lg text-gray-400 leading-relaxed font-light">{project.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-light tracking-[0.1em] text-gray-400 mb-3">Key Features:</h3>
                <ul className="space-y-2">
                  {project.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-gray-600 mr-2 mt-1">•</span>
                      <span className="text-gray-400 font-light">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-light tracking-[0.1em] text-gray-400 mb-3">Technologies Used:</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-900 text-gray-400 px-3 py-1 rounded border border-gray-800 text-sm font-light"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {project.publication && (
                <div className="mb-6 p-4 bg-gray-900 border border-gray-700 rounded-lg">
                  <h3 className="font-light tracking-[0.1em] text-gray-400 mb-2">📄 Published Research</h3>
                  <p className="text-gray-400 font-light">
                    <strong>{project.publication.title}</strong> - {project.publication.journal}, {project.publication.date}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                {project.githubUrl && (
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    View Code
                  </a>
                )}
                {project.liveUrl && (
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="card bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in Collaboration?</h2>
            <p className="text-gray-700 mb-6">
              I'm always open to discussing new projects, innovative ideas, or opportunities to contribute to your team.
            </p>
            <a href="/contact" className="btn-primary">
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
