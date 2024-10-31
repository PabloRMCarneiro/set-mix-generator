//notificações

/* 
  quando inserir a música  -> "Música [trackName] adicionada à playlist [playlistName]"

  achei melhor não inserir abaixo da música selecionada e sim no final da playlist como teste de ux
*/
import { AudioSearch } from "./types";

export const addUserPlaylist = (
  trackToAdd: AudioSearch,                
  setUserPlaylist: Function,
  setNotification: Function,
  trackId?: string,
) => {
  const localUserPlaylist: AudioSearch[] = JSON.parse(localStorage.getItem("userPlaylist") || "[]");

  /* if (trackId) {
    const index = localUserPlaylist.findIndex(track => track.id === trackId);
    
    if (index !== -1) {
      localUserPlaylist.splice(index + 1, 0, trackToAdd);
    } else {
      console.error("Track not found. Adding to the end of the playlist.");
      localUserPlaylist.push(trackToAdd);
    }
  } else {
    localUserPlaylist.push(trackToAdd);
  } */

  localStorage.setItem("userPlaylist", JSON.stringify(localUserPlaylist));
  
  setNotification(`${trackToAdd.name} - ${trackToAdd.artists}  added to your playlist`)
  
  setUserPlaylist((prevState: AudioSearch[]) => {
    /* if (false) {
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
    } else { */
      return [...prevState, trackToAdd];
    // }
  });

};