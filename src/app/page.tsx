"use client";

import { useState, useEffect, useCallback } from 'react';
import PostCard from '@/components/PostCard';

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

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  // --- Initial fetch on page load ---
  useEffect(() => {
    async function loadInitialPosts() {
      try {
        const res = await fetch('/api/posts?page=1&limit=10');
        const data = await res.json();
        setPosts(data.posts || []);
        setHasMore(data.hasMore ?? false);
      } catch (err) {
        console.error('Failed to load posts:', err);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    }
    loadInitialPosts();
  }, []);

  // --- Load more posts (infinite scroll) ---
  const loadMorePosts = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/posts?page=${nextPage}&limit=10`);
      const data = await res.json();

      if (data.posts && data.posts.length > 0) {
        setPosts(prev => [...prev, ...data.posts]);
        setPage(nextPage);
        setHasMore(data.hasMore ?? false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more posts:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  // --- IntersectionObserver for infinite scroll ---
  useEffect(() => {
    if (initialLoad) return; // Don't observe until first load is done

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    const el = document.getElementById('scroll-loader');
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [loadMorePosts, loading, initialLoad]);

  // --- Skeleton loader cards ---
  const SkeletonCard = () => (
    <div className="w-full flex flex-col p-8 bg-background border border-[var(--border)] rounded-2xl animate-pulse">
      <div className="flex gap-3 mb-5">
        <div className="h-3 w-16 bg-[var(--border)] rounded" />
        <div className="h-3 w-20 bg-[var(--border)] rounded" />
      </div>
      <div className="h-6 w-3/4 bg-[var(--border)] rounded mb-3" />
      <div className="h-4 w-full bg-[var(--border)] rounded mb-2" />
      <div className="h-4 w-2/3 bg-[var(--border)] rounded mb-8" />
      <div className="border-t border-[var(--border)]/50 pt-4 flex justify-between">
        <div className="h-3 w-16 bg-[var(--border)] rounded" />
        <div className="h-3 w-12 bg-[var(--border)] rounded" />
      </div>
    </div>
  );

  return (
    <div className="w-full pt-20 pb-24">

      {/* Hero Section */}
      <div className="max-w-[700px] mx-auto mb-20 text-center px-6">
        <h1 className="text-5xl md:text-[64px] font-black tracking-tighter text-foreground leading-[1.05] mb-6">
          Ideas that matter.
        </h1>
        <p className="text-[16px] md:text-[18px] text-foreground-secondary leading-[1.6] max-w-[600px] mx-auto font-medium">
          A premium editorial platform delivering high-fidelity AI-generated insights, deep dives, and narratives for the modern curious mind.
        </p>

        <div className="mt-16 flex items-center justify-center">
          <div className="h-[1px] w-12 bg-[var(--border)]" />
          <span className="mx-4 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-secondary">
            Volume 01 — {new Date().getFullYear()}
          </span>
          <div className="h-[1px] w-12 bg-[var(--border)]" />
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Skeleton while first loading */}
        {initialLoad && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!initialLoad && posts.length === 0 && (
          <div className="py-24 max-w-[700px] mx-auto text-center text-foreground-secondary bg-background-secondary/50 border border-dashed border-[var(--border)] rounded-2xl">
            <p className="text-[15px] font-medium">The feed is currently empty.</p>
            <p className="text-[13px] mt-2 opacity-80">Publish a post via the AI Agent to see it appear here.</p>
          </div>
        )}

        {/* Post grid */}
        {!initialLoad && posts.length > 0 && (
          <div className="w-full flex flex-col items-center">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-fr">
              {posts.map((post, idx) => (
                <div key={`${post.slug}-${idx}`} className="flex h-full">
                  <PostCard post={post} />
                </div>
              ))}
            </div>

            {/* Infinite scroll loader */}
            {hasMore && (
              <div
                id="scroll-loader"
                className="w-full flex justify-center items-center py-20 mt-12 transition-opacity duration-300"
                style={{ opacity: loading ? 1 : 0.5 }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] animate-spin" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground-secondary">
                    Loading More Stories
                  </span>
                </div>
              </div>
            )}

            {/* End of feed line */}
            {!hasMore && (
              <div className="w-full flex justify-center py-20 mt-12">
                <div className="h-[1px] w-24 bg-[var(--border)]" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
