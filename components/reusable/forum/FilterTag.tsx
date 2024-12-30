import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const FilterTag = () => {
  const query = useSearchParams();

  const tag_ids = query?.get("t") || null;
  const category = query?.get("c");

  const router = useRouter();

  const { data: tagResponse } = trpc.post.getTags.useQuery({
    tag_ids: tag_ids?.split(",") || [],
    tag_names: "",
  });

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => {
          router.push(`/forum?c=${category}`);
        }}
        size="icon"
      >
        <X />
      </Button>

      <div className="w-full overflow-x-auto no-scrollbar flex gap-2 items-center">
        {tagResponse?.data?.map((tag, idx) => (
          <Button
            onClick={() => {
              const updatedTagFilter = tag_ids
                ?.split(",")
                .filter((tagId) => tagId !== tag.id.toString())
                .join(",");

              router.push(`/forum?c=${category}&t=${updatedTagFilter}`);
            }}
            key={idx}
            variant="outline"
            className="w-max hover:bg-muted cursor-pointer flex items-center gap-4"
          >
            <span>#{tag.name}</span>
            <X className="w-4 h-4" />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FilterTag;
