import {
  MagicWandIcon,
  MagnifyingGlassIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Separator } from "@radix-ui/react-select";
import { Button } from "@/components/ui/button";
import { Slider } from "./ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { AudioSearch } from "@/app/utils/types";
import {
  spotify2Camelot,
  typeOfBPMRange,
  typeOfMix,
} from "@/app/utils/commonFunctions";

import { handleAudioFeatures } from "@/app/utils/audioFeatures";


export default function MagicDialog({
  track,
  userPlaylist,
  setUserPlaylist,
}: {
  track: AudioSearch;
  userPlaylist: AudioSearch[];
  setUserPlaylist: Function;
}) {
  const session = useSession();

  const [audioRecomendation, setAudioRecomendation] = useState<AudioSearch[]>(
    []
  );

  const addUserPlaylist = (track: AudioSearch) => {
    const localUserPlaylist = JSON.parse(
      localStorage.getItem("userPlaylist") || "[]"
    );
    localUserPlaylist.push(track);
    localStorage.setItem("userPlaylist", JSON.stringify(localUserPlaylist));
    setUserPlaylist((prevState: AudioSearch[]) => [...prevState, track]);
  };

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


  const handleRecomendation = async () => {
    // api do spotify
    const targetKey = track.key + typeOfMix[typeMix].keyPlus;
    const targetMode = typeOfMix[typeMix].modeShift
      ? track.mode === 1
        ? 0
        : 1
      : track.mode;
    const min_tempo = track.BPM + typeOfBPMRange[BPMRange]()[0];
    const max_tempo = track.BPM + typeOfBPMRange[BPMRange]()[1];
    const targetEnergy = featuresSliders[0][0];
    const targetDanceability = featuresSliders[1][0];
    const targetInstrumentalness = featuresSliders[2][0];
    const targetValence = featuresSliders[3][0];
    const aux = userPlaylist.findIndex((item) => item.id === track.id);
    const seedsTracks =
      aux > 4
        ? userPlaylist
            .slice(aux - 4, aux + 1)
            .map((item) => item.id)
            .join(",")
        : userPlaylist
            .slice(0, aux + 1)
            .map((item) => item.id)
            .join(",");

    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?seed_tracks=${seedsTracks}&target_key=${targetKey}&target_mode=${targetMode}&min_tempo=${min_tempo}&max_tempo=${max_tempo}&target_energy=${targetEnergy}&target_danceability=${targetDanceability}&target_instrumentalness=${targetInstrumentalness}&target_valence=${targetValence}`,
      {
        headers: {
          Authorization: `Bearer ${(session.data as any).accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    const items = data.tracks;

    // pegas as infos de items e adiocnar no audioSearch do audioRecomendation
    async function getTrackInfo(item: any) {
      const audioFeatures = await handleAudioFeatures(item.id, (session.data as any).accessToken);

      return {
        id: item.id,
        thumbnail: item.album.images[0].url,
        name: item.name,
        artists: item.artists.map((artist: any) => artist.name).join(", "),
        BPM: audioFeatures.tempo,
        key: audioFeatures.key,
        mode: audioFeatures.mode,
        preview_url: item.preview_url,
        energy: audioFeatures.energy,
        danceability: audioFeatures.danceability,
        duration: audioFeatures.duration_ms,
        instrumentalness: audioFeatures.instrumentalness,
        valence: audioFeatures.valence,
      };
    }

    async function setAudioRecomendationForItems(items: any) {
      const audioRecomendation = await Promise.all(
        items.map((item: any) => getTrackInfo(item))
      );
      setAudioRecomendation(audioRecomendation);
    }

    setAudioRecomendationForItems(items);
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
            height: "18.5em",
            width: "50em",
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
            <Button onClick={handleRecomendation}>
              <MagnifyingGlassIcon />
            </Button>
          </div>
          <div
            style={{
              height: "13.5em",
              width: "92%",
              backgroundColor: "rgba(4, 4, 5, 0.675)",
              color: "white",
              overflowY: "scroll",
              overflowX: "hidden",
              borderRadius: "1rem",
              marginBottom: "1rem",
            }}
            className="elemento-com-scroll-vertical overflow-y-scroll pt-4 mx-auto"
          >
            <Table className="max-h-60 w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Thumbnail</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>BPM</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Energy</TableHead>
                  <TableHead>Danceability</TableHead>
                  <TableHead>Add</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audioRecomendation.map((items) => (
                  <TableRow key={uuidv4()}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={items.thumbnail} alt={items.name} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>
                          {items.name.length > 27
                            ? items.name.slice(0, 27) + "..."
                            : items.name}
                        </p>
                        <p className="opacity-50">
                          {items.artists.length > 27
                            ? items.artists.slice(0, 27) + "..."
                            : items.artists}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{Math.round(items.BPM)}</TableCell>
                    <TableCell>
                      {spotify2Camelot(items.key, items.mode)}
                    </TableCell>
                    <TableCell>{(track.energy * 100).toFixed(1)}</TableCell>
                    <TableCell>
                      {(track.danceability * 100).toFixed(1)}
                    </TableCell>
                    <TableCell>
                      <Button
                        className="text-xl"
                        onClick={() => addUserPlaylist(items)}
                      >
                        +
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
