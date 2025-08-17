import { NextRequest } from 'next/server';
import Metric, { IMetric } from '../models/Metrics';
import { connectDB } from './mongodb';

type OperationType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
type SectionType = 'about' | 'contact' | 'skills' | 'experience' | 'projects' | 'blog' | 'contacts' | 'auth';

interface TrackMetricParams {
  operation: OperationType;
  section: SectionType;
  details: string;
  recordId?: string;
  metadata?: Record<string, any>;
  request?: NextRequest;
  userId?: string;
}

export async function trackMetric({
  operation,
  section,
  details,
  recordId,
  metadata,
  request,
  userId = 'admin'
}: TrackMetricParams): Promise<void> {
  try {
    await connectDB();

    const metricData: Partial<IMetric> = {
      operation,
      section,
      details,
      userId,
      recordId,
      metadata,
      timestamp: new Date()
    };

    // Extract IP and User Agent from request if available
    if (request) {
      metricData.ipAddress = request.ip || 
        request.headers.get('x-forwarded-for') || 
        request.headers.get('x-real-ip') || 
        'unknown';
      metricData.userAgent = request.headers.get('user-agent') || 'unknown';
    }

    await Metric.create(metricData);
  } catch (error) {
    // Don't throw errors for metrics tracking to avoid breaking main functionality
    console.error('Failed to track metric:', error);
  }
}

export async function getMetrics(days: number = 7) {
  try {
    await connectDB();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const metrics = await Metric.find({
      timestamp: { $gte: startDate }
    }).sort({ timestamp: -1 });

    return metrics;
  } catch (error) {
    console.error('Failed to get metrics:', error);
    return [];
  }
}

export async function getMetricsSummary(days: number = 7) {
  try {
    await connectDB();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Aggregate metrics by operation type
    const operationStats = await Metric.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      { $group: { _id: '$operation', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Aggregate metrics by section
    const sectionStats = await Metric.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      { $group: { _id: '$section', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Daily activity
    const dailyStats = await Metric.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Recent activity
    const recentActivity = await Metric.find({
      timestamp: { $gte: startDate }
    })
    .sort({ timestamp: -1 })
    .limit(20)
    .select('operation section details timestamp recordId');

    // Total counts
    const totalOperations = await Metric.countDocuments({
      timestamp: { $gte: startDate }
    });

    return {
      totalOperations,
      operationStats,
      sectionStats,
      dailyStats,
      recentActivity,
      period: `${days} days`
    };
  } catch (error) {
    console.error('Failed to get metrics summary:', error);
    return {
      totalOperations: 0,
      operationStats: [],
      sectionStats: [],
      dailyStats: [],
      recentActivity: [],
      period: `${days} days`
    };
  }
}

// Helper function to track common operations
export const MetricsTracker = {
  // About operations
  aboutUpdated: (request?: NextRequest, changes?: Record<string, any>) =>
    trackMetric({
      operation: 'UPDATE',
      section: 'about',
      details: 'About information updated',
      metadata: { changes },
      request
    }),

  // Contact operations
  contactUpdated: (request?: NextRequest, changes?: Record<string, any>) =>
    trackMetric({
      operation: 'UPDATE',
      section: 'contact',
      details: 'Contact information updated',
      metadata: { changes },
      request
    }),

  // Skills operations
  skillsUpdated: (request?: NextRequest, changes?: Record<string, any>) =>
    trackMetric({
      operation: 'UPDATE',
      section: 'skills',
      details: 'Skills updated',
      metadata: { changes },
      request
    }),

  // Experience operations
  experienceCreated: (request?: NextRequest, experienceId?: string) =>
    trackMetric({
      operation: 'CREATE',
      section: 'experience',
      details: 'New experience created',
      recordId: experienceId,
      request
    }),

  experienceUpdated: (request?: NextRequest, experienceId?: string, changes?: Record<string, any>) =>
    trackMetric({
      operation: 'UPDATE',
      section: 'experience',
      details: 'Experience updated',
      recordId: experienceId,
      metadata: { changes },
      request
    }),

  experienceDeleted: (request?: NextRequest, experienceId?: string) =>
    trackMetric({
      operation: 'DELETE',
      section: 'experience',
      details: 'Experience deleted',
      recordId: experienceId,
      request
    }),

  // Project operations
  projectCreated: (request?: NextRequest, projectId?: string, projectTitle?: string) =>
    trackMetric({
      operation: 'CREATE',
      section: 'projects',
      details: `New project created: ${projectTitle || 'Untitled'}`,
      recordId: projectId,
      metadata: { title: projectTitle },
      request
    }),

  projectUpdated: (request?: NextRequest, projectId?: string, changes?: Record<string, any>) =>
    trackMetric({
      operation: 'UPDATE',
      section: 'projects',
      details: 'Project updated',
      recordId: projectId,
      metadata: { changes },
      request
    }),

  projectDeleted: (request?: NextRequest, projectId?: string, projectTitle?: string) =>
    trackMetric({
      operation: 'DELETE',
      section: 'projects',
      details: `Project deleted: ${projectTitle || 'Unknown'}`,
      recordId: projectId,
      metadata: { title: projectTitle },
      request
    }),

  // Blog operations
  blogCreated: (request?: NextRequest, blogId?: string, title?: string) =>
    trackMetric({
      operation: 'CREATE',
      section: 'blog',
      details: `New blog post created: ${title || 'Untitled'}`,
      recordId: blogId,
      metadata: { title },
      request
    }),

  blogUpdated: (request?: NextRequest, blogId?: string, changes?: Record<string, any>) =>
    trackMetric({
      operation: 'UPDATE',
      section: 'blog',
      details: 'Blog post updated',
      recordId: blogId,
      metadata: { changes },
      request
    }),

  blogDeleted: (request?: NextRequest, blogId?: string, title?: string) =>
    trackMetric({
      operation: 'DELETE',
      section: 'blog',
      details: `Blog post deleted: ${title || 'Unknown'}`,
      recordId: blogId,
      metadata: { title },
      request
    }),

  // Contact messages
  contactMessageReceived: (request?: NextRequest, messageId?: string) =>
    trackMetric({
      operation: 'CREATE',
      section: 'contacts',
      details: 'New contact message received',
      recordId: messageId,
      request
    }),

  contactMessageDeleted: (request?: NextRequest, messageId?: string) =>
    trackMetric({
      operation: 'DELETE',
      section: 'contacts',
      details: 'Contact message deleted',
      recordId: messageId,
      request
    }),

  // Auth operations
  adminLogin: (request?: NextRequest) =>
    trackMetric({
      operation: 'CREATE',
      section: 'auth',
      details: 'Admin login successful',
      request
    }),

  adminLogout: (request?: NextRequest) =>
    trackMetric({
      operation: 'DELETE',
      section: 'auth',
      details: 'Admin logout',
      request
    }),

  adminSessionCheck: (request?: NextRequest) =>
    trackMetric({
      operation: 'READ',
      section: 'auth',
      details: 'Admin session check',
      request
    })
};
