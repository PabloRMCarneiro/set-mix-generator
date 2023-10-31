import { AudioSearch } from "./types";
import { handleAudioFeatures } from "./audioFeatures";

export const handleSearch = async (
  query: string,
  type: string,
  searchButton: boolean,
  token: string,
  setSearchButton: Function,
  setAudioSearch: Function,
) => {
  if (query === "" || type === "" || searchButton === false) return;

  setSearchButton(false);

  const result = await fetch(
    `https://api.spotify.com/v1/search?q=${query.replaceAll(
      " ",
      "+"
    )}&type=${type}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await result.json();
  const items = data.tracks.items;

  async function getTrackInfo(item: any) {
    const audioFeatures = await handleAudioFeatures(item.id, token);

    return {
      id: item.id,
      thumbnail: item.album.images[0].url,
      name: item.name,
      artists: item.artists.map((artist: any) => artist.name).join(", "),
      BPM: audioFeatures.tempo,
      key: audioFeatures.key,
      mode: audioFeatures.mode,
      preview_url: item.preview_url,
      energy: audioFeatures.energy,
      danceability: audioFeatures.danceability,
      duration: audioFeatures.duration_ms,
      instrumentalness: audioFeatures.instrumentalness,
      valence: audioFeatures.valence,
    };
  }

  async function setAudioSearchForItems(items: any[]) {
    const trackInfos = await Promise.all(items.map(getTrackInfo));
    setAudioSearch(trackInfos as unknown as AudioSearch[]);
  }

  setAudioSearchForItems(items);
};
