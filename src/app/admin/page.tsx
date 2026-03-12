import { getPosts } from '@/lib/storage';
import Link from 'next/link';

export const revalidate = 0;

export default function AdminDashboard() {
  const posts = getPosts();
  const totalPosts = posts.length;
  const lastSubmission = posts.length > 0 ? posts[0].date : null;

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-12 md:py-20 animate-in fade-in">
      <h1 className="text-3xl font-serif font-black tracking-tight text-foreground mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-foreground/[0.02] border border-[var(--border)] rounded-2xl p-6 flex flex-col justify-center">
          <span className="text-sm font-medium text-foreground/60 mb-2 uppercase tracking-wider">Total Posts</span>
          <span className="text-5xl font-bold tracking-tighter text-foreground">{totalPosts}</span>
        </div>
        
        <div className="bg-foreground/[0.02] border border-[var(--border)] rounded-2xl p-6 flex flex-col justify-center">
          <span className="text-sm font-medium text-foreground/60 mb-2 uppercase tracking-wider">Last AI Submission</span>
          <span className="text-xl font-medium text-foreground">
            {lastSubmission 
              ? new Date(lastSubmission).toLocaleString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
                })
              : 'No posts yet'
            }
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-6 text-foreground">Recent Posts</h2>
        <div className="bg-background border border-[var(--border)] rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-foreground/[0.02]">
                <th className="py-4 px-6 text-xs font-semibold text-foreground/60 uppercase tracking-wider">Title</th>
                <th className="py-4 px-6 text-xs font-semibold text-foreground/60 uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="py-4 px-6 text-xs font-semibold text-foreground/60 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {posts.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-foreground/50">No posts available</td>
                </tr>
              )}
              {posts.slice(0, 10).map((post) => (
                <tr key={post.slug} className="hover:bg-foreground/[0.01] transition-colors">
                  <td className="py-4 px-6 font-medium text-sm text-foreground max-w-[200px] truncate">
                    {post.title}
                  </td>
                  <td className="py-4 px-6 text-sm text-foreground/70 hidden sm:table-cell">
                    {new Date(post.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link 
                      href={`/post/${post.slug}`} 
                      className="text-xs font-medium text-accent hover:underline bg-accent/10 px-3 py-1.5 rounded-full"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
