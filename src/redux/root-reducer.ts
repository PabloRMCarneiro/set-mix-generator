import { combineReducers } from "redux";

import userPlaylistReducer from "./userPlaylist/reducer";

const rootReducer = combineReducers({ userPlaylistReducer });

export default rootReducer;