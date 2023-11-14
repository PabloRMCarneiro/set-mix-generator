import { AudioSearch } from "@/src/utils/types";
import { handleAudioFeatures } from "@/src/utils/audioFeatures";
import {
  typeOfMix,
  typeOfBPMRange,
  camelot2Spotify,
  s2c,
} from "@/src/utils/commonFunctions";

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
  };
}

async function setAudioRecomendationForItems(
  items: any,
  audioFeaturesList: AudioSearch[],
  setAudioRecomendation: Function
) {
  const audioRecomendation = await Promise.all(
    items.map((item: any, index: number) =>
      getTrackInfo(item, audioFeaturesList[index])
    )
  );
  setAudioRecomendation(audioRecomendation);
}

export const handleRecomendation = async (
  track: AudioSearch,
  typeMix: string,
  BPMRange: string,
  token: string,
  featuresSliders: [[number], boolean][],
  userPlaylist: AudioSearch[],
  setAudioRecomendation: Function,
  setIsLoading: Function,
  setError: Function
) => {
  setIsLoading(true);
  setError(null);

  const targetMode = typeOfMix[typeMix].modeShift
    ? track.mode === 1
      ? 0
      : 1
    : track.mode;

  const targetKey = camelot2Spotify(
    String(s2c(track.key, track.mode) + typeOfMix[typeMix].keyPlus),
    targetMode
  );

  const min_tempo = track.BPM + typeOfBPMRange[BPMRange]()[0];
  const max_tempo = track.BPM + typeOfBPMRange[BPMRange]()[1];

  const [
    targetEnergy,
    targetDanceability,
    targetInstrumentalness,
    targetValence,
    targetPopularity,
  ] = featuresSliders.map((item) => [item[0], item[1]]);

  const aux = userPlaylist.findIndex((item) => item.id === track.id);
  const seedsTracks =
    aux > 4
      ? userPlaylist
          .slice(aux - 4, aux + 1)
          .map((item) => item.id)
          .join(",")
      : userPlaylist
          .slice(0, aux + 1)
          .map((item) => item.id)
          .join(",");

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?seed_tracks=${seedsTracks}&target_key=${targetKey}&target_mode=${targetMode}&min_tempo=${min_tempo}&max_tempo=${max_tempo}${targetEnergy[1] ? `&target_energy=${targetEnergy[0]}` : ""}${
        targetDanceability[1]
          ? `&target_danceability=${targetDanceability[0]}`
          : ""
      }${
        targetInstrumentalness[1]
          ? `&target_instrumentalness=${targetInstrumentalness[0]}`
          : ""
      }${targetValence[1] ? `&target_valence=${targetValence[0]}` : ""}${
        targetPopularity[1] ? `&target_popularity=${targetPopularity[0]*100}` : ""
      }`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    const items = data.tracks;

    if (items && items.length === 0) {
      setError("Nenhum resultado encontrado.");
      setIsLoading(false);
      return;
    }

    const ids = items && items.map((item: any) => item.id);

    const audioFeaturesList = await handleAudioFeatures(ids, token);

    await setAudioRecomendationForItems(
      items,
      audioFeaturesList,
      setAudioRecomendation
    );
  } catch (error) {
    console.error(error);
    setError("Erro ao buscar recomendações"); // Definir mensagem de erro para falha na busca
  } finally {
    setIsLoading(false); // Encerrar o carregamento independentemente do resultado
  }
};
