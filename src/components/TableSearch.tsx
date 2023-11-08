import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";

import { AudioSearch } from "@/src/utils/types";
import { handleSearch } from "@/src/utils/search";
import { useNotifications } from "@/src/providers/NotificationContext";
import ShortTable from "./ShortTable";
import TableSkeleton from "./TableSkeleton";

export default function TableSearch({
  query,
  setSearchSong,
  searchButton,
  setSearchButton,
  setUserPlaylist,
  userPlaylist,
  setAudioSearch,
  audioSearch,
  onPlayAudio,
}: {
  query: string;
  setSearchSong: Function;
  searchButton: boolean;
  setSearchButton: Function;
  setUserPlaylist: Function;
  userPlaylist: AudioSearch[];
  setAudioSearch: Function;
  audioSearch: AudioSearch[];
  onPlayAudio: (url: string) => void;
}) {
  const session = useSession();
  const { notify } = useNotifications();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<any>(null);

  useEffect(() => {
    if (searchButton && query !== "") {
      handleSearch(
        query,
        searchButton,
        (session.data as any).accessToken,
        setSearchButton,
        setAudioSearch,
        setIsLoading,
        setErrorMsg
      );
    } else if (searchButton && query === "") {
      notify("Please, type a song name to search", "error");
      setSearchButton(false);
      setAudioSearch([]);
    }
  }, [searchButton, query, session, setSearchButton, setAudioSearch, notify]);


  return (
    <>
      {isLoading ? (
        <TableSkeleton />
      ) : errorMsg ? (
        notify(errorMsg, "error")
      ) : audioSearch.length !== 0 && query !== "" ? (
        <div
          style={{
            height: "16.5em",
            color: "white",
            borderRadius: "1rem",
            background: "#040405ac",
            overflowY: "auto",
          }}
          className="elemento-com-scroll-vertical mt-5"
        >
          <ShortTable
            setSearchSong={setSearchSong}
            setUserPlaylist={setUserPlaylist}
            userPlaylist={userPlaylist}
            audio={audioSearch}
            onPlayAudio={onPlayAudio}
            name_delimiter={60}
          />
        </div>
      ) : null}
    </>
  );
}

