"use client";
import { getAllMyPLaylists } from "@/src/utils/myplaylists";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button";
import { AudioSearch } from "@/src/utils/types";
import chosePLaylistToUserPlaylist from "@/src/utils/chosePlaylistToUserPlaylist";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
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
import { Input } from "@/src/components/ui/input";
import { useToast } from "@/src/components/ui/use-toast";
import { ToastAction } from "@/src/components/ui/toast";
import MyPlaylistsSkeleton from "@/src/components/MyPlaylistsSkeleton";
import { Skeleton } from "@/src/components/ui/skeleton";

function Playlists() {
  const session = useSession();
  const { toast } = useToast();

  const [myPlaylists, setMyPlaylists] = useState<any[]>([]);
  const [userPlaylist, setUserPlaylist] = useState<AudioSearch[]>([]);
  const [hoverIndex, setHoverIndex] = useState<number>(-1);
  const [playlistName, setPlaylistName] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (session.data) {
      getAllMyPLaylists(
        (session.data as any).accessToken,
        setMyPlaylists,
        setIsLoading
      );
    }
  }, [session.data]);

  const handleChosePlaylist = (playlist: any) => {
    chosePLaylistToUserPlaylist(
      playlist,
      setUserPlaylist,
      (session.data as any).accessToken
    );
    setPlaylistName(playlist.name);
  };

  const handleCreateNewPlaylist = () => {
    if (playlistName.length > 0) {
      setUserPlaylist([]);
      localStorage.setItem("userPlaylist", "[]");
      localStorage.setItem("playlistName", playlistName);
      window.open("/", "_self");
    } else {
      toast({
        variant: "destructive",
        title: (
          <p className="font-bold">
            Please enter the name of your new playlist
          </p>
        ),
        description: "The name of the playlist cannot be empty",
        action: <ToastAction altText="---">OK</ToastAction>,
      });
    }
  };

  useEffect(() => {
    if (userPlaylist.length > 0) {
      localStorage.setItem("userPlaylist", JSON.stringify(userPlaylist));
      localStorage.setItem("playlistName", playlistName);
      window.open("/", "_self");
    }
  }, [playlistName, userPlaylist]);

  useEffect(() => {
    setUserPlaylist([]);
    setPlaylistName("");
    localStorage.setItem("userPlaylist", "[]");
    localStorage.setItem("playlistName", "");
  }, []);

  return (
    <>
      <div className="w-8/12 mx-auto">
        <div className="pt-24"></div>
        {isLoading ? (
          <>
            <Skeleton
              className="w-24 h-24 mx-auto"
              style={{
                borderRadius: "50%",
              }}
            />
            <Skeleton className="h-4 w-[90px] mt-4 mx-auto"/>
          </>
        ) : (
          <>
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage
                src={session.data?.user?.image || ""}
                alt={session.data?.user?.name || ""}
                loading="lazy"
              />
            </Avatar>
            <p className="text-center mt-2 font-extrabold tracking-wider">
              {session.data?.user?.name || ""}
            </p>
          </>
        )}

        <div className="flex justify-center mx-auto mt-12 mb-16">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Create New Playlist</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogDescription>
                  <Input
                    type="text"
                    placeholder="Enter the name of your new playlist ..."
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    className="font-bold"
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleCreateNewPlaylist}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <p className="text-center text-6xl font-black tracking-wider mb-12">
          My Playlists
        </p>
        <div className="flex flex-wrap justify-center">
          {isLoading ? (
            <MyPlaylistsSkeleton />
          ) : (
            myPlaylists &&
            myPlaylists.map((playlist, index) => (
              <div
                className="w-auto hover:cursor-pointer hover:bg-[#222222] mr-5 mb-5 playlist-item"
                style={{
                  width: "12rem",
                  height: "14.5rem",
                  borderRadius: "10px",
                  transition: "all 0.2s ease-in-out",
                }}
                key={index}
                onClick={() => handleChosePlaylist(playlist)}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(-1)}
              >
                {/* {hoverIndex === index && (
                  <div
                    className="sticky flex items-center justify-center w-12 h-12"
                    style={{
                      borderRadius: "50%",
                      backgroundColor: "white",
                      top: "55%",
                      left: "60%",
                    }}
                  >
                    <PlusIcon className="w-6 h-6 text-white" />
                  </div>
                )} */}
                <img
                  src={playlist.images[0].url}
                  alt={playlist.name}
                  className="mx-auto mt-6" // "PRYAN @ Analog Daydreams Vol 2"
                  loading="lazy"
                  style={{
                    width: "80%",
                    height: "auto",
                  }}
                />
                <p className="text-center font-black pt-4">
                  {playlist.name.length > 18
                    ? playlist.name.slice(0, 18) + "..."
                    : playlist.name}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Playlists;
