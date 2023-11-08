import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function SelectRecomdations({data, placeholder, handlerValueChange} : {data: any, placeholder: string, handlerValueChange: Function}) {
  return (
    <Select required onValueChange={(e) => handlerValueChange(e)}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {data.map((item: any, index: number) => {
            return <SelectItem key={index} value={item.value}>{item.name}</SelectItem>
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectRecomdations;
