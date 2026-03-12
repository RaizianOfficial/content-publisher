import { NextResponse } from 'next/server';
import { savePost, PostData } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const data: PostData = await request.json();

    // Basic Validation
    if (!data.title || !data.topic || !data.content || !data.date) {
      return NextResponse.json(
        { error: 'Missing required fields. Must include title, topic, content, and date.' },
        { status: 400 }
      );
    }
    
    // Save to storage
    const savedPost = savePost(data);

    return NextResponse.json({ 
      success: true, 
      message: 'Post published successfully',
      post: savedPost
    }, { status: 201 });

  } catch (error) {
    console.error('Error publishing post:', error);
    return NextResponse.json(
      { error: 'Internal server error while publishing the post.' },
      { status: 500 }
    );
  }
}
