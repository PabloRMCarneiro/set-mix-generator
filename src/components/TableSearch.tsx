"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";

import { AudioSearch } from "@/src/utils/types";
import { handleSearch } from "@/src/utils/search";
import ShortTable from "./ShortTable";
import TableSkeleton from "./TableSkeleton";
import { ToastAction } from "@/src/components/ui/toast";

import { useSelector, useDispatch } from "react-redux";
import { useToast } from "./ui/use-toast";

export default function TableSearch({
  query,
  setSearchSong,
  searchButton,
  setSearchButton,
  setUserPlaylist,
  userPlaylist,
  setAudioSearch,
  audioSearch,
  onPlayAudio,
}: {
  query: string;
  setSearchSong: Function;
  searchButton: boolean;
  setSearchButton: Function;
  setUserPlaylist: Function;
  userPlaylist: AudioSearch[];
  setAudioSearch: Function;
  audioSearch: AudioSearch[];
  onPlayAudio: (url: string) => void;
}) {
  const session = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<any>(null);

  useEffect(() => {
    if (searchButton && query !== "") {
      handleSearch(
        query,
        searchButton,
        (session.data as any).accessToken,
        setSearchButton,
        setAudioSearch,
        setIsLoading,
        setErrorMsg
      );
    } else if (searchButton && query === "") {
      toast({
        variant: "destructive",
        title: "Search field is empty",
        description: "Please, type something to search",
      });
      setSearchButton(false);
      setAudioSearch([]);
    } else {
      setSearchButton(false);
      setAudioSearch([]);
    }
  }, [
    searchButton,
    query,
    session.data,
    setSearchButton,
    setAudioSearch,
    toast,
  ]);

  const tableRef = useRef<HTMLDivElement>(null); // Ref para o elemento da tabela

  // Função para fechar o TableSearch
  const closeSearch = () => {
    setAudioSearch([]); // Isto irá limpar a lista e fechar o componente
  };

  // Função para verificar se o clique foi fora do componente
  const handleClickOutside = (event: MouseEvent) => {
    if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
      closeSearch();
    }
  };

  useEffect(() => {
    // Se audioSearch tiver conteúdo, adicione o listener
    if (audioSearch.length > 0) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Limpe o event listener quando o componente for desmontado
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioSearch.length]);

  return (
    <>
      {isLoading ? (
        <div className="fixed left-[610px] top-[250px]">
          <TableSkeleton />
        </div>
      ) : errorMsg ? (
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMsg,
        })
      ) : audioSearch.length !== 0 && query !== "" ? (
        <div
          style={{
            height: "16.5em",
            color: "white",
            borderRadius: "1rem",
            background: "#040405ac",
            overflowY: "auto",
            marginBottom: "-5rem",
          }}
          className="elemento-com-scroll-vertical mt-5 "
        >
          <ShortTable
            setSearchSong={setSearchSong}
            setUserPlaylist={setUserPlaylist}
            userPlaylist={userPlaylist}
            audio={audioSearch}
            onPlayAudio={onPlayAudio}
            name_delimiter={60}
          />
        </div>
      ) : null}
    </>
  );
}
