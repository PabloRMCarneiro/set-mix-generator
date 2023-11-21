import { handleAudioFeatures } from "./audioFeatures";
import { AudioSearch } from "./types";

async function getTrackInfo(item: any, audioFeatures: any) {
  return {
    id: item.id,
    thumbnail: item.album.images[0].url,
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
  setUserPlaylist: Function
) {
  const trackInfos = await Promise.all(
    items.map((item: any, index: number) =>
      getTrackInfo(item, audioFeaturesList[index])
    )
  );
  setUserPlaylist(trackInfos as unknown as AudioSearch[]);
}

export default async function chosePLaylistToUserPlaylist(
  playlist: any,
  setUserPlaylist: Function,
  token: string
) {
  let url = playlist.tracks.href; // Início da URL de paginação
  let allItems: any = []; // Este array vai acumular todas as faixas

  // Loop para continuar fazendo requisições enquanto houver uma próxima página
  while (url) {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao adicionar faixas à playlist.");
    }

    const data = await response.json();
    allItems = allItems.concat(data.items.map((item: any) => item.track)); // Adiciona as novas faixas

    // Verifica se há uma próxima página, se houver, atualiza a URL
    url = data.next;
  }

  // Agora, allItems contém todas as faixas da playlist
  // Continuar com o processo de extração dos IDs e obtenção das audio features
  const tracksIds = allItems.map((item: any) => item.id);
  
  // Como você pode ter muitos IDs, considere quebrar em partes se necessário
  // Por exemplo, se a API tem um limite de IDs por requisição, divida em grupos menores
  const audioFeaturesList = [];
  for (let i = 0; i < tracksIds.length; i += 100) {
    const segmentIds = tracksIds.slice(i, i + 100); // Pega um segmento de até 100 IDs
    const segmentAudioFeatures = await handleAudioFeatures(segmentIds, token);
    audioFeaturesList.push(...segmentAudioFeatures);
  }

  await setAudioSearchForItems(allItems, audioFeaturesList, setUserPlaylist);
}
