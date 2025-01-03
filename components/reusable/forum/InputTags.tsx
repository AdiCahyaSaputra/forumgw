import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Tag from "@/lib/interface/Tag";
import { trpc } from "@/lib/trpc";
import { Plus, TagsIcon, X } from "lucide-react";
import React, { useState } from "react";

type Props = {
  tags: Tag[];
  tagInput: string;
  setResponse: (value: React.SetStateAction<{ message: string }>) => void;
  setTags: (value: React.SetStateAction<Tag[]>) => void;
  setTagInput: (value: React.SetStateAction<string>) => void;
};

const InputTags = (props: Props) => {
  const [openTagSearch, setOpenTagSearch] = useState(false);

  const {
    data: tagsResponse,
    isLoading,
    refetch: refetchTags,
  } = trpc.post.getTags.useQuery({
    tag_ids: [],
    tag_names: props.tagInput,
  });

  const { mutate: createTag, isLoading: isLoadingCreateTag } =
    trpc.post.createPostTag.useMutation();

  const createNewTag = async () => {
    createTag(
      {
        name: props.tagInput,
      },
      {
        onSuccess: (data) => {
          if (data.data?.id && data.data?.name) {
            props.setTags((prevTags) => [...prevTags, data.data]);
          }

          props.setResponse(data);
        },
        onError: (err) => {
          props.setResponse({
            message: "Duh error ni bre",
          });

          console.error(err);
        },
      }
    );

    refetchTags();
  };

  return (
    <>
      <Popover open={openTagSearch} onOpenChange={setOpenTagSearch}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            role="combobox"
            className="justify-between gap-4"
            onClick={() => {
              setOpenTagSearch(!openTagSearch);
            }}
          >
            Tambahin Tag (Opsional)
            <Plus className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[200px] p-0">
          <Command>
            <CommandInput
              value={props.tagInput}
              onValueChange={(searchTag) => {
                if (!searchTag.includes("#")) {
                  props.setTagInput(searchTag);
                }
              }}
              placeholder="Cari tag..."
              className="h-9"
            />
            <CommandList>
              <CommandEmpty className="p-4">
                {!isLoading && (
                  <Button
                    onClick={createNewTag}
                    size="sm"
                    className="w-full justify-between gap-2"
                    disabled={isLoadingCreateTag}
                  >
                    {isLoadingCreateTag ? "Proses..." : "Bikin tag baru"}
                    <TagsIcon className="w-4 h-4" />
                  </Button>
                )}
              </CommandEmpty>
              <CommandGroup>
                {tagsResponse?.data.map((tag, idx) => (
                  <CommandItem
                    value={tag.name}
                    key={idx}
                    onSelect={() => {
                      props.setTags((prevTags) => [...prevTags, tag]);
                      setOpenTagSearch(false);
                    }}
                  >
                    {tag.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap items-center gap-2 max-w-xs">
        {props.tags.map((tag, idx) => (
          <Button
            key={idx}
            variant="outline"
            className="justify-between gap-2"
            type="button"
            onClick={() => {
              props.setTags((prevTags) =>
                prevTags.filter((prevTag) => prevTag.id !== tag.id)
              );
            }}
          >
            <span>#{tag.name}</span>
            <X className="w-4 h-4" />
          </Button>
        ))}
      </div>
    </>
  );
};

export default InputTags;
