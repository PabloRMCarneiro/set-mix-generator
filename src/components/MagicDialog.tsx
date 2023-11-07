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
import { Slider } from "./ui/slider";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { AudioSearch } from "@/src/utils/types";

import { handleRecomendation } from "@/src/utils/recomendation";
import ShortTable from "./ShortTable";

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

  const defaultValueSlider: number[] = [0.5];
  const [typeMix, setTypeMix] = useState<string>("perfect-mix");
  const [BPMRange, setBPMRange] = useState<string>("two");
  const [featuresSliders, setFeaturesSliders] = useState<number[][]>([
    [0.5],
    [0.5],
    [0.5],
    [0.5],
    [0.5],
  ]);

  const handleResetSlider = () => {
    const newFeaturesSliders = [...featuresSliders];
    newFeaturesSliders.forEach((_, index) => {
      newFeaturesSliders[index] = [0.5];
    });
    setFeaturesSliders(newFeaturesSliders);
  };

  const handleValueSlider = (e: any, index: number) => {
    const newFeaturesSliders = [...featuresSliders];
    newFeaturesSliders[index] = e;
    setFeaturesSliders(newFeaturesSliders);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MagicWandIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div
          className="flex elemento-com-scroll-vertical"
          style={{
            height: "auto",
            minHeight: "6rem",
            width: "48rem",
            backgroundColor: "black",
            color: "white",
            overflowY: "scroll",
            overflowX: "hidden",
            borderRadius: "1rem",
            background: "#040405ac",
            display: "block",
          }}
        >
          <div className="mx-auto flex pt-2 w-full pl-28">
            <Select required onValueChange={(e) => setTypeMix(e)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Mix" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="perfect-mix">Perfect Mix</SelectItem>
                  <SelectItem value="minus-mix">-1 Mix</SelectItem>
                  <SelectItem value="plus-mix">+1 Mix</SelectItem>
                  <SelectItem value="energy-boost">Energy Boost</SelectItem>
                  <SelectItem value="scale-change">Scale Change</SelectItem>
                  <SelectItem value="diagonal-mix">Diagonal Mix</SelectItem>
                  <SelectItem value="jaws-mix">Jaw&apos;s Mix</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Separator className="mx-2" />
            <div className="w-32">
              <DropdownMenu>
                <DropdownMenuTrigger className="">
                  <Button variant="outline">Audio Features </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <div
                    className="elemento-com-scroll-vertical "
                    style={{
                      height: "16em",
                      width: "25em",
                      backgroundColor: "black",
                      color: "white",
                      borderRadius: "1rem",
                      background: "#040405ac",
                    }}
                  >
                    <div className="mx-auto w-10/12">
                      <div className="flex pt-8 w-full text-sm">
                        <p className="pr-12">energy</p>
                        <Slider
                          defaultValue={defaultValueSlider}
                          max={1}
                          step={0.01}
                          value={featuresSliders[0]}
                          onValueChange={(e) => handleValueSlider(e, 0)}
                        />
                      </div>
                      <div className="flex pt-5 w-full text-sm">
                        <p className="pr-4">danceability</p>
                        <Slider
                          defaultValue={defaultValueSlider}
                          max={1}
                          step={0.01}
                          value={featuresSliders[1]}
                          onValueChange={(e) => handleValueSlider(e, 1)}
                        />
                      </div>
                      <div className="flex pt-5 w-full text-sm">
                        <p className="pr-4">instrumental</p>
                        <Slider
                          defaultValue={defaultValueSlider}
                          max={1}
                          step={0.01}
                          value={featuresSliders[2]}
                          onValueChange={(e) => handleValueSlider(e, 2)}
                        />
                      </div>
                      <div className="flex pt-5 w-full text-sm">
                        <p className="pr-12">valence</p>
                        <Slider
                          defaultValue={defaultValueSlider}
                          max={1}
                          step={0.01}
                          value={featuresSliders[3]}
                          onValueChange={(e) => handleValueSlider(e, 3)}
                        />
                      </div>
                      <div className="pt-5 pb-8 flex justify-center">
                        <Button onClick={handleResetSlider}>
                          <ReloadIcon />
                        </Button>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Separator className="mx-3" />
            <Select onValueChange={(e) => setBPMRange(e)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="BPM range" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="two">&plusmn; 2 BPM</SelectItem>
                  <SelectItem value="five">&plusmn; 5 BPM</SelectItem>
                  <SelectItem value="ten">&plusmn; 10 BPM</SelectItem>
                  <SelectItem value="plus-ten">&gt; &plusmn; 10 BPM</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
              className="elemento-com-scroll-vertical overflow-y-scroll pt-6 mx-auto"
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
