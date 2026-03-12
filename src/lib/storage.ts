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

// In Vercel serverless environments, only /tmp is writable
const isVercel = process.env.VERCEL === '1';
const postsDirectory = isVercel 
  ? path.join('/tmp', 'data', 'posts') 
  : path.join(process.cwd(), 'data', 'posts');

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

export const getPosts = (): PostData[] => {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.json'))
    .map(fileName => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      try {
        const data = JSON.parse(fileContents);
        if (!data.slug) {
          // If old files didn't have slug, generate it
          data.slug = generateSlug(data.title);
        }
        if (!data.reading_time) {
          data.reading_time = calculateReadingTime(data.content || '');
        }
        return data as PostData;
      } catch (e) {
        console.error(`Error parsing ${fileName}:`, e);
        return null;
      }
    })
    .filter((post): post is PostData => post !== null)
    .sort((a, b) => {
      // Sort newest first
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return posts;
};

export const getPostBySlug = (slug: string): PostData | null => {
  try {
    const posts = getPosts();
    const post = posts.find(p => p.slug === slug);
    return post || null;
  } catch (e) {
    console.error(`Error reading post ${slug}:`, e);
    return null;
  }
};

export const savePost = (data: PostData): PostData => {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }

  const slug = generateSlug(data.title);
  const reading_time = calculateReadingTime(data.content);
  
  const postToSave: PostData = {
    ...data,
    slug,
    reading_time
  };

  // Requirement: files must be named YYYY-MM-DD.json
  // If multiple posts on same day, append a hash or just use date strings. The prompt said 2026-03-12.json
  const dateObj = new Date(data.date);
  const dateString = dateObj.toISOString().split('T')[0]; // Gets YYYY-MM-DD
  
  // Handle potential filename collisions by appending a short ID if it exists
  let fileName = `${dateString}.json`;
  let fullPath = path.join(postsDirectory, fileName);
  
  if (fs.existsSync(fullPath)) {
    // File exists, append random string
    const randomHash = Math.random().toString(36).substring(2, 7);
    fileName = `${dateString}-${randomHash}.json`;
    fullPath = path.join(postsDirectory, fileName);
  }

  fs.writeFileSync(fullPath, JSON.stringify(postToSave, null, 2), 'utf8');
  return postToSave;
};
