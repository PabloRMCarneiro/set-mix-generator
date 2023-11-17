import { MagicWandIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/src/components/ui/dropdown-menu";

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
import SearchUserSeeds from "./SearchUserSeeds";
import { TooltipGeneral } from "./TooltipGeneral";

export type Seeds = {
  seeds_artists: string[];
  seeds_tracks: string[];
};

export type SeedsIntern = {
  ids: string[];
  thumbs: string[];
};

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

  const [typeMix, setTypeMix] = useState<string>("perfect-mix");
  const [BPMRange, setBPMRange] = useState<string>("two");
  const [featuresSliders, setFeaturesSliders] = useState<[[number], boolean][]>(
    [
      [[0.5], false],
      [[0.5], false],
      [[0.5], false],
      [[0.5], false],
      [[0.5], false],
    ]
  );

  const [userSeeds, setUserSeeds] = useState<Seeds>({
    seeds_artists: [],
    seeds_tracks: [],
  });

  const [seeds, setSeeds] = useState<SeedsIntern>({
    ids: [],
    thumbs: [],
  });


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
            width: "52rem",
            overflowY: "scroll",
            overflowX: "hidden",
            borderRadius: "1rem",
            background: "#040405ac",
            display: "block",
          }}
        >
          <div className="flex justify-center pt-8  mb-5">
            <SelectRecomdations
              data={structTypeOfMix}
              placeholder="Mix"
              handlerValueChange={setTypeMix}
            />
            <Separator className="mx-3" />
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
            <SearchUserSeeds seeds={seeds} setSeeds={setSeeds} />

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
                name_delimiter={15}
                current_track={track}
              />
            </div>
          ) : null}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
