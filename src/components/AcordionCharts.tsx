import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";

import ChartFeatures from "./ChartFeatures";
import ChartKey from "./ChatKey";
import { AudioSearch } from "../utils/types";
import ChartArtists from "./ChartArtists";
import { Separator } from "@radix-ui/react-select";
import ChartBPM from "./ChatBPM";

export function AccordionCharts({
  userPlaylist,
}: {
  userPlaylist: AudioSearch[];
}) {
  return (
    <>
      {userPlaylist !== null && userPlaylist.length >= 5 ? (
        <div className="align-center">
          <ChartFeatures userPlaylist={userPlaylist} />
          <ChartKey userPlaylist={userPlaylist} />
          <ChartBPM userPlaylist={userPlaylist} />
          <div className="flex">
            <ChartArtists userPlaylist={userPlaylist} />
            <Separator className="mx-16"/>
          <ChartArtists userPlaylist={userPlaylist} />

          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <Alert className="w-6/12">
            <AlertTitle>Heads up! Add more songs</AlertTitle>
            <AlertDescription>
              Add at least 5 songs to your playlist to unlock the charts
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
}
