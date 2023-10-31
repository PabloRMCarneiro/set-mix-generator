import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "@radix-ui/react-icons";
import { spotify2Camelot } from "@/app/utils/commonFunctions";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";

import { AudioSearch } from "@/app/utils/types";
import { handleSearch } from "@/app/utils/search";

export function TableSearch({
  query,
  type,
  searchButton,
  setSearchButton,
  setUserPlaylist,
  playingURL, 
  onPlayAudio,
}: {
  query: string;
  type: string;
  searchButton: boolean;
  setSearchButton: Function;
  setUserPlaylist: Function;
  playingURL: string | null; 
  onPlayAudio: (url: string) => void;
}) {
  const session = useSession();
  const [audioSearch, setAudioSearch] = useState<AudioSearch[]>([]);

  const addUserPlaylist = (track: AudioSearch) => {
    setUserPlaylist((prevState: AudioSearch[]) => [...prevState, track]);
    // adicionar no localstorage
    const localUserPlaylist = JSON.parse(
      localStorage.getItem("userPlaylist") || "[]"
    );
    localUserPlaylist.push(track);
    localStorage.setItem("userPlaylist", JSON.stringify(localUserPlaylist));
  };

  useEffect(() => {
    if (searchButton && query !== "") {
      handleSearch(
        query,
        type,
        searchButton,
        (session.data as any).accessToken, 
        setSearchButton,
        setAudioSearch
      );
    }
  }, [searchButton, query, session, type, setSearchButton]);


  return (
    <div
      style={{
        height: "13.2em",
        backgroundColor: "black",
        color: "white",
        overflowY: "scroll",
        overflowX: "hidden",
        borderRadius: "1rem",
        background: "#040405ac",
        display: `${
          (audioSearch.length === 0 || query === "") && !searchButton
            ? "none"
            : "block"
        }`,
      }}
      className="elemento-com-scroll-vertical overflow-y-scroll"
    >
      <Table className="max-h-60 w-full">
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Thumbnail</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>BPM</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Add</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audioSearch.map((track) => (
            <TableRow key={uuidv4()}>
              <TableCell>
                {track.preview_url ? (
                  <PlayIcon
                    className="w-10 hover:cursor-pointer"
                    onClick={() => onPlayAudio(track.preview_url)}
                  />
                ) : (
                  <PlayIcon className="w-10 opacity-20 hover:cursor-not-allowed" />
                )}
              </TableCell>
              <TableCell>
                <Avatar>
                  <AvatarImage src={track.thumbnail} alt={track.name} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>
                <div>
                  <p>
                    {track.name.length > 60
                      ? track.name.slice(0, 60) + "..."
                      : track.name}
                  </p>
                  <p className="opacity-50">
                    {track.artists.length > 60
                      ? track.artists.slice(0, 60) + "..."
                      : track.artists}
                  </p>
                </div>
              </TableCell>
              <TableCell>{Math.round(track.BPM)}</TableCell>
              <TableCell>{spotify2Camelot(track.key, track.mode)}</TableCell>
              <TableCell>
                <Button
                  className="text-xl"
                  onClick={() => addUserPlaylist(track)}
                >
                  +
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
