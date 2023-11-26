import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";

export function TooltipFeatures({
  name,
  description,
  isOpacity,
}: {
  name: string;
  description: string;
  isOpacity?: boolean;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <p className={isOpacity ? "opacity-100" : "opacity-50"}>{name}</p>
        </TooltipTrigger>
        <TooltipContent className="!opacity-100 w-60 max-h-15">
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
