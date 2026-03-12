"use client";

import { useState, useEffect, useCallback } from 'react';
import { PostData } from '@/lib/storage';
import PostCard from '@/components/PostCard';

interface InfiniteScrollFeedProps {
  initialPosts: PostData[];
}

export default function InfiniteScrollFeed({ initialPosts }: InfiniteScrollFeedProps) {
  const [displayedPosts, setDisplayedPosts] = useState<PostData[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMorePosts = useCallback(async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    
    try {
      const nextPage = page + 1;
      // Fetch specifically using the requirements GET /api/posts and limit=10
      const response = await fetch(`/api/posts?page=${nextPage}&limit=10`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      
      if (data.posts && data.posts.length > 0) {
        setDisplayedPosts(prev => [...prev, ...data.posts]);
        setPage(nextPage);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching more posts:', error);
      setHasMore(false); // Stop trying if there's an error
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const loaderElement = document.getElementById('scroll-loader');
    if (loaderElement) {
      observer.observe(loaderElement);
    }

    return () => {
      if (loaderElement) observer.unobserve(loaderElement);
    };
  }, [loadMorePosts, loading]);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 3-Column CSS Grid Layout */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-fr">
        {displayedPosts.map((post, idx) => (
          <div key={`${post.slug}-${idx}`} className="flex h-full">
            <PostCard post={post} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div 
          id="scroll-loader" 
          className="w-full flex justify-center items-center py-20 mt-12 transition-opacity duration-300"
          style={{ opacity: loading ? 1 : 0.5 }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] animate-spin"></div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground-secondary">
              Loading More Stories
            </span>
          </div>
        </div>
      )}
      
      {!hasMore && displayedPosts.length > 0 && (
        <div className="w-full flex justify-center py-20 mt-12">
          <div className="h-[1px] w-24 bg-[var(--border)]"></div>
        </div>
      )}
      
    </div>
  );
}
