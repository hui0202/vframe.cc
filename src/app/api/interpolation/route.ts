import { interpolationFrame } from '@/lib/interpolationFrame';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {

  try {
    const { videoUrl } = await request.json();

    const { interpolated_video_url } = await interpolationFrame(videoUrl);

    return NextResponse.json(interpolated_video_url);

  } catch (error) {
    console.error('Interpolation error:', error);
    return NextResponse.json({ error: 'Failed to interpolate video' }, { status: 500 });
  }
}
