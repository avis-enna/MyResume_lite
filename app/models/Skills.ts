import mongoose from 'mongoose';

const SkillCategorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  skills: [{ type: String }]
});

const TechnicalExpertiseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }
});

const SkillsSchema = new mongoose.Schema({
  skillCategories: [SkillCategorySchema],
  certifications: [{ type: String }],
  technicalExpertise: TechnicalExpertiseSchema,
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Skills || mongoose.model('Skills', SkillsSchema);
