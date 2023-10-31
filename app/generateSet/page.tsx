"use client";

import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useRef, useState } from "react";
import { TableSearch } from "@/components/TableSearch";
import { TablePlaylist } from "@/components/TablePlaylist";
import { AudioSearch } from "../utils/types";

export default function GenerateSet() {
  const [searchSong, setSearchSong] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("track"); // fazer a logica de pegar o tipo
  const [searchButton, setSearchButton] = useState<boolean>(false);

  const [userPlaylist, setUserPlaylist] = useState<AudioSearch[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingURL, setPlayingURL] = useState<string | null>(null);

  const handleSearch = () => {
    // verificar se tem algo no searchSong
    if (searchSong === "") {
      return;
    } // retornar um toggle vermelho alertando o erro

    setSearchButton(true);
  };

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
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <>
      <div className="h-screen flex flex-col items-center">
        <div className="flex-grow justify-center items-center justify-center items-center">
          <p className="text-center text-6xl tracking-wider font-black py-20">
            Set Mix Generator
          </p>
          <div className="ps-20 flex space-x-10">
            <div className="w-2/6">
              <Input
                type="text"
                placeholder="Search song ..."
                className="w-full"
                value={searchSong}
                onChange={(e) => setSearchSong(e.target.value)}
              />
            </div>
            <div className="w-[180px]">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="track">Track</SelectItem>
                    <SelectItem value="artist">Artist</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-[180px]">
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </div>
          <div className="py-5">
            <TableSearch
              query={searchSong}
              type={searchType}
              searchButton={searchButton}
              setSearchButton={setSearchButton}
              setUserPlaylist={setUserPlaylist}
              playingURL={playingURL}
              onPlayAudio={handleAudio}
            />
            <TablePlaylist
              query={searchSong}
              type={searchType}
              searchButton={searchButton}
              setSearchButton={setSearchButton}
              playingURL={playingURL}
              onPlayAudio={handleAudio}
            />
          </div>
        </div>
      </div>
    </>
  );
}
