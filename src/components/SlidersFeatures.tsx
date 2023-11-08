import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/src/components/ui/dropdown-menu";

import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Button } from "@/src/components/ui/button";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useState } from "react";

function SlidersFeatures({
  featuresSliders,
  setFeaturesSliders,
}: {
  featuresSliders: number[][];
  setFeaturesSliders: Function;
}) {
  const defaultValueSlider: number[] = [0.5];

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

  const [includeEnergy, setIncludeEnergy] = useState<boolean>(false);
  const [includeDanceability, setIncludeDanceability] =
    useState<boolean>(false);
  const [includeInstrumental, setIncludeInstrumental] =
    useState<boolean>(false);
  const [includeValence, setIncludeValence] = useState<boolean>(false);

  return (
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
                <Switch
                  checked={includeEnergy}
                  onCheckedChange={() => setIncludeEnergy(!includeEnergy)}
                  className="mr-4"
                />
                <p
                  className={
                    "pr-12 " + (includeEnergy ? "opacity-100" : "opacity-30")
                  }
                >
                  energy
                </p>
                <Slider
                  defaultValue={defaultValueSlider}
                  max={1}
                  step={0.01}
                  value={featuresSliders[0]}
                  onValueChange={(e) => handleValueSlider(e, 0)}
                  disabled={!includeEnergy}
                  className={includeEnergy ? "opacity-100" : "opacity-30"}
                />
              </div>
              <div className="flex pt-5 w-full text-sm">
                <Switch
                  checked={includeDanceability}
                  onCheckedChange={() =>
                    setIncludeDanceability(!includeDanceability)
                  }
                  className="mr-4"
                />
                <p
                  className={
                    "pr-4 " +
                    (includeDanceability ? "opacity-100" : "opacity-30")
                  }
                >
                  danceability
                </p>
                <Slider
                  defaultValue={defaultValueSlider}
                  max={1}
                  step={0.01}
                  value={featuresSliders[1]}
                  onValueChange={(e) => handleValueSlider(e, 1)}
                  disabled={!includeDanceability}
                  className={includeDanceability ? "opacity-100" : "opacity-30"}
                />
              </div>
              <div className="flex pt-5 w-full text-sm">
                <Switch
                  checked={includeInstrumental}
                  onCheckedChange={() =>
                    setIncludeInstrumental(!includeInstrumental)
                  }
                  className="mr-4"
                />
                <p
                  className={
                    "pr-4 " +
                    (includeInstrumental ? "opacity-100" : "opacity-30")
                  }
                >
                  instrumental
                </p>
                <Slider
                  defaultValue={defaultValueSlider}
                  max={1}
                  step={0.01}
                  value={featuresSliders[2]}
                  onValueChange={(e) => handleValueSlider(e, 2)}
                  disabled={!includeInstrumental}
                  className={includeInstrumental ? "opacity-100" : "opacity-30"}
                />
              </div>
              <div className="flex pt-5 w-full text-sm">
                <Switch
                  checked={includeValence}
                  onCheckedChange={() => setIncludeValence(!includeValence)}
                  className="mr-4"
                />
                <p
                  className={
                    "pr-12 " + (includeValence ? "opacity-100" : "opacity-30")
                  }
                >
                  valence
                </p>
                <Slider
                  defaultValue={defaultValueSlider}
                  max={1}
                  step={0.01}
                  value={featuresSliders[3]}
                  onValueChange={(e) => handleValueSlider(e, 3)}
                  disabled={!includeValence}
                  className={includeValence ? "opacity-100" : "opacity-30"}
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
  );
}

export default SlidersFeatures;
