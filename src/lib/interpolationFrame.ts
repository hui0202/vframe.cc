import axios from "axios";

interface InterpolationFrameResponse {
    interpolated_video_url: string;
    request_id: string;
    processing_time_seconds: number;
  }

export const interpolationFrame = async (videoUrl: string): Promise<InterpolationFrameResponse> => {
    const response = await axios.post(
      'https://openart-ai---video-processor-fastapi-app.modal.run/interpolate_frame',
      {
        video_url: videoUrl,
      },
    );
  
    if (response.status !== 200) {
      throw new Error('Failed to get interpolation frame');
    }
  
    return response.data as InterpolationFrameResponse;
  };