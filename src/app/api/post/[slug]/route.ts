import { NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/storage';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const post = getPostBySlug(slug);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post }, { status: 200 });

  } catch (error) {
    console.error(`Error fetching post ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'Internal server error while fetching post.' },
      { status: 500 }
    );
  }
}
