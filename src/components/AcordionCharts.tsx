import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/src/components/ui/alert"
 

import ChartFeatures from "./ChartFeatures";
import ChartKey from "./ChatKey";
import { AudioSearch } from "../utils/types";

export function AccordionCharts({
  userPlaylist,
}: {
  userPlaylist: AudioSearch[];
}) {
  return (
    <>
      {userPlaylist !== null && userPlaylist.length >= 5 ? (
        <Accordion type="multiple" className="w-full text-center">
          <AccordionItem value="item-1">
            <AccordionTrigger>Features Chart</AccordionTrigger>
            <AccordionContent>
              <ChartFeatures userPlaylist={userPlaylist} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Key Chart</AccordionTrigger>
            <AccordionContent>
              <ChartKey userPlaylist={userPlaylist} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
