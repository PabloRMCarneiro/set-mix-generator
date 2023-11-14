import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";

function SelectRecomdations({
  data,
  placeholder,
  handlerValueChange,
}: {
  data: any;
  placeholder: string;
  handlerValueChange: Function;
}) {
  return (
    <Select required onValueChange={(e) => handlerValueChange(e)}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {data.map((item: any, index: number) => {
            return (
              <div key={index} className="flex w-full justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SelectItem value={item.value}>{item.name}</SelectItem>
                    </TooltipTrigger>
                    <TooltipContent className="!opacity-100 w-60 max-h-15">
                      <p>{item.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectRecomdations;
