import { getPosts } from '@/lib/storage';
import PostCard from '@/components/PostCard';
import InfiniteScrollFeed from './../components/InfiniteScrollFeed';

export const revalidate = 0;

export default function Home() {
  const posts = getPosts();

  return (
    <div className="w-full pt-20 pb-24 animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <div className="max-w-[700px] mx-auto mb-20 text-center px-6">
        <h1 className="text-5xl md:text-[64px] font-black tracking-tighter text-foreground leading-[1.05] mb-6">
          Ideas that matter.
        </h1>
        <p className="text-[16px] md:text-[18px] text-foreground-secondary leading-[1.6] max-w-[600px] mx-auto font-medium">
          A premium editorial platform delivering high-fidelity AI-generated insights, deep dives, and narratives for the modern curious mind.
        </p>
        
        <div className="mt-16 flex items-center justify-center">
           <div className="h-[1px] w-12 bg-[var(--border)]"></div>
           <span className="mx-4 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-secondary">
             Volume 01 — {new Date().getFullYear()}
           </span>
           <div className="h-[1px] w-12 bg-[var(--border)]"></div>
        </div>
      </div>

      {/* Feed Layout */}
      <div className="max-w-[1200px] mx-auto px-6">
        {posts.length === 0 ? (
          <div className="py-24 max-w-[700px] mx-auto text-center text-foreground-secondary bg-background-secondary/50 border border-dashed border-[var(--border)] rounded-2xl">
            <p className="text-[15px] font-medium">The feed is currently empty.</p>
            <p className="text-[13px] mt-2 opacity-80">Publish a post via the AI Agent to see it appear here.</p>
          </div>
        ) : (
          <InfiniteScrollFeed initialPosts={posts} />
        )}
      </div>
      
    </div>
  );
}
