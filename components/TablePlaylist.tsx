import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlayIcon } from "@radix-ui/react-icons";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { AudioSearch } from "@/app/utils/types";

import MagicDialog from "@/components/MagicDialog";
import { spotify2Camelot } from "@/app/utils/commonFunctions";

export function TablePlaylist({
  query,
  type,
  searchButton,
  setSearchButton,
  playingURL,
  onPlayAudio, // adicionado
}: {
  query: string;
  type: string;
  searchButton: boolean;
  setSearchButton: Function;
  playingURL: string | null;
  onPlayAudio: (url: string) => void; // adicionado
}) {
  // pegar userPlaylist do localstorage
  const [userPlaylist, setUserPlaylist] = useState<AudioSearch[]>(
    JSON.parse(localStorage.getItem("userPlaylist") || "[]")
  );

  // quando atualizar o localstorage, atualizar o userPlaylist
  useEffect(() => {
    setUserPlaylist(JSON.parse(localStorage.getItem("userPlaylist") || "[]"));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem("userPlaylist")]);

  return (
    <>
      <div
        style={{
          width: "50%",
          height: "38.5%",
          backgroundColor: "black",
          color: "white",
          overflowY: "scroll",
          overflowX: "hidden",
          borderRadius: "1rem",
          background: "#040405ac",
          marginTop: "37rem",
        }}
        className="elemento-com-scroll-vertical overflow-y-scroll fixed top-0 right-0 bottom-0 left-0 mx-auto mt-96"
      >
        <Table className="max-h-60 w-full">
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>BPM</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Energy</TableHead>
              <TableHead>Danceability</TableHead>
              <TableHead>Magic</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userPlaylist.map((track) => (
              <TableRow key={uuidv4()} className="hover:cursor-pointer">
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
                <TableCell>{(track.energy * 100).toFixed(1)}</TableCell>
                <TableCell>{(track.danceability * 100).toFixed(1)}</TableCell>
                <TableCell>
                  <MagicDialog
                    track={track}
                    userPlaylist={userPlaylist}
                    setUserPlaylist={setUserPlaylist}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
