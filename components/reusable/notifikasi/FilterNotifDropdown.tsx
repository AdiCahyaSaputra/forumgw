import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal } from "lucide-react";

type filter = "Dibaca" | "Belum Dibaca" | "Semua";

type TProps = {
  filter: filter;
  setFilter: (value: React.SetStateAction<filter>) => void;
};

const FilterNotifDropdown: React.FC<TProps> = ({ setFilter, filter }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-max flex items-center gap-2" variant="outline">
          <SlidersHorizontal className="w-3 aspect-square" />
          <span className="font-bold text-foreground">{filter}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        <DropdownMenuLabel>Filter Notifikasi</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => setFilter("Semua")}
          className="cursor-pointer"
        >
          Semua
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setFilter("Dibaca")}
          className="cursor-pointer"
        >
          Dibaca
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setFilter("Belum Dibaca")}
          className="cursor-pointer"
        >
          Belum Dibaca
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterNotifDropdown;
