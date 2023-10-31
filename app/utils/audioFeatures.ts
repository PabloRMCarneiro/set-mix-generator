export const handleAudioFeatures = async (id: string, token: string) => {
  const result = await fetch(
    `https://api.spotify.com/v1/audio-features/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await result.json();
  return data;
};
