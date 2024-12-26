"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { filterBadWord } from "@/lib/helper/sensor.helper";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, VenetianMask, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Tag from "@/lib/interface/Tag";

type TProps = {
  category_id: "1" | "2";
  openCreateMenu: boolean;
  setOpenCreateMenu: (value: React.SetStateAction<boolean>) => void;
  setCreatedPost: (value: React.SetStateAction<boolean>) => void;
};

const formSchema = z.object({
  content: z
    .string()
    .min(1, {
      message: "Postingan lu terlalu pendek min(1)",
    })
    .max(255, {
      message: "Postingan lu kepanjangan max(255)",
    }),
  tags: z.string().nullable(),
});

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

const CreatePostForm: React.FC<TProps> = ({
  category_id,
  openCreateMenu,
  setOpenCreateMenu,
  setCreatedPost,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      tags: null,
    },
  });

  const { toast } = useToast();

  const { data: tagsResponse, isLoading: isLoadingTags } =
    trpc.post.getTags.useQuery({
      tag_ids: [],
      tag_names: [],
      take_all: true,
    });

  const { mutate: createPost, isLoading } = trpc.post.createPost.useMutation();

  const [isAnonymousPost, setIsAnonymousPost] = useState(false);
  const [response, setReponse] = useState({
    message: "",
  });

  const [openTagSearch, setOpenTagSearch] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);

  const submitHandler = async (values: z.infer<typeof formSchema>) => {
    createPost(
      {
        category_id,
        isAnonymousPost,
        content: filterBadWord(values.content),
        tags,
      },
      {
        onSuccess: (data) => {
          setReponse(data);

          setCreatedPost(true);
        },
        onError: (error) => {
          setReponse({
            message: "Duh error ni bre",
          });

          console.log(error);
        },
      },
    );

    form.reset();
  };

  useEffect(() => {
    if (openCreateMenu) form.setFocus("content");

    if (!!response.message) {
      toast({
        title: "Notifikasi",
        description: response.message,
      });

      // set it to default again to avoid duplicate click
      setReponse({
        message: "",
      });
    }
  }, [openCreateMenu, response]);

  return (
    <div
      className={`fixed inset-0 bg-white/80 backdrop-blur-md z-20 items-center justify-center ${openCreateMenu ? "flex " : "hidden"
        }`}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-start justify-between">
            <span className="text-xl">Bikin Postingan</span>
            <Button
              variant={`${isAnonymousPost ? "destructive" : "outline"}`}
              size="icon"
              onClick={() => setIsAnonymousPost(!isAnonymousPost)}
            >
              <VenetianMask className="w-5 aspect-square" />
            </Button>
          </CardTitle>
          <CardDescription>
            Tulis aja apa yang lagi pikirin, <br />
            <span className="font-bold">jangan xss juga tapi</span>
          </CardDescription>
          <CardContent className="p-0 pt-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(submitHandler)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover open={openTagSearch}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="default"
                              role="combobox"
                              className="justify-between gap-4"
                              onClick={() => {
                                setOpenTagSearch(!openTagSearch)
                              }}
                            >
                              Tambahin Tag (Opsional)
                              <Plus className="w-4 h-4" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-[200px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Cari tag..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>Tag nya gak ketemu</CommandEmpty>
                              <CommandGroup>
                                {tagsResponse?.data.map((tag, idx) => (
                                  <CommandItem
                                    value={tag.id.toString()}
                                    key={idx}
                                    onSelect={() => {
                                      setTags((prevTags) => {
                                        return [...prevTags, tag];
                                      });
                                      setOpenTagSearch(false)
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
                    </FormItem>
                  )}
                />

                <div className="flex flex-wrap items-center gap-2 max-w-xs">
                  {tags.map((tag, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="justify-between"
                      type="button"
                      onClick={() => {
                        setTags((prevTags) => {
                          return prevTags.filter(
                            (prevTag) => prevTag.id !== tag.id,
                          );
                        });
                      }}
                    >
                      #{tag.name}
                      <X className="w-4 h-4" />
                    </Button>
                  ))}
                </div>

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Tulis isi postingan disini"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-3 flex lg:flex-row flex-col lg:items-center lg:justify-start gap-2">
                  <Button disabled={isLoading} type="submit" className="grow">
                    {isLoading ? "Proses..." : "Buat Postingan"}
                  </Button>
                  <Button
                    onClick={() => setOpenCreateMenu(false)}
                    type="button"
                    variant="outline"
                    className="grow"
                  >
                    Gak Jadi
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default CreatePostForm;
