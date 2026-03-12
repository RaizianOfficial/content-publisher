import Link from 'next/link';
import { PostData } from '@/lib/storage';

interface PostCardProps {
  post: PostData;
}

export default function PostCard({ post }: PostCardProps) {
  // Format the date to look elegant
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="group relative flex flex-col items-start justify-between py-8 border-b border-[var(--border)] last:border-0 transition-all hover:bg-foreground/[0.02] -mx-4 px-4 rounded-xl">
      <div className="flex items-center gap-x-4 text-xs text-foreground/60 mb-3">
        <time dateTime={post.date}>
          {formattedDate}
        </time>
        <span className="text-accent">•</span>
        <span>{post.reading_time || '5 min read'}</span>
      </div>
      
      <div className="group relative w-full">
        <h3 className="mt-3 text-2xl font-serif font-bold text-foreground group-hover:text-accent transition-colors">
          <Link href={`/post/${post.slug}`}>
            <span className="absolute inset-0" />
            {post.title}
          </Link>
        </h3>
        
        {post.caption && (
          <p className="mt-4 text-lg text-foreground/70 mb-4 line-clamp-3 leading-relaxed">
            {post.caption}
          </p>
        )}
      </div>
      
      {post.hashtags && post.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {post.hashtags.map((tag) => (
            <span 
              key={tag} 
              className="inline-flex items-center rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium text-foreground/80"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
