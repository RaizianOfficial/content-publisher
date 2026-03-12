"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Share2, BookmarkPlus } from 'lucide-react';

interface Post {
  title: string;
  topic: string;
  content: string;
  caption: string;
  hashtags: string[];
  image_prompt: string;
  date: string;
  slug: string;
  reading_time: string;
}

export default function PostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch(`/api/post/${slug}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setPost(data.post);
      } catch (err) {
        console.error('Failed to load post:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadPost();
  }, [slug]);

  // --- Loading skeleton ---
  if (loading) {
    return (
      <div className="max-w-[700px] mx-auto w-full pt-16 pb-32 px-6 md:px-0 animate-pulse">
        <div className="h-4 w-32 bg-[var(--border)] rounded mb-14" />
        <div className="h-3 w-20 bg-[var(--border)] rounded mb-8" />
        <div className="h-12 w-3/4 bg-[var(--border)] rounded mb-4" />
        <div className="h-12 w-1/2 bg-[var(--border)] rounded mb-12" />
        <div className="border-y border-[var(--border)] py-6 mb-12 flex justify-between">
          <div className="h-4 w-40 bg-[var(--border)] rounded" />
          <div className="flex gap-2">
            <div className="h-10 w-10 bg-[var(--border)] rounded-full" />
            <div className="h-10 w-10 bg-[var(--border)] rounded-full" />
          </div>
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-4 w-full bg-[var(--border)] rounded mb-4" />
        ))}
      </div>
    );
  }

  // --- 404 ---
  if (notFound || !post) {
    return (
      <div className="max-w-[700px] mx-auto w-full pt-32 pb-32 text-center px-6">
        <h1 className="text-4xl font-black text-foreground mb-4">404</h1>
        <p className="text-foreground-secondary mb-8">This post could not be found.</p>
        <Link href="/" className="inline-flex items-center gap-2 text-[13px] font-semibold text-accent hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Stories
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="max-w-[700px] mx-auto w-full pt-16 pb-32">

      {/* Back Navigation */}
      <div className="mb-14 px-6 md:px-0">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase text-foreground-secondary hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Stories
        </Link>
      </div>

      <header className="mb-16 px-6 md:px-0">
        {post.topic && (
          <div className="mb-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
              {post.topic}
            </span>
          </div>
        )}

        <h1 className="text-4xl md:text-[56px] font-black tracking-tighter leading-[1.05] text-foreground mb-8">
          {post.title}
        </h1>

        <div className="flex items-center justify-between py-6 border-y border-[var(--border)] mt-12 mb-12">
          <div className="flex items-center gap-4 text-[13px] text-foreground-secondary">
            <time dateTime={post.date} className="font-semibold text-foreground uppercase tracking-wider">{formattedDate}</time>
            <span className="w-1 h-1 rounded-full bg-border-hover" />
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span className="italic">{post.reading_time || '5 min read'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="h-10 w-10 flex items-center justify-center rounded-full bg-background-secondary text-foreground-secondary hover:bg-[var(--border)] hover:text-foreground transition-all" aria-label="Save post">
              <BookmarkPlus className="w-4 h-4" />
            </button>
            <button className="h-10 w-10 flex items-center justify-center rounded-full bg-background-secondary text-foreground-secondary hover:bg-[var(--border)] hover:text-foreground transition-all" aria-label="Share post">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Reading Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none px-6 md:px-0 font-sans">
        {post.content.split('\n').map((paragraph, idx) => {
          if (!paragraph.trim()) return null;
          return <p key={idx}>{paragraph}</p>;
        })}
      </div>

      {/* Footer */}
      <footer className="mt-24 pt-10 border-t border-[var(--border)] px-6 md:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground-secondary">Tags</span>
            <div className="flex flex-wrap gap-2">
              {post.hashtags?.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-sm bg-background-secondary px-3 py-1.5 text-[12px] font-medium text-foreground-secondary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <Link href="/" className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-foreground text-background text-[13px] font-bold tracking-wide hover:bg-foreground/90 transition-colors">
            Explore More Articles
          </Link>
        </div>
      </footer>
    </article>
  );
}
