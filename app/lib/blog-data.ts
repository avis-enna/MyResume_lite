import fs from 'fs';
import path from 'path';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
  tags: string[];
  featuredImage?: string;
  readingTime: number;
}

export interface BlogData {
  posts: BlogPost[];
  categories: string[];
  tags: string[];
}

const BLOG_DATA_FILE = path.join(process.cwd(), 'app/data/blog.json');

// Default blog data
const defaultBlogData: BlogData = {
  posts: [
    {
      id: '1',
      title: 'Building Scalable Microservices with Kubernetes',
      slug: 'building-scalable-microservices-kubernetes',
      excerpt: 'Learn how to design and deploy microservices architecture using Kubernetes for maximum scalability and reliability.',
      content: `# Building Scalable Microservices with Kubernetes

In today's fast-paced development environment, microservices architecture has become the gold standard for building scalable, maintainable applications. When combined with Kubernetes, this approach offers unprecedented flexibility and reliability.

## Why Microservices?

Microservices architecture breaks down monolithic applications into smaller, independent services that can be developed, deployed, and scaled independently. This approach offers several advantages:

- **Scalability**: Scale individual services based on demand
- **Technology Diversity**: Use different technologies for different services
- **Fault Isolation**: Failures in one service don't bring down the entire system
- **Team Independence**: Different teams can work on different services

## Kubernetes: The Perfect Orchestrator

Kubernetes provides the perfect platform for running microservices with features like:

- **Service Discovery**: Automatic discovery and load balancing
- **Health Checks**: Automatic restart of failed containers
- **Rolling Updates**: Zero-downtime deployments
- **Resource Management**: Efficient resource allocation

## Best Practices

1. **Design for Failure**: Implement circuit breakers and retry mechanisms
2. **Monitor Everything**: Use comprehensive logging and monitoring
3. **Automate Deployments**: Implement CI/CD pipelines
4. **Security First**: Implement proper authentication and authorization

## Conclusion

The combination of microservices and Kubernetes provides a powerful foundation for building modern, scalable applications. Start small, learn continuously, and scale as needed.`,
      author: 'Venna Venkata Siva Reddy',
      publishedAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      status: 'published',
      tags: ['kubernetes', 'microservices', 'devops', 'cloud'],
      readingTime: 5
    },
    {
      id: '2',
      title: 'From Mainframe to Cloud: A Migration Journey',
      slug: 'mainframe-to-cloud-migration-journey',
      excerpt: 'My experience migrating legacy mainframe applications to modern cloud-native architectures.',
      content: `# From Mainframe to Cloud: A Migration Journey

Having worked extensively with both mainframe systems and modern cloud technologies, I've witnessed firsthand the challenges and opportunities in migrating legacy systems.

## The Challenge

Legacy mainframe systems are:
- Reliable but inflexible
- Expensive to maintain
- Difficult to scale
- Limited in integration capabilities

## The Solution

Modern cloud-native approaches offer:
- Elastic scalability
- Cost-effective operations
- Rich integration options
- Modern development practices

## Migration Strategy

1. **Assessment**: Understand current system dependencies
2. **Planning**: Design target architecture
3. **Incremental Migration**: Move components gradually
4. **Testing**: Comprehensive testing at each stage
5. **Optimization**: Continuous improvement

## Lessons Learned

- Start with non-critical components
- Invest in comprehensive testing
- Train teams on new technologies
- Plan for parallel operations during transition

The journey from mainframe to cloud is challenging but rewarding, opening up new possibilities for innovation and growth.`,
      author: 'Venna Venkata Siva Reddy',
      publishedAt: '2024-01-10T14:30:00Z',
      updatedAt: '2024-01-10T14:30:00Z',
      status: 'published',
      tags: ['mainframe', 'cloud', 'migration', 'legacy'],
      readingTime: 4
    }
  ],
  categories: ['Technology', 'DevOps', 'Cloud', 'Career'],
  tags: ['kubernetes', 'microservices', 'devops', 'cloud', 'mainframe', 'migration', 'legacy', 'java', 'spring-boot', 'react']
};

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(BLOG_DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load blog data
export function getBlogData(): BlogData {
  try {
    ensureDataDirectory();
    
    if (fs.existsSync(BLOG_DATA_FILE)) {
      const fileContent = fs.readFileSync(BLOG_DATA_FILE, 'utf-8');
      return JSON.parse(fileContent);
    } else {
      // Create default file if it doesn't exist
      fs.writeFileSync(BLOG_DATA_FILE, JSON.stringify(defaultBlogData, null, 2));
      return defaultBlogData;
    }
  } catch (error) {
    console.error('Error loading blog data:', error);
    return defaultBlogData;
  }
}

// Save blog data
export function saveBlogData(data: BlogData): void {
  try {
    ensureDataDirectory();
    fs.writeFileSync(BLOG_DATA_FILE, JSON.stringify(data, null, 2));
    console.log('Blog data saved successfully');
  } catch (error) {
    console.error('Error saving blog data:', error);
    throw error;
  }
}

// Get all published posts
export function getPublishedPosts(): BlogPost[] {
  const data = getBlogData();
  return data.posts
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

// Get post by slug
export function getPostBySlug(slug: string): BlogPost | null {
  const data = getBlogData();
  return data.posts.find(post => post.slug === slug) || null;
}

// Add new post
export function addBlogPost(post: Omit<BlogPost, 'id' | 'updatedAt'>): BlogPost {
  const data = getBlogData();
  const newPost: BlogPost = {
    ...post,
    id: Date.now().toString(),
    updatedAt: new Date().toISOString()
  };
  
  data.posts.push(newPost);
  saveBlogData(data);
  return newPost;
}

// Update existing post
export function updateBlogPost(id: string, updates: Partial<BlogPost>): BlogPost | null {
  const data = getBlogData();
  const postIndex = data.posts.findIndex(post => post.id === id);
  
  if (postIndex === -1) {
    return null;
  }
  
  data.posts[postIndex] = {
    ...data.posts[postIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  saveBlogData(data);
  return data.posts[postIndex];
}

// Delete post
export function deleteBlogPost(id: string): boolean {
  const data = getBlogData();
  const initialLength = data.posts.length;
  data.posts = data.posts.filter(post => post.id !== id);
  
  if (data.posts.length < initialLength) {
    saveBlogData(data);
    return true;
  }
  
  return false;
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Calculate reading time (words per minute)
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
