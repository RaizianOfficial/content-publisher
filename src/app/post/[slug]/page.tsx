import { getPostBySlug } from '@/lib/storage';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 0; // Disable static caching for local files

interface PostPageProps {
  params: { slug: string };
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found - AI Feed',
    };
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
    <article className="max-w-2xl mx-auto w-full px-6 py-12 md:py-20 animate-in fade-in duration-500">
      <header className="mb-12">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-foreground/60 hover:text-accent mb-8 transition-colors"
        >
          ← Back to Feed
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight leading-tight text-foreground mb-6">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-x-4 text-sm text-foreground/60 pb-8 border-b border-[var(--border)]">
          <time dateTime={post.date}>{formattedDate}</time>
          <span className="text-accent">•</span>
          <span>{post.reading_time || '5 min read'}</span>
          {post.topic && (
            <>
              <span className="text-accent">•</span>
              <span className="font-medium text-foreground">{post.topic}</span>
            </>
          )}
        </div>
      </header>

      {/* Render plain text content to simple paragraphs for the MVP. In a real app we might use Markdown. */}
      {/* Since AI may include newlines, we split them. */}
      <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-foreground/80 font-serif text-lg md:text-xl leading-relaxed">
        {post.content.split('\n').map((paragraph, idx) => {
          if (!paragraph.trim()) return null;
          return <p key={idx}>{paragraph}</p>;
        })}
      </div>

      <footer className="mt-16 pt-8 border-t border-[var(--border)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            {post.hashtags?.map(tag => (
              <span 
                key={tag} 
                className="inline-flex items-center rounded-full bg-foreground/5 px-3 py-1 text-sm font-medium text-foreground/80"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex gap-4 items-center">
            <span className="text-sm font-medium text-foreground/60 text-right pr-2">Share</span>
            <button className="h-10 w-10 flex items-center justify-center rounded-full border border-[var(--border)] hover:border-accent hover:text-accent transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
              </svg>
            </button>
            <button className="h-10 w-10 flex items-center justify-center rounded-full border border-[var(--border)] hover:border-accent hover:text-accent transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </article>
  );
}
