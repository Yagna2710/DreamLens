import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { dreamText } = await request.json();

    if (!dreamText || typeof dreamText !== 'string' || dreamText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Dream text is required' },
        { status: 400 }
      );
    }

    // Enhanced prompt for surreal dream-like artwork
    const enhancedPrompt = `${dreamText}, surreal dreamlike digital painting, ethereal, mystical, surrealist art, soft lighting, vivid colors, dream-like atmosphere, high quality digital art, artstation trending, fantasy art, magical realism, 8k, masterpiece`;

    // Use Pollinations.ai direct URL-based generation with parameters
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    const seed = Date.now(); // Unique seed for each generation
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true`;

    return NextResponse.json({
      imageUrl,
      dreamText,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Dream generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}