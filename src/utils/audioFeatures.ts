export const handleAudioFeatures = async (ids: string[], token: string) => {
  // Dividir o array de ids em subconjuntos de 100
  const maxIdsPerRequest = 100;
  const idSubsets = [];
  for (let i = 0; i < ids.length; i += maxIdsPerRequest) {
    idSubsets.push(ids.slice(i, i + maxIdsPerRequest));
  }

  // Mapear cada subconjunto para uma Promise de resultado de fetch
  const promises = idSubsets.map(async (subset) => {
    const result = await fetch(
      `https://api.spotify.com/v1/audio-features?ids=${subset.join(",")}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await result.json();
    return data.audio_features; // A suposição aqui é que a resposta tem uma propriedade 'audio_features' que é um array
  });

  // Aguardar todas as Promises e combinar os resultados
  const results = await Promise.all(promises);
  const audioFeatures = results.flat(); // Combina todos os arrays de recursos de áudio em um só
  return audioFeatures;
};
