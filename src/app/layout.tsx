import './globals.css';
import { Inter, Merriweather } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-merriweather',
  display: 'swap',
});

export const metadata = {
  title: 'AI Content Feed',
  description: 'A modern, beautiful platform for AI generated written content.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <header className="border-b border-[var(--border)] py-6 px-4 md:px-8 flex justify-between items-center backdrop-blur-sm sticky top-0 bg-background/80 z-10 transition-colors duration-300">
          <div className="max-w-4xl mx-auto w-full flex justify-between items-center">
            <a href="/" className="text-2xl font-serif font-black tracking-tight text-accent hover:opacity-80 transition-opacity">
              AI Feed
            </a>
            <nav className="flex items-center space-x-6">
              <a href="/" className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors">Home</a>
              <a href="/admin" className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors">Admin</a>
            </nav>
          </div>
        </header>

        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>

        <footer className="border-t border-[var(--border)] py-10 mt-20 text-center text-sm text-foreground/60">
          <p>© {new Date().getFullYear()} AI Content Feed. Designed for reading.</p>
        </footer>
      </body>
    </html>
  );
}
