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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";

import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

import React, { useEffect, useState } from "react";
import { Seeds, SeedsIntern } from "./MagicDialog";
import { Separator } from "@radix-ui/react-select";
import {
  Cross1Icon,
  CrossCircledIcon,
  MagnifyingGlassIcon,
  PlusCircledIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { handleSearch } from "../utils/search";
import { useSession } from "next-auth/react";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/src/components/ui/table";
import { TooltipGeneral } from "./TooltipGeneral";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast"; 

type SearchSeeds = {
  query: string;
  type: string;
};

function SearchUserSeeds({
  seeds,
  setSeeds,
}: {
  seeds: SeedsIntern;
  setSeeds: Function;
}) {
  const session = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<any>(null);

  const [search, setSearch] = useState<any>(false);
  const [searchSeeds, setSearchSeeds] = useState<SearchSeeds>({
    query: "",
    type: "track",
  });

  const [searchButton, setSearchButton] = useState<boolean>(false);

  const handleDeleteSeed = (id: string) => {
    const newSeeds = [...seeds.ids];
    const newThumbs = [...seeds.thumbs];

    const index = seeds.ids.indexOf(id);
    newSeeds.splice(index, 1);
    newThumbs.splice(index, 1);

    setSeeds({ ids: newSeeds, thumbs: newThumbs });
  };

  useEffect(() => {
    if (searchButton && searchSeeds.query !== "") {
      handleSearch(
        searchSeeds.query,
        searchButton,
        (session.data as any).accessToken,
        setSearchButton,
        setSearch,
        setIsLoading,
        setErrorMsg,
        searchSeeds.type,
        true,
      );
    }
  }, [searchButton, searchSeeds.query, searchSeeds.type, session.data]);


  return (
    <div className="w-32">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <TooltipGeneral
            description="A seed is a track or artist that when selected, will generate search results similar to itself. You can use the seeds input section below to search for tracks and artists to use as seeds. You may select up to five seeds with any combination of tracks and artists. If you search without selecting any seeds, 5 track seeds will be selected for you randomly, yielding very random results."
            component={<Button variant="outline">Seeds</Button>}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div
            className="elemento-com-scroll-vertical"
            style={{
              height: seeds.thumbs ? "auto" : "3rem",
              width: "20em",
              backgroundColor: "black",
              color: "white",
              borderRadius: "1rem",
              background: "#040405ac",
              marginTop: "1rem",
            }}
          >
            <div className="flex justify-center elemento-com-scroll-vertical">
              <Select
                required
                onValueChange={(e) => {
                  setSearchSeeds({ query: "", type: e });
                  setSearch(false);
                }}
              >
                <SelectTrigger className="w-3/12">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="track">Track</SelectItem>
                    <SelectItem value="artist">Artist</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Separator className="mx-2" />
              <Input
                type="text"
                className="w-5/12"
                placeholder={`Search a ${searchSeeds.type} ...`}
                value={searchSeeds.query}
                onChange={(e) =>
                  setSearchSeeds({
                    query: e.target.value,
                    type: searchSeeds.type,
                  })
                }
              />
              <Separator className="mx-1" />
              <Button variant="ghost" onClick={() => setSearchButton(true)}>
                <MagnifyingGlassIcon />
              </Button>
            </div>
            <div
              className=" w-10/12 mx-auto"
              style={{
                display: "flex",
                height: "3rem",
                marginTop: "1rem",
              }}
            >
              {seeds.thumbs.length === 0 && (
                  <div className="flex items-center">
                    <Avatar>
                      <AvatarFallback className="w-12 h-12"></AvatarFallback>
                    </Avatar>
                    <p className="ml-5 font-bold">Add seeds selection ...</p>
                  </div>
                )}
              {seeds.thumbs.map((thumb, index) => (
                <div className="flex mr-4" key={index}>
                  <Avatar>
                    <AvatarImage
                      loading="lazy"
                      width={40}
                      height={40}
                      src={thumb}
                    />
                    <AvatarFallback className="w-12 h-12">CN</AvatarFallback>
                    <CrossCircledIcon
                      className="fixed hover:cursor-pointer"
                      onClick={() => handleDeleteSeed(seeds.ids[index])}
                    />
                  </Avatar>
                </div>
              ))}
            </div>
            <div
              style={{
                height: "16.5em",
                width: "90%",
                color: "white",
                borderRadius: "1rem",
                background: "#040405ac",
                overflowY: "auto",
                display: search ? "block" : "none",
              }}
              className="elemento-com-scroll-vertical mx-auto box-shadow2"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {search &&
                    search.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Avatar>
                            <AvatarImage
                              loading="lazy"
                              width={40}
                              height={40}
                              src={
                                searchSeeds.type === "track"
                                  ? item.thumbnail
                                  : item.images.length > 0
                                  ? item.images[2].url
                                  : ""
                              }
                            />
                            <AvatarFallback className="w-12 h-12">
                              {item.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>
                              {item.name.length > 15
                                ? item.name.slice(0, 15) + "..."
                                : item.name}
                            </p>
                            <p>
                              {searchSeeds.type === "track" ? (
                                item.artists.length > 15 ? (
                                  item.artists.slice(0, 15) + "..."
                                ) : (
                                  item.artists
                                )
                              ) : (
                                <></>
                              )}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {seeds.ids.includes(item.id) ? (
                            <Cross1Icon
                              className="hover:cursor-pointer"
                              onClick={() => handleDeleteSeed(item.id)}
                            />
                          ) : (
                            <PlusIcon
                              className="hover:cursor-pointer"
                              onClick={() => {
                                if (seeds.ids.length < 5) {
                                  if (searchSeeds.type === "artist") {
                                    item.id = item.id + "*";
                                  }
                                  setSeeds({
                                    ids: [...seeds.ids, item.id],
                                    thumbs: [
                                      ...seeds.thumbs,
                                      searchSeeds.type === "track"
                                        ? item.thumbnail
                                        : item.images.length > 0
                                        ? item.images[2].url
                                        : "",
                                    ],
                                  });
                                } else {
                                  toast({
                                    variant: 'destructive',
                                    title: 'You can only add 5 seeds',
                                    description: 'Please add only 5 seeds',
                                  })
                                }
                              }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default SearchUserSeeds;
