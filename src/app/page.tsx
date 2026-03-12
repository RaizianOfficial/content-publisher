import { getPosts } from '@/lib/storage';
import PostCard from '@/components/PostCard';

export const revalidate = 0; // Disable static caching for local files

export default function Home() {
  const posts = getPosts();

  return (
    <div className="max-w-3xl border-x-[1px] border-[var(--border)] min-h-screen mx-auto w-full px-6 md:px-12 py-10">
      <div className="mb-12 border-b border-[var(--border)] pb-8">
        <h1 className="text-4xl font-serif font-black tracking-tight text-foreground sm:text-5xl">
          Latest Notes
        </h1>
        <p className="mt-4 text-lg text-foreground/70">
          A minimalist feed of AI generated insights and stories.
        </p>
      </div>

      <div className="flex flex-col gap-y-4">
        {posts.length === 0 ? (
          <div className="py-20 text-center text-foreground/50 border border-dashed border-[var(--border)] rounded-xl">
            <p className="text-lg">The feed is empty.</p>
            <p className="text-sm mt-2">Publish a post via the AI Agent to see it here.</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
