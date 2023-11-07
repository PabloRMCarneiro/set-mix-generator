import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { PlayIcon, PlusIcon } from "@radix-ui/react-icons";

import { v4 as uuidv4 } from "uuid";
import { AudioSearch } from "@/src/utils/types";
import { spotify2Camelot } from "@/src/utils/commonFunctions";
import { addUserPlaylist } from "@/src/utils/addUserPlaylist";

function ShortTable({
  setSearchSong,
  setUserPlaylist,
  userPlaylist,
  audio,
  onPlayAudio,
  name_delimiter,
  current_track,
}: {
  setSearchSong?: Function;
  setUserPlaylist: Function;
  userPlaylist: AudioSearch[];
  audio: AudioSearch[];
  onPlayAudio: Function;
  name_delimiter: number;
  current_track?: AudioSearch;
}) {
  const [isRepeatedMusic, setIsRepeatedMusic] = useState<boolean>(false);

  const handleAddMusic = (track: AudioSearch) => {
    const _isRepeatedMusic = userPlaylist.some(
      (music) => music.id === track.id
    );

    if (_isRepeatedMusic) {
      setIsRepeatedMusic(true);
      return;
    } else {
      setIsRepeatedMusic(false);
      current_track
        ? addUserPlaylist(track, setUserPlaylist, current_track.id)
        : addUserPlaylist(track, setUserPlaylist);
      setSearchSong && setSearchSong("");
    }
  };

  return (
    <>
      {isRepeatedMusic && (
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Repeated music detected</AlertDialogTitle>
              <AlertDialogDescription>
                This music is already in the playlist
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsRepeatedMusic(false)}>
                Cancel
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <Table className="max-h-60 w-full">
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Thumbnail</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>BPM</TableHead>
            <TableHead>Key</TableHead>
            {current_track && (
              <>
                <TableHead>Energy</TableHead>
                <TableHead>Dance</TableHead>
              </>
            )}
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audio.map((track) => (
            <TableRow key={track.id}>
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
                    {track.name.length > name_delimiter
                      ? track.name.slice(0, name_delimiter) + "..."
                      : track.name}
                  </p>
                  <p className="opacity-50">
                    {track.artists.length > name_delimiter
                      ? track.artists.slice(0, name_delimiter) + "..."
                      : track.artists}
                  </p>
                </div>
              </TableCell>
              <TableCell>{Math.round(track.BPM)}</TableCell>
              <TableCell>{spotify2Camelot(track.key, track.mode)}</TableCell>
              {current_track && (
                <>
                  <TableCell>{(track.energy * 100).toFixed(1)}</TableCell>
                  <TableCell>
                    {" "}
                    {(track.danceability * 100).toFixed(1)}
                  </TableCell>
                </>
              )}
              <TableCell>
                <PlusIcon
                  onClick={() => handleAddMusic(track)}
                  className="hover: cursor-pointer w-5 h-5"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default ShortTable;
