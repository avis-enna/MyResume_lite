import mongoose from 'mongoose';

export interface IMetric {
  operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  section: 'about' | 'contact' | 'skills' | 'experience' | 'projects' | 'blog' | 'contacts' | 'auth';
  details: string;
  userId?: string;
  recordId?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

const MetricSchema = new mongoose.Schema<IMetric>({
  operation: {
    type: String,
    enum: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    required: true
  },
  section: {
    type: String,
    enum: ['about', 'contact', 'skills', 'experience', 'projects', 'blog', 'contacts', 'auth'],
    required: true
  },
  details: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    default: 'admin'
  },
  recordId: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now,
    // TTL index - automatically delete documents after 7 days (604800 seconds)
    expires: 604800
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
MetricSchema.index({ timestamp: -1 });
MetricSchema.index({ section: 1, timestamp: -1 });
MetricSchema.index({ operation: 1, timestamp: -1 });

// Ensure TTL index is created
MetricSchema.index({ timestamp: 1 }, { expireAfterSeconds: 604800 });

const Metric = mongoose.models.Metric || mongoose.model<IMetric>('Metric', MetricSchema);

export default Metric;
