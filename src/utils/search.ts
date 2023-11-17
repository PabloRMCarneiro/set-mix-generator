import { AudioSearch } from "./types";
import { handleAudioFeatures } from "./audioFeatures";

// Função para buscar informações de uma faixa
async function getTrackInfo(item: any, audioFeatures: any) {
  return {
    id: item.id,
    thumbnail: item.album.images[2].url,
    name: item.name,
    artists: item.artists.map((artist: any) => artist.name).join(", "),
    artists_ids: item.artists.map((artist: any) => artist.id),
    BPM: audioFeatures.tempo,
    key: audioFeatures.key,
    mode: audioFeatures.mode,
    preview_url: item.preview_url,
    energy: audioFeatures.energy,
    danceability: audioFeatures.danceability,
    duration: audioFeatures.duration_ms,
    instrumentalness: audioFeatures.instrumentalness,
    valence: audioFeatures.valence,
    popularity: item.popularity,
    origin: false,
    spotify_link: item.external_urls.spotify,
  };
}

// Função para associar resultados da pesquisa de áudio com itens
async function setAudioSearchForItems(
  items: any,
  audioFeaturesList: AudioSearch[],
  setAudioSearch: Function
) {
  const trackInfos = await Promise.all(
    items.map((item: any, index: number) =>
      getTrackInfo(item, audioFeaturesList[index])
    )
  );
  setAudioSearch(trackInfos as unknown as AudioSearch[]);
}

export const handleSearch = async (
  query: string,
  searchButton: boolean,
  token: string,
  setSearchButton: Function,
  setAudioSearch: Function,
  setIsLoading: Function,
  setError: Function,
  type?: string,
) => {
  if (query === "" || searchButton === false) {
    setError("Preencha todos os campos");
    return;
  }

  setSearchButton(false);
  setIsLoading(true);
  setError(null);

  try {
    const result = await fetch(
      `https://api.spotify.com/v1/search?q=${query.replaceAll(
        " ",
        "+"
      )}&type=${type ? type : 'track'}&limit=50`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await result.json();
    
    if (type === 'artist') {
      setAudioSearch(data.artists.items);
      return;
    } 

    const items = data.tracks.items;

    if (items.length === 0) {
      setError("Nenhum resultado encontrado.");
      setIsLoading(false);
      return;
    }


    const ids = items.map((item: any) => item.id);

    const audioFeaturesList = await handleAudioFeatures(ids, token);

    await setAudioSearchForItems(items, audioFeaturesList, setAudioSearch);
  } catch (error) {
    console.error(error);
    setError("Nenhum resultado encontrado.");
  } finally {
    setIsLoading(false);
  }
};
