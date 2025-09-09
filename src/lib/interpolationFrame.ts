import axios from "axios";

export const interpolationFrame = async (
  videoUrl: string
): Promise<ArrayBuffer> => {
  const response = await axios.post(
    "https://hui200102---video-processor-fastapi-app.modal.run/interpolate_frame",
    {
      video_url: videoUrl,
    },
    {
      responseType: 'arraybuffer'
    }
  );

  if (response.status !== 200) {
    throw new Error("Failed to get interpolation frame");
  }

  return response.data;
};
