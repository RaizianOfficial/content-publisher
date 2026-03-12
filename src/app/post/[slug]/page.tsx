import { getPostBySlug } from '@/lib/storage';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, Share2, BookmarkPlus } from 'lucide-react';

export const revalidate = 0;

interface PostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return { title: 'Post Not Found - AI Feed' };
  }

  return {
    title: `${post.title} | AI Feed`,
    description: post.caption || `Read ${post.title} on AI Feed`,
    keywords: post.hashtags,
  };
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="max-w-[700px] mx-auto w-full pt-16 pb-32 animate-in fade-in duration-[800ms]">
      
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
        
        {/* Topic Tag */}
        {post.topic && (
          <div className="mb-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
              {post.topic}
            </span>
          </div>
        )}
        
        {/* Title */}
        <h1 className="text-4xl md:text-[56px] font-black tracking-tighter leading-[1.05] text-foreground mb-8">
          {post.title}
        </h1>
        
        {/* Post Metadata Row */}
        <div className="flex items-center justify-between py-6 border-y border-[var(--border)] mt-12 mb-12">
          <div className="flex items-center gap-4 text-[13px] text-foreground-secondary">
            <time dateTime={post.date} className="font-semibold text-foreground uppercase tracking-wider">{formattedDate}</time>
            <span className="w-1 h-1 rounded-full bg-border-hover"></span>
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

      {/* Pure Reading Experience */}
      <div className="prose prose-lg dark:prose-invert max-w-none px-6 md:px-0 font-sans">
        {post.content.split('\n').map((paragraph, idx) => {
          if (!paragraph.trim()) return null;
          return <p key={idx}>{paragraph}</p>;
        })}
      </div>

      {/* Article Footer */}
      <footer className="mt-24 pt-10 border-t border-[var(--border)] px-6 md:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
          
          <div className="flex flex-col gap-3">
             <span className="text-[10px] font-bold uppercase tracking-widest text-foreground-secondary">Tags</span>
             <div className="flex flex-wrap gap-2">
              {post.hashtags?.map(tag => (
                <Link 
                  href={`/?tag=${tag}`}
                  key={tag} 
                  className="inline-flex items-center rounded-sm bg-background-secondary px-3 py-1.5 text-[12px] font-medium text-foreground-secondary hover:text-foreground transition-colors"
                >
                  #{tag}
                </Link>
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
