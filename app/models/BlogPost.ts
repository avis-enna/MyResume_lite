import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  published: { type: Boolean, default: false },
  publishedAt: { type: Date },
  imageUrl: { type: String },
  readTime: { type: Number }, // in minutes
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
