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

const postsDirectory = path.join(process.cwd(), 'data', 'posts');

// Helper to calculate reading time
const calculateReadingTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

// Helper to generate a slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const getPosts = (): PostData[] => {
  // Ensure directory exists
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
        // Fallback slug if not present
        if (!data.slug) {
          data.slug = fileName.replace(/\.json$/, '');
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
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });

  return posts;
};

export const getPostBySlug = (slug: string): PostData | null => {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.json`);
    if (!fs.existsSync(fullPath)) return null;
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const data = JSON.parse(fileContents) as PostData;
    
    if (!data.slug) data.slug = slug;
    if (!data.reading_time) data.reading_time = calculateReadingTime(data.content || '');
    
    return data;
  } catch (e) {
    console.error(`Error reading post ${slug}:`, e);
    return null;
  }
};

export const savePost = (data: PostData): PostData => {
  // Ensure directory exists
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

  const fullPath = path.join(postsDirectory, `${slug}.json`);
  fs.writeFileSync(fullPath, JSON.stringify(postToSave, null, 2), 'utf8');
  
  return postToSave;
};
