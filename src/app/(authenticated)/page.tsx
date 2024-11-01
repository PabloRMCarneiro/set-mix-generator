"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Separator } from "@radix-ui/react-select";

import {
  CheckIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";

import TableSearch from "@/src/components/TableSearch";
import TablePlaylist from "@/src/components/TablePlaylist";
import { AccordionCharts } from "@/src/components/AcordionCharts";


import { AudioSearch } from "@/src/utils/types";


import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { use, useEffect, useRef, useState } from "react";


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


  const handleAudio = (url: string) => {
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

/*   useEffect(() => {
    function getPlaylist() {
      return localStorage.getItem("userPlaylist") || "[]";
    }

    if (typeof window !== "undefined") {
      setUserPlaylist(JSON.parse(getPlaylist()));
    }
  }, []);
 */
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userPlaylist", JSON.stringify(userPlaylist));
    }
  }, [userPlaylist]);


  if (session.status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <div
          className="flex-grow justify-center items-center justify-center items-center"
        >
          <p className="text-center text-7xl tracking-wider font-black pt-24 pb-10">
            Mixingfy
          </p>
          <div className="flex space-x-10 justify-center">
            <div className=" ">
              <Input
                type="text"
                placeholder="Search song ..."
                className="w-full"
                value={searchSong}
                onChange={(e) => setSearchSong(e.target.value)}
              />
            </div>
            <Button onClick={() => setSearchButton(true)}>Search</Button>
          </div>
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
        </div>
        <div className="mt-80" />
        <div
          className="w-6/12 mx-auto"
        >
          <TablePlaylist
            setUserPlaylist={setUserPlaylist}
            userPlaylist={userPlaylist}
            onPlayAudio={handleAudio}
            audioRef={audioRef}
          />
        </div>
        <Separator className="my-14" />
        <div className="w-7/12 mx-auto flex-grow justify-center items-center justify-center items-center">
          <AccordionCharts userPlaylist={userPlaylist} />
        </div>
      </div>
    </>
  );
}
