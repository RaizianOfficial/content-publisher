import fs from 'fs';
import path from 'path';

export interface PostData {
  title: string;
  topic: string;
  content: string;
  caption: string;
  hashtags: string[];
  image_prompt: string;
  date: string;
  slug?: string;
  reading_time?: string;
}

// On Vercel, the repo files are readable at process.cwd() but only /tmp is writable.
// We read from BOTH locations and write only to /tmp.
const isVercel = process.env.VERCEL === '1';
const bundledPostsDir = path.join(process.cwd(), 'data', 'posts');
const tmpPostsDir = path.join('/tmp', 'data', 'posts');

// For local dev, read and write from the same place
const writeDir = isVercel ? tmpPostsDir : bundledPostsDir;

const calculateReadingTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Read JSON post files from a directory. Returns empty array if dir doesn't exist.
 */
const readPostsFromDir = (dir: string): PostData[] => {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      try {
        const raw = fs.readFileSync(path.join(dir, f), 'utf8');
        const data = JSON.parse(raw);
        if (!data.slug) data.slug = generateSlug(data.title);
        if (!data.reading_time) data.reading_time = calculateReadingTime(data.content || '');
        return data as PostData;
      } catch {
        return null;
      }
    })
    .filter((p): p is PostData => p !== null);
};

export const getPosts = (): PostData[] => {
  // Always read from the bundled repo directory
  const bundled = readPostsFromDir(bundledPostsDir);

  // On Vercel, also read any posts written at runtime to /tmp
  const runtime = isVercel ? readPostsFromDir(tmpPostsDir) : [];

  // Merge and deduplicate by slug (runtime wins if duplicate)
  const slugMap = new Map<string, PostData>();
  for (const p of bundled) slugMap.set(p.slug!, p);
  for (const p of runtime) slugMap.set(p.slug!, p);

  return Array.from(slugMap.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const getPostBySlug = (slug: string): PostData | null => {
  return getPosts().find(p => p.slug === slug) || null;
};

export const savePost = (data: PostData): PostData => {
  if (!fs.existsSync(writeDir)) {
    fs.mkdirSync(writeDir, { recursive: true });
  }

  const slug = generateSlug(data.title);
  const reading_time = calculateReadingTime(data.content);

  const postToSave: PostData = { ...data, slug, reading_time };

  const dateString = new Date(data.date).toISOString().split('T')[0];
  let fileName = `${dateString}.json`;
  let fullPath = path.join(writeDir, fileName);

  if (fs.existsSync(fullPath)) {
    const hash = Math.random().toString(36).substring(2, 7);
    fileName = `${dateString}-${hash}.json`;
    fullPath = path.join(writeDir, fileName);
  }

  fs.writeFileSync(fullPath, JSON.stringify(postToSave, null, 2), 'utf8');
  return postToSave;
};
