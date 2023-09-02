import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal } from "lucide-react";

type filter = "Public" | "Anonymous" | "Semua";

type TProps = {
  filter: filter;
  setFilter: (value: React.SetStateAction<filter>) => void;
};

const FilterPostDropdown: React.FC<TProps> = ({ setFilter, filter }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-max flex items-center gap-2" variant="outline">
          <SlidersHorizontal className="w-3 aspect-square" />
          <span className="font-bold text-foreground">{filter}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        <DropdownMenuLabel>Filter Visibilitas Post</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setFilter("Semua")}>
          Semua
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilter("Public")}>
          Public
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilter("Anonymous")}>
          Anonymous
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterPostDropdown;
