import userPlaylistActionTypes from "./actionTypes";

const initialState = {
  userPlaylist: [],
};
import { AudioSearch } from "@/src/utils/types";

const userPlaylistReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case userPlaylistActionTypes.ADD_SONG_TO_USER_PLAYLIST:
      return Object.assign({}, state, {
        userPlaylist: [...state.userPlaylist, action.payload],
      });
    case userPlaylistActionTypes.REMOVE_SONG_FROM_USER_PLAYLIST:
      return Object.assign({}, state, {
        userPlaylist: state.userPlaylist.filter(
          (song: AudioSearch) => song.id !== action.payload.id
        ),
      });
    case userPlaylistActionTypes.REMOVE_ALL_SONGS_FROM_USER_PLAYLIST:
      return Object.assign({}, state, {
        userPlaylist: [],
      });
    default:
      return state;
  }
};

export default userPlaylistReducer;