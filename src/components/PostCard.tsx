import Link from 'next/link';
import { PostData } from '@/lib/storage';

interface PostCardProps {
  post: PostData;
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="group relative w-full flex flex-col items-start justify-between p-8 bg-background border border-[var(--border)] rounded-2xl transition-all duration-300 hover:border-border-hover hover:shadow-lg hover:-translate-y-1">
      
      {/* Top Meta Row */}
      <div className="flex justify-between items-center w-full mb-5">
        <div className="flex items-center gap-3">
          {post.topic && (
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-accent">
              {post.topic}
            </span>
          )}
          <time dateTime={post.date} className="text-[11px] text-foreground-secondary font-medium">
            {formattedDate}
          </time>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="w-full flex-grow">
        <h3 className="text-[20px] md:text-[22px] font-bold tracking-tight text-foreground leading-[1.3] group-hover:text-accent transition-colors mb-3">
          <Link href={`/post/${post.slug}`} prefetch={false}>
            <span className="absolute inset-0" />
            {post.title}
          </Link>
        </h3>
        
        {post.caption && (
          <p className="text-[14px] text-foreground-secondary leading-[1.6] line-clamp-3">
            {post.caption}
          </p>
        )}
      </div>
      
      {/* Footer Meta Row */}
      <div className="flex justify-between items-center w-full mt-8 pt-4 border-t border-[var(--border)]/50">
        <span className="text-[11px] italic text-foreground-secondary">
          {post.reading_time || '5 min read'}
        </span>
        
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex items-center gap-2">
            {post.hashtags.slice(0, 2).map((tag) => (
              <span 
                key={tag} 
                className="text-[10px] text-foreground-secondary tracking-wide group-hover:text-foreground transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
    </article>
  );
}
