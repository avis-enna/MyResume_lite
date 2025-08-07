'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '../lib/blog-data';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div>Loading blog posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              V.V.S.R
            </Link>
            <div className="flex gap-6">
              <Link href="/#home" className="hover:text-blue-400 transition-colors">
                Home
              </Link>
              <Link href="/#about" className="hover:text-blue-400 transition-colors">
                About
              </Link>
              <Link href="/#skills" className="hover:text-blue-400 transition-colors">
                Skills
              </Link>
              <Link href="/#experience" className="hover:text-blue-400 transition-colors">
                Experience
              </Link>
              <Link href="/blog" className="text-blue-400">
                Blog
              </Link>
              <Link href="/#contact" className="hover:text-blue-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Tech Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Insights on software engineering, cloud technologies, and modern development practices
          </p>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-4">No blog posts yet</h2>
              <p className="text-gray-400">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="hover:text-blue-400 transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h2>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                        <span>By {post.author}</span>
                        <span>•</span>
                        <span>{new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                        <span>•</span>
                        <span>{post.readingTime} min read</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Read more
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="text-xl font-bold">SVR.</span>
            <span className="text-gray-400">design & coding by me</span>
          </div>
          <div className="flex justify-center gap-6">
            <Link href="https://linkedin.com/in/sivavenna" className="text-gray-400 hover:text-white transition-colors">
              LinkedIn
            </Link>
            <Link href="https://github.com/avis-enna" className="text-gray-400 hover:text-white transition-colors">
              GitHub
            </Link>
            <Link href="mailto:vsivareddy.venna@gmail.com" className="text-gray-400 hover:text-white transition-colors">
              Email
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
