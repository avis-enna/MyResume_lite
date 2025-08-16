import mongoose from 'mongoose';
import { compressData, decompressData, CompressedData } from '../lib/compression';

interface IBlogPost extends mongoose.Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  compressedContent?: CompressedData;
  tags: string[];
  published: boolean;
  publishedAt?: Date;
  imageUrl?: string;
  readTime?: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new mongoose.Schema<IBlogPost>({
  title: {
    type: String,
    required: true,
    maxlength: 200,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    maxlength: 200,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true
  },
  content: {
    type: String,
    required: false // Will be stored in compressedContent for large posts
  },
  compressedContent: {
    data: String,
    compressed: Boolean,
    originalSize: Number,
    compressedSize: Number,
    compressionRatio: Number
  },
  tags: [{
    type: String,
    maxlength: 30,
    trim: true
  }],
  published: { type: Boolean, default: false },
  publishedAt: { type: Date },
  imageUrl: {
    type: String,
    validate: {
      validator: (url: string) => !url || /^https?:\/\/.+/.test(url),
      message: 'Invalid image URL'
    }
  },
  readTime: {
    type: Number,
    min: 1,
    max: 120
  },
  views: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save middleware to compress large content
BlogPostSchema.pre('save', async function(this: IBlogPost, next) {
  if (this.isModified('content') && this.content) {
    try {
      // Compress content if it's larger than 1KB
      if (this.content.length > 1024) {
        this.compressedContent = await compressData(this.content);
        this.content = ''; // Remove uncompressed content to save space
      }
    } catch (error) {
      console.error('Content compression failed:', error);
      // Continue without compression
    }
  }

  this.updatedAt = new Date();
  next();
});

// Virtual to get decompressed content
BlogPostSchema.virtual('fullContent').get(async function(this: IBlogPost) {
  if (this.content) {
    return this.content;
  }

  if (this.compressedContent) {
    try {
      return await decompressData(this.compressedContent);
    } catch (error) {
      console.error('Content decompression failed:', error);
      return '';
    }
  }

  return '';
});

// Index for better query performance
BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ published: 1, publishedAt: -1 });
BlogPostSchema.index({ tags: 1 });

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
