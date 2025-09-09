import { interpolationFrame } from '@/lib/interpolationFrame';
import { generatePresignedPut } from '@/lib/upload';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {

  try {
    const { videoUrl } = await request.json();

    const video_buffer = await interpolationFrame(videoUrl);

    const name = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.mp4`;

    const { uploadUrl, fileUrl } = await generatePresignedPut(name, 'video/mp4', video_buffer.byteLength, 'videos');

    const buffer = new Uint8Array(video_buffer);
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: buffer,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': video_buffer.byteLength.toString(),
      },
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    return NextResponse.json(fileUrl);

  } catch (error) {
    console.error('Interpolation error:', error);
    return NextResponse.json({ error: 'Failed to interpolate video' }, { status: 500 });
  }
}
