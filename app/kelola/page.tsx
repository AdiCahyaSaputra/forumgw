"use client";

import FilterPostDropdown from "@/components/reusable/kelola/FilterPostDropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

type Props = {};

const KelolaPostingan = (props: Props) => {
  const [filter, setFilter] = useState<"Public" | "Anonymous" | "Semua">(
    "Semua"
  );

  return (
    <>
      <h2 className="text-lg font-bold mt-4">Semua Postingan Lu</h2>
      <p className="text-foreground/60">Kelola semua postingan lu disini bre</p>

      <div className="mt-8">
        <div className="relative mb-2">
          <Input type="text" placeholder="Cari Postingan" />
          <Button className="absolute inset-y-0 right-0 px-4 py-1 bg-foreground rounded-none rounded-r-md flex items-center gap-2">
            <Search className="w-4 aspect-square stroke-background" />
          </Button>
        </div>
        {/* TODO: Filter */}
        <FilterPostDropdown filter={filter} setFilter={setFilter} />
      </div>
    </>
  );
};

export default KelolaPostingan;
