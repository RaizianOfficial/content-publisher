import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'AI Feed',
  description: 'Ideas that matter. A premium editorial platform for AI generated insights.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased selection:bg-accent selection:text-white`}>
      <body className="font-sans min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        
        {/* Modern Minimal Navigation Bar */}
        <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-xl border-b border-[var(--border)] transition-all">
          <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
            
            {/* Left: Logo + Title */}
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-2.5 group">
                <div className="w-[18px] h-[18px] bg-accent rounded-sm group-hover:scale-110 transition-transform duration-300 shadow-sm"></div>
                <span className="text-[16px] font-bold tracking-tight text-foreground">
                  AI Feed.
                </span>
              </a>
            </div>

            {/* Right: Public Nav */}
            <nav className="flex items-center space-x-7">
              <a href="/" className="text-[13px] font-medium text-foreground-secondary hover:text-foreground transition-colors">
                Explore
              </a>
              <a href="/" className="text-[13px] font-medium text-foreground-secondary hover:text-foreground transition-colors">
                Latest
              </a>
              <a href="#" className="text-[13px] font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors px-4 py-2 rounded-full shadow-sm">
                Subscribe
              </a>
            </nav>
            
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col items-center">
          {children}
        </main>

        {/* Minimal Footer */}
        <footer className="w-full border-t border-[var(--border)] mt-32 bg-background-secondary/30">
          <div className="max-w-[1200px] mx-auto px-6 py-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="max-w-xs">
              <span className="text-[16px] font-bold tracking-tight text-foreground block mb-3">
                AI Feed.
              </span>
              <p className="text-[13px] text-foreground-secondary leading-relaxed">
                The finest editorial curation of AI-driven narratives. Updated weekly with insights that shape our collective future.
              </p>
            </div>
            
            <div className="flex gap-16">
               <div className="flex flex-col gap-3">
                 <span className="text-[11px] font-bold uppercase tracking-widest text-foreground-secondary mb-1">Archive</span>
                 <a href="#" className="text-[13px] text-foreground-secondary hover:text-foreground">2026 Issues</a>
                 <a href="#" className="text-[13px] text-foreground-secondary hover:text-foreground">Special Reports</a>
               </div>
               <div className="flex flex-col gap-3">
                 <span className="text-[11px] font-bold uppercase tracking-widest text-foreground-secondary mb-1">Connect</span>
                 <a href="#" className="text-[13px] text-foreground-secondary hover:text-foreground">Newsletter</a>
                 <a href="#" className="text-[13px] text-foreground-secondary hover:text-foreground">Twitter / X</a>
               </div>
            </div>
          </div>
          
          <div className="max-w-[1200px] mx-auto px-6 py-6 border-t border-[var(--border)] flex justify-between items-center">
             <p className="text-[11px] uppercase tracking-wider text-foreground-secondary/70">
              © {new Date().getFullYear()} AI Feed Editorial
            </p>
            <p className="text-[11px] uppercase tracking-wider text-foreground-secondary/70 group-hover:text-foreground cursor-pointer transition-colors">
              Privacy & Policy
            </p>
          </div>
        </footer>
        
      </body>
    </html>
  );
}
