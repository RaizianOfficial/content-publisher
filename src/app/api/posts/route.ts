import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/storage';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const allPosts = getPosts();
    
    // Pagination logic
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = allPosts.slice(startIndex, endIndex);

    return NextResponse.json({
      posts: paginatedPosts,
      total: allPosts.length,
      page,
      hasMore: endIndex < allPosts.length
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching posts.' },
      { status: 500 }
    );
  }
}
