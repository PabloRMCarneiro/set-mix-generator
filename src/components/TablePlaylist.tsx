"use client";

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
  RocketIcon,
  StarFilledIcon,
  TargetIcon,
  TimerIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { BsSpotify } from "react-icons/bs";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { AudioSearch } from "@/src/utils/types";

import MagicDialog from "@/src/components/MagicDialog";
import {
  convertTime,
  featuresChoseNamesDesciptions,
  spotify2Camelot,
} from "@/src/utils/commonFunctions";
import { Button } from "@/src/components/ui/button";
import { handleCreatePlaylist } from "@/src/utils/createPlaylist";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useNotifications } from "@/src/providers/NotificationContext";

import { SiBytedance, SiSpotify } from "react-icons/si";
import { TooltipGeneral } from "./TooltipGeneral";
import Link from "next/link";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

export default function TablePlaylist({
  setUserPlaylist,
  userPlaylist,
  onPlayAudio,
  audioRef,
}: {
  userPlaylist: AudioSearch[];
  setUserPlaylist: Function;
  onPlayAudio: Function;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
}) {
  const session = useSession();
  const { toast } = useToast();
  const [notificationCreatePlaylist, setNotificationCreatePlaylist] =
    useState<string>("");

  const handleDeleteTrack = (track: AudioSearch) => () => {
    const newPlaylist = userPlaylist.filter((item) => item.id !== track.id);
    setUserPlaylist(newPlaylist);
    localStorage.setItem("userPlaylist", JSON.stringify(newPlaylist));
  };

  const [playlistName, setplaylistName] = useState<string>(localStorage.getItem("playlistName") || "");

  const handlePlaylist = () => {
    if (playlistName === "") {
      toast({
        variant: "destructive",
        title: <p className="font-bold">Playlist name is empty</p>,
        description: "Please, type a name for your playlist",
        action: <ToastAction altText="---">OK</ToastAction>,
      });
      return;
    } else {
      handleCreatePlaylist(
        playlistName,
        userPlaylist.map((track) => track.id),
        (session.data as any).accessToken,
        setNotificationCreatePlaylist
      );
      notificationCreatePlaylist &&
      // notify(notificationCreatePlaylist, "success");
        toast({
          variant: "success",
          title: <p className="font-bold">{notificationCreatePlaylist }</p>,
          description: "Your playlist is now available on Spotify",
          action: <ToastAction altText="---">OK</ToastAction>,
        });
      
      setNotificationCreatePlaylist("");
    }
  };

  const deleteAllSongs = () => {
    setUserPlaylist([]);
    if (typeof window !== "undefined")
      localStorage.setItem("userPlaylist", JSON.stringify([]));
  };

  const handleOnDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const items = Array.from(userPlaylist);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      setUserPlaylist(items);
      localStorage.setItem("userPlaylist", JSON.stringify(items));
    },
    [userPlaylist, setUserPlaylist]
  );

  console.log(localStorage.getItem("userPlaylist"))

  const [hoverIndexRow, setHoverIndexRow] = useState<number>(-1);
  return (
    <>
      <div className="mx-auto">
        <div
          className="max-h-60 w-auto mx-auto flex justify-between items-center"
          style={
            {
              // border: "1px solid red",
            }
          }
        >
          <div className="block w-10/12">
            <input
              className="text-3xl font-bold bg-transparent border-none outline-none focus:ring-0 w-full"
              type="text"
              placeholder="Playlist Name"
              value={playlistName}
              onChange={(e) => setplaylistName(e.target.value)}
            />
            <div className="flex">
              <p className="text-sm opacity-70 mr-2">
                {userPlaylist !== null ? userPlaylist.length : 0} Songs,{" "}
              </p>
              <p className="text-sm opacity-70 mr-2">
                {userPlaylist !== null
                  ? convertTime(
                      userPlaylist.reduce((acc, curr) => acc + curr.duration, 0)
                    )
                  : "0:00"}{" "}
                Minutes,{" "}
              </p>
              <p className="text-sm opacity-70">
                {userPlaylist !== null
                  ? Math.round(
                      userPlaylist.reduce((acc, curr) => acc + curr.BPM, 0) /
                        userPlaylist.length || 0
                    )
                  : 0}{" "}
                BPM&apos;s Average
              </p>
            </div>
          </div>

          <Button className="flex items-center" onClick={handlePlaylist}>
            <span className="mr-2">
              <BsSpotify />
            </span>
            Add Playlist
          </Button>
        </div>
      </div>

      <div
        style={{
          width: "auto",
          height: "38.5%",
          backgroundColor: "black",
          color: "white",
          overflowY: "auto",
          borderRadius: "1rem",
          background: "#040405ac",
          marginTop: "3rem",
          display:
            userPlaylist !== null && userPlaylist.length === 0
              ? "none"
              : "block",
        }}
        className="elemento-com-scroll-vertical mx-auto box-shadow2"
      >
        <Table className="max-h-60 w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">#</TableHead>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>BPM</TableHead>
              <TableHead className="pr-5">Key</TableHead>
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
              <TableHead className="pl-5">
                <TooltipGeneral
                  description={featuresChoseNamesDesciptions[4]}
                  component={<StarFilledIcon />}
                />
              </TableHead>
              <TableHead className="pl-4">
                <TimerIcon />
              </TableHead>
              <TableHead className="pl-10"></TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                  {userPlaylist !== null &&
                    userPlaylist.map((track, index) => (
                      <Draggable
                        key={track.id}
                        draggableId={track.id}
                        index={index}
                      >
                        {(provided) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            key={track.id}
                            onMouseEnter={() => setHoverIndexRow(index)}
                            onMouseLeave={() => setHoverIndexRow(-1)}
                            className={(track.origen ? "" : "")}
                          >
                            <TableCell className="pl-5 w-12">
                              {hoverIndexRow === index ? (
                                track.preview_url ? (
                                  <PlayIcon
                                    className="hover:cursor-pointer"
                                    onClick={() =>
                                      onPlayAudio(track.preview_url)
                                    }
                                  />
                                ) : (
                                  <PlayIcon className="hover:cursor-not-allowed opacity-50" />
                                )
                              ) : (
                                index + 1
                              )}
                            </TableCell>
                            <TableCell className="w-10">
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
                                  {track.name.length > 40
                                    ? track.name.slice(0, 40) + "..."
                                    : track.name}
                                </p>
                                <p className="opacity-50">
                                  {track.artists.length > 40
                                    ? track.artists.slice(0, 40) + "..."
                                    : track.artists}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center w-3 font-bold">
                              {Math.round(track.BPM)}
                            </TableCell>
                            <TableCell className="text-center w-3 font-bold pr-5">
                              {spotify2Camelot(track.key, track.mode)}
                            </TableCell>
                            <TableCell className="text-center w-3 opacity-80">
                              {(track.energy * 100).toFixed(1)}
                            </TableCell>
                            <TableCell className="text-center w-3 opacity-80">
                              {(track.danceability * 100).toFixed(1)}
                            </TableCell>
                            <TableCell className="text-center w-3 opacity-80">
                              {(track.instrumentalness * 100).toFixed(1)}
                            </TableCell>
                            <TableCell className="text-center w-3 opacity-80">
                              {(track.valence * 100).toFixed(1)}
                            </TableCell>
                            <TableCell className="text-center w-3 pl-5 font-bold">
                              {track.popularity}
                            </TableCell>
                            <TableCell className="text-center w-3 font-bold">
                              {convertTime(track.duration)}
                            </TableCell>
                            <TableCell className="text-center pl-10">
                              <MagicDialog
                                track={track}
                                userPlaylist={userPlaylist}
                                setUserPlaylist={setUserPlaylist}
                                onPlayAudio={onPlayAudio}
                              />
                            </TableCell>
                            <TableCell>
                              <AlertDialog>
                                <AlertDialogTrigger>
                                  <TrashIcon />
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will
                                      remove{" "}
                                      <span className="font-bold">
                                        {track.name}
                                      </span>{" "}
                                      from your playlist.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleDeleteTrack(track)}
                                    >
                                      Continue
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                            <TableCell className="justify-center my-auto pr-5">
                              <SiSpotify
                                onClick={() =>
                                  window.open(track.spotify_link, "_blank")
                                }
                              />
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        </Table>
      </div>
    </>
  );
}
