"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";

import { AudioSearch } from "@/src/utils/types";
import { handleSearch } from "@/src/utils/search";
import { useNotifications } from "@/src/providers/NotificationContext";
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
        title: <p className="font-bold">Search field is empty</p>,
        description: "Please, type something to search",
        action: <ToastAction altText="---">OK</ToastAction>,
      });
      setSearchButton(false);
      setAudioSearch([]);
    } else {
      setSearchButton(false);
      setAudioSearch([]);
    }
  }, [searchButton, query, session.data, setSearchButton, setAudioSearch, toast]);

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
        notify(errorMsg, "error")
      ) : audioSearch.length !== 0 && query !== "" ? (
        <div
          style={{
            height: "16.5em",
            color: "white",
            borderRadius: "1rem",
            background: "#040405ac",
            overflowY: "auto",
          }}
          className="elemento-com-scroll-vertical mt-5 fixed left-[610px]"
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
