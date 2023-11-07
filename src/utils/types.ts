export type AudioSearch = {
  id: string; // rota de search -> items.id
  thumbnail: string; // rota de search -> items.images[0].url
  artists: string;
  artists_ids: string []; 
  name: string; // rota de search -> items.name - items.artists[0].name
  BPM: number; // rota de audio-features -> tempo
  key: number; // rota de audio-features -> (key + mode)
  mode: number;
  preview_url: string; // rota de search -> items
  energy: number; // rota de audio-features -> energy
  danceability: number; // rota de audio-features -> danceability
  duration: number; // rota de audio-features -> duration_ms
  instrumentalness: number; // rota de audio-features -> instrumentalness
  valence: number;
};