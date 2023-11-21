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
import {
  AccessibilityIcon,
  LightningBoltIcon,
  PlayIcon,
  PlusIcon,
  RocketIcon,
  StarFilledIcon,
  TargetIcon,
  TimerIcon,
} from "@radix-ui/react-icons";

import { v4 as uuidv4 } from "uuid";
import { AudioSearch } from "@/src/utils/types";
import {
  convertTime,
  featuresChoseNamesDesciptions,
  spotify2Camelot,
} from "@/src/utils/commonFunctions";
import { addUserPlaylist } from "@/src/utils/addUserPlaylist";
import { useSelector, useDispatch } from "react-redux";
import { TooltipGeneral } from "./TooltipGeneral";

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
                <TableHead className="pl-4">
                  <TooltipGeneral
                    description={featuresChoseNamesDesciptions[0]}
                    component={<LightningBoltIcon />}
                  />
                </TableHead>
                <TableHead className="pl-4">
                  <TooltipGeneral
                    description={featuresChoseNamesDesciptions[1]}
                    component={<AccessibilityIcon />}
                  />
                </TableHead>
                <TableHead className="pl-4">
                  <TooltipGeneral
                    description={featuresChoseNamesDesciptions[2]}
                    component={<TargetIcon />}
                  />
                </TableHead>
                <TableHead className="pl-4">
                  <TooltipGeneral
                    description={featuresChoseNamesDesciptions[3]}
                    component={<RocketIcon />}
                  />
                </TableHead>
                <TableHead className="pl-3">
                  <TooltipGeneral
                    description={featuresChoseNamesDesciptions[4]}
                    component={<StarFilledIcon />}
                  />
                </TableHead>
                <TableHead className="pl-4">
                  <TimerIcon />
                </TableHead>
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
                  <AvatarImage
                    src={track.thumbnail}
                    alt={track.name}
                    loading="lazy"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-extrabold">
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
              <TableCell className="font-extrabold">
                {Math.round(track.BPM)}
              </TableCell>
              <TableCell className="font-extrabold">
                {spotify2Camelot(track.key, track.mode)}
              </TableCell>
              {current_track && (
                <>
                  <TableCell className="text-center text-xs">
                    {(track.energy * 100).toFixed(1)}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {(track.danceability * 100).toFixed(1)}
                  </TableCell>
                  <TableCell className="text-center opacity-80 text-xs">
                    {(track.instrumentalness * 100).toFixed(1)}
                  </TableCell>
                  <TableCell className="text-center opacity-80 text-xs">
                    {(track.valence * 100).toFixed(1)}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {track.popularity}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {convertTime(track.duration)}
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
