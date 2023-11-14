import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/src/components/ui/dropdown-menu";

import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Button } from "@/src/components/ui/button";

import { ReloadIcon } from "@radix-ui/react-icons";
import { TooltipFeatures } from "./TooltipFeatures";

import {
  featuresChoseNames,
  featuresChoseNamesDesciptions,
} from "../utils/commonFunctions";
import { Separator } from "@radix-ui/react-select";

function SlidersFeatures({
  featuresSliders,
  setFeaturesSliders,
}: {
  featuresSliders: [[number], boolean][];
  setFeaturesSliders: Function;
}) {
  const defaultValueSlider: number[] = [0.5];

  const handleResetSlider = () => {
    const newFeaturesSliders = featuresSliders.map(() => [[0.5], false]);
    setFeaturesSliders(newFeaturesSliders);
  };

  const handleValueSlider = (value: number, index: number) => {
    const newFeaturesSliders = [...featuresSliders];
    newFeaturesSliders[index] = [[value], newFeaturesSliders[index][1]];
    setFeaturesSliders(newFeaturesSliders);
  };

  const handleToggleSlider = (index: number) => {
    const newFeaturesSliders = [...featuresSliders];
    newFeaturesSliders[index][1] = !newFeaturesSliders[index][1];
    setFeaturesSliders(newFeaturesSliders);
  };

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
              height: "18em",
              width: "30em",
              backgroundColor: "black",
              color: "white",
              borderRadius: "1rem",
              background: "#040405ac",
            }}
          >
            <div className="mx-auto w-10/12 justify-center">
              <Separator className="my-2" />
              {featuresChoseNames.map((feature, index) => (
                <div className="flex pt-5 w-full text-sm" key={index}>
                  <Switch
                    checked={featuresSliders[index][1]}
                    onCheckedChange={() => handleToggleSlider(index)}
                    className="mr-4"
                  />
                  <div className="flex w-full justify-between">
                    <p className="">
                      <TooltipFeatures
                        name={feature}
                        description={featuresChoseNamesDesciptions[index]}
                        isOpacity={featuresSliders[index][1]}
                      />
                    </p>
                    <Slider
                      defaultValue={defaultValueSlider}
                      max={1}
                      step={0.01}
                      value={featuresSliders[index][0]}
                      onValueChange={(e) => handleValueSlider(e[0], index)}
                      disabled={!featuresSliders[index][1]}
                      className={
                        "w-8/12 mr-2 " +
                        (featuresSliders[index][1]
                          ? "opacity-100"
                          : "opacity-30")
                      }
                    />
                  </div>
                </div>
              ))}
              <div className="pt-8 flex justify-center">
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
