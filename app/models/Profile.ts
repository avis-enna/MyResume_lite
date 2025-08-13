import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  location: { type: String },
  summary: { type: String, required: true },
  skills: {
    cloudDevOps: [{ type: String }],
    programming: [{ type: String }],
    backend: [{ type: String }],
    frontend: [{ type: String }],
    databases: [{ type: String }],
    mainframe: [{ type: String }],
    networking: [{ type: String }],
  },
  socialLinks: {
    linkedin: { type: String },
    github: { type: String },
    twitter: { type: String },
  },
  certifications: [{
    name: { type: String },
    issuer: { type: String },
    date: { type: String },
  }],
  education: [{
    institution: { type: String },
    degree: { type: String },
    field: { type: String },
    location: { type: String },
  }],
  publications: [{
    title: { type: String },
    journal: { type: String },
    date: { type: String },
  }],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
