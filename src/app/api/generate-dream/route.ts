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

    const apiKey = process.env.HUGGINGFACE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Hugging Face API key is not configured. Please add HUGGINGFACE_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    // Enhanced prompt for surreal dream-like artwork
    const enhancedPrompt = `${dreamText}, surreal dreamlike digital painting, ethereal, mystical, surrealist art, soft lighting, vivid colors, dream-like atmosphere, high quality digital art, artstation trending, fantasy art, magical realism, 8k, masterpiece`;

    // Use Hugging Face Inference API with Stable Diffusion XL
    const response = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            negative_prompt: 'blurry, low quality, distorted, ugly, bad anatomy, watermark, text, signature',
            num_inference_steps: 50,
            guidance_scale: 7.5,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', errorText);
      
      // Handle model loading (common with free tier)
      if (response.status === 503) {
        return NextResponse.json(
          { error: 'AI model is loading. Please wait 20 seconds and try again.' },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to generate image. Please try again.' },
        { status: response.status }
      );
    }

    // Convert the blob response to base64
    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;

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