import {
  MagicWandIcon,
  MagnifyingGlassIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/src/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import TableSkeleton from "./TableSkeleton";
import { Separator } from "@radix-ui/react-select";
import { Button } from "@/src/components/ui/button";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { AudioSearch } from "@/src/utils/types";

import { handleRecomendation } from "@/src/utils/recomendation";
import ShortTable from "./ShortTable";
import SlidersFeatures from "./SlidersFeatures";

import {
  structTypeOfMix,
  structTypeOfBPMRange,
} from "../utils/commonFunctions";
import SelectRecomdations from "./SelectRecomdations";

export default function MagicDialog({
  track,
  userPlaylist,
  setUserPlaylist,
  onPlayAudio,
}: {
  track: AudioSearch;
  userPlaylist: AudioSearch[];
  setUserPlaylist: Function;
  onPlayAudio: Function;
}) {
  const session = useSession();
  const [audioRecomendation, setAudioRecomendation] = useState<AudioSearch[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<any>(null);

  // chamar a função que desenvolve o algoritmo que recomenda os melhores atributos das a partir das ultimas musicas

  // a função vai precisar do index da track para verificar quais as ultimas musicas que foram adicionadas
  // assim, essa irá retornar uma array de atributos por ordem que serpa setado no featuresSliders como os valores iniciais -> e coloridos de alguma cor para indicar que house a recomendação dessas features -> assim que o usuário mover algum slider ela irá mudar para cor default ( branca )

  const [typeMix, setTypeMix] = useState<string>("perfect-mix");
  const [BPMRange, setBPMRange] = useState<string>("two");
  const [featuresSliders, setFeaturesSliders] = useState<number[][]>([
    [0.5],
    [0.5],
    [0.5],
    [0.5],
    [0.5],
    [0.5],
  ]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MagicWandIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="box-shadow2">
        <div
          className="flex elemento-com-scroll-vertical "
          style={{
            height: "auto",
            minHeight: "6rem",
            width: "48rem",
            overflowY: "scroll",
            overflowX: "hidden",
            borderRadius: "1rem",
            background: "#040405ac",
            display: "block",
          }}
        >
          <div className="flex justify-center pt-2 w-full  mb-5">
            <SelectRecomdations
              data={structTypeOfMix}
              placeholder="Mix"
              handlerValueChange={setTypeMix}
            />
            <Separator className="mx-2" />
            <SlidersFeatures
              featuresSliders={featuresSliders}
              setFeaturesSliders={setFeaturesSliders}
            />
            <Separator className="mx-3" />
            <SelectRecomdations
              data={structTypeOfBPMRange}
              placeholder="BPM Range"
              handlerValueChange={setBPMRange}
            />
            <Separator className="mx-3" />
            <Button
              onClick={() =>
                handleRecomendation(
                  track,
                  typeMix,
                  BPMRange,
                  (session.data as any).accessToken,
                  featuresSliders,
                  userPlaylist,
                  setAudioRecomendation,
                  setIsLoading,
                  setErrorMsg
                )
              }
            >
              <MagnifyingGlassIcon />
            </Button>
          </div>

          {isLoading ? (
            <TableSkeleton />
          ) : audioRecomendation.length !== 0 ? (
            <div
              style={{
                height: "13em",
                width: "92%",
                backgroundColor: "rgba(4, 4, 5, 0.675)",
                color: "white",
                overflowY: "scroll",
                overflowX: "hidden",
              }}
              className="box-shadow2 elemento-com-scroll-vertical mx-auto mb-5 border-2 border-none rounded-xl"
            >
              <ShortTable
                audio={audioRecomendation}
                onPlayAudio={onPlayAudio}
                userPlaylist={userPlaylist}
                setUserPlaylist={setUserPlaylist}
                name_delimiter={27}
                current_track={track}
              />
            </div>
          ) : null}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
