"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

import { useEffect, useRef, useState } from "react";
import TableSearch  from "@/src/components/TableSearch";
import TablePlaylist from "@/src/components/TablePlaylist";
import { AudioSearch } from "@/src/utils/types";

import {
  NotificationProvider,
  useNotifications,
} from "@/src/providers/NotificationContext";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import {
  CheckIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const session = useSession();
  const router = useRouter();

  const [searchSong, setSearchSong] = useState<string>("");
  const [searchButton, setSearchButton] = useState<boolean>(false);

  const [userPlaylist, setUserPlaylist] = useState<AudioSearch[]>(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userPlaylist") || "[]")
      : null
  );
  const [audioSearch, setAudioSearch] = useState<AudioSearch[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingURL, setPlayingURL] = useState<string | null>(null);

  const { notification } = useNotifications();

  const handleAudio = (url: string) => {
    // verificar se a url ainda tem no userPlaylist ( pq se o usuário deletar enquanto toca o preview é pra parar de tocar)

    // Se clicar no mesmo áudio que já está tocando
    if (playingURL === url) {
      if (audioRef.current) {
        if (audioRef.current.paused) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      }
      return;
    }

    // Se já tiver um áudio tocando, pausar
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Se limpar a buscar, não tocar nada
    const audio = new Audio(url);
    audio.play();

    // Armazenar a referência ao novo áudio em reprodução
    audioRef.current = audio;

    // Atualizar o estado do URL em reprodução
    setPlayingURL(url);
  };

  useEffect(() => {
    // Garantir que o áudio seja interrompido ao desmontar o componente
    return () => {
      if (
        !userPlaylist.find((item) => item.preview_url === playingURL) &&
        !audioRef.current?.paused &&
        audioRef.current &&
        audioSearch.length !== 0
      ) {
        audioRef.current.pause();
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
    };
  }, [userPlaylist, playingURL, audioSearch]);

  useEffect(() => {
    // Garantir que o áudio seja interrompido ao desmontar o componente
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // quando atualizar o localstorage, atualizar o userPlaylist
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserPlaylist(JSON.parse(localStorage.getItem("userPlaylist") || "[]"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeof window !== "undefined" ? localStorage.getItem("userPlaylist") : null]);

  if (session.status === 'unauthenticated') {
    router.push("/login");
    return null;
  }

  return (
    <>
      {notification && (
        <Alert
          className={`fixed right-6 bottom-10 w-80 ${
            notification.type === "success"
              ? "bg-green-500"
              : notification.type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === "success" ? (
              <CheckIcon />
            ) : notification.type === "error" ? (
              <ExclamationTriangleIcon />
            ) : (
              <InfoCircledIcon />
            )}
            <AlertDescription>{notification.message}</AlertDescription>
          </div>
        </Alert>
      )}
      <div className="h-screen flex flex-col items-center">
        <div className="flex-grow justify-center items-center justify-center items-center">
          <p className="text-center text-6xl tracking-wider font-black py-10">
            Set Mix Generator
          </p>
          <div className="ps-20 flex space-x-10">
            <div className="w-2/6 ml-14">
              <Input
                type="text"
                placeholder="Search song ..."
                className="w-full"
                value={searchSong}
                onChange={(e) => setSearchSong(e.target.value)}
              />
            </div>
            <div className="w-[180px]">
              <Button onClick={() => setSearchButton(true)}>Search</Button>
            </div>
          </div>
          <div className="py-5">
            <TableSearch
              query={searchSong}
              setSearchSong={setSearchSong}
              searchButton={searchButton}
              setSearchButton={setSearchButton}
              setUserPlaylist={setUserPlaylist}
              onPlayAudio={handleAudio}
              setAudioSearch={setAudioSearch}
              audioSearch={audioSearch}
              userPlaylist={userPlaylist}
            />
            <TablePlaylist
              setUserPlaylist={setUserPlaylist}
              userPlaylist={userPlaylist}
              onPlayAudio={handleAudio}
            />
          </div>
        </div>
      </div>
    </>
  );
}
