// Blog types - safe for client-side import
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
