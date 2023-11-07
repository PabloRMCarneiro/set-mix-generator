//notificações

/* 
  quando inserir a música  -> "Música [trackName] adicionada à playlist [playlistName]"
*/
import { AudioSearch } from "./types";

export const addUserPlaylist = (
  trackToAdd: AudioSearch,                
  setUserPlaylist: Function,
  trackId?: string                       
) => {
  const localUserPlaylist: AudioSearch[] = JSON.parse(localStorage.getItem("userPlaylist") || "[]");

  if (trackId) {
    const index = localUserPlaylist.findIndex(track => track.id === trackId);
    
    if (index !== -1) {
      localUserPlaylist.splice(index + 1, 0, trackToAdd);
    } else {
      console.error("Track not found. Adding to the end of the playlist.");
      localUserPlaylist.push(trackToAdd);
    }
  } else {
    localUserPlaylist.push(trackToAdd);
  }

  localStorage.setItem("userPlaylist", JSON.stringify(localUserPlaylist));

  setUserPlaylist((prevState: AudioSearch[]) => {
    if (trackId) {
      const index = prevState.findIndex(track => track.id === trackId);
      if (index !== -1) {
        return [
          ...prevState.slice(0, index + 1),
          trackToAdd,
          ...prevState.slice(index + 1)
        ];
      } else {
        return [...prevState, trackToAdd];
      }
    } else {
      return [...prevState, trackToAdd];
    }
  });
};