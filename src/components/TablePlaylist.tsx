
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
import { PlayIcon, TrashIcon } from "@radix-ui/react-icons";
import { BsSpotify } from "react-icons/bs";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { AudioSearch } from "@/src/utils/types";

import MagicDialog from "@/src/components/MagicDialog";
import { convertTime, spotify2Camelot } from "@/src/utils/commonFunctions";
import { Button } from "./ui/button";
import { handleCreatePlaylist } from "@/src/utils/createPlaylist";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useNotifications } from "@/src/providers/NotificationContext";


export default function TablePlaylist({
  setUserPlaylist,
  userPlaylist,
  onPlayAudio, // adicionado
}: {
  userPlaylist: AudioSearch[];
  setUserPlaylist: Function;
  onPlayAudio: Function; // adicionado
  }) {

  const session = useSession();
  const { notify } = useNotifications();
  const [notificationCreatePlaylist, setNotificationCreatePlaylist] = useState<string>("");
  // pegar userPlaylist do localstorage

  const handleDeleteTrack = (track: AudioSearch) => () => {
    const newPlaylist = userPlaylist.filter((item) => item.id !== track.id);
    setUserPlaylist(newPlaylist);
    localStorage.setItem("userPlaylist", JSON.stringify(newPlaylist));
  };

  const [playlistName, setplaylistName] = useState<string>("");

  const handlePlaylist = () => {
    if (playlistName === "") {
      notify("Please, enter a name for your playlist", "error");
      return;
    } else {
      handleCreatePlaylist(
        playlistName,
        userPlaylist.map((track) => track.id),
        (session.data as any).accessToken,
        setNotificationCreatePlaylist
      );
      notificationCreatePlaylist && notify(notificationCreatePlaylist, "success");
      setNotificationCreatePlaylist('')
      
    }
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

  var id: string = "";

  return (
    <>
      <div className="fixed top-0 right-0 bottom-0 left-0 mx-auto mt-96">
        <div
          className="max-h-60 w-7/12 mx-auto mt-32 h-14 flex justify-between items-center"
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
                {userPlaylist.length} Songs,{" "}
              </p>
              <p className="text-sm opacity-70 mr-2">
                {convertTime(
                  userPlaylist.reduce((acc, curr) => acc + curr.duration, 0)
                )}{" "}
                Minutes,{" "}
              </p>
              <p className="text-sm opacity-70">
                {Math.round(
                  userPlaylist.reduce((acc, curr) => acc + curr.BPM, 0) /
                    userPlaylist.length || 0
                )}{" "}
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
          width: "60%",
          height: "38.5%",
          backgroundColor: "black",
          color: "white",
          overflowY: "auto",
          borderRadius: "1rem",
          background: "#040405ac",
          marginTop: "37rem",
        }}
        className="elemento-com-scroll-vertical fixed top-0 right-0 bottom-0 left-0 mx-auto mt-96"
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
              <TableHead>Dance</TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                  {userPlaylist.map((track, index) => (
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
                        >
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
                              />
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
                          <TableCell>
                            {spotify2Camelot(track.key, track.mode)}
                          </TableCell>
                          <TableCell>
                            {(track.energy * 100).toFixed(1)}
                          </TableCell>
                          <TableCell>
                            {(track.danceability * 100).toFixed(1)}
                          </TableCell>
                          <TableCell>
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
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDeleteTrack(track)}
                                  >
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
