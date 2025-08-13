const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Experience Schema
const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  current: { type: Boolean, default: false },
  description: [{ type: String }],
  technologies: [{ type: String }],
  location: { type: String },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Experience = mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);

// Project Schema
const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  features: [{ type: String }],
  githubUrl: { type: String },
  liveUrl: { type: String },
  imageUrl: { type: String },
  featured: { type: Boolean, default: false },
  publication: {
    title: { type: String },
    journal: { type: String },
    date: { type: String }
  },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

// Seed data
const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Experience.deleteMany({});
    await Project.deleteMany({});

    // Seed Experience Data
    const experiences = [
      {
        company: "Cisco Systems",
        position: "Software Engineer",
        startDate: "August 2024",
        endDate: "",
        current: true,
        location: "Bengaluru, India",
        description: [
          "Led the migration of the IoT Control Center's core services from Docker to a scalable Kubernetes (k8s) architecture, significantly improving service reliability and deployment velocity.",
          "Managed Kubernetes applications using Helm charts for packaging and deployed a GitOps workflow with FluxCD for automated, declarative continuous delivery.",
          "Developed and maintained resilient Java Spring Boot microservices for the HLR-level network service, designing and exposing both REST and SOAP APIs.",
          "Implemented Single Sign-On (SSO) for new services using Duo, enhancing security and streamlining user access.",
          "Built and supported frontend modules in React for internal service management dashboards.",
          "Leveraged CCNA certification to collaborate with the network engineering team on troubleshooting and configuring network devices, bridging the gap between software and infrastructure.",
          "Developed a data analytics tool by integrating with Jira APIs to pull, model, and visualize project data, enabling predictive insights into team productivity and project progress."
        ],
        technologies: ["Kubernetes", "Docker", "Helm", "FluxCD", "Java", "Spring Boot", "React", "REST APIs", "SOAP", "Duo SSO", "Jira APIs"],
        order: 1
      },
      {
        company: "Cognizant Technology Solutions",
        position: "Trainee",
        startDate: "November 2023",
        endDate: "May 2024",
        current: false,
        location: "India",
        description: [
          "Maintained and enhanced a large-scale mainframe banking application, gaining deep experience in enterprise-level systems.",
          "Developed and modified COBOL programs to implement new business logic and functionality changes.",
          "Automated and optimized batch processing jobs using JCL, debugged JCL failures, and implemented changes to system-generated reports.",
          "Worked extensively with core mainframe technologies including DB2 for database management and VSAM for indexed data storage."
        ],
        technologies: ["COBOL", "JCL", "DB2", "VSAM", "Mainframe"],
        order: 2
      }
    ];

    // Seed Project Data
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
        },
        order: 1
      }
    ];

    // Insert data
    await Experience.insertMany(experiences);
    await Project.insertMany(projects);

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Inserted ${experiences.length} experiences`);
    console.log(`🚀 Inserted ${projects.length} projects`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
