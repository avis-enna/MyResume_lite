import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  title: { type: String, required: true }, // Changed from 'position' to 'title'
  startDate: { type: String, required: true },
  endDate: { type: String },
  current: { type: Boolean, default: false },
  description: { type: String }, // Changed from array to string to match main site
  responsibilities: [{ type: String }], // Added for main site compatibility
  achievements: [{ type: String }], // Added for main site compatibility
  technologies: [{ type: String }],
  location: { type: String },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);
