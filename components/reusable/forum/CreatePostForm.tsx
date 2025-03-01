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
import { DEFAULT_ERROR_MSG } from "@/lib/constant/error.constant";
import { filterBadWord } from "@/lib/helper/sensor.helper";
import Tag from "@/lib/interface/Tag";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { VenetianMask } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputTags from "./InputTags";

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
});

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
    },
  });

  const [isAnonymousPost, setIsAnonymousPost] = useState(false);

  const [tags, setTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState("");

  const { toast } = useToast();

  const { mutate: createPost, isPending } = trpc.post.createPost.useMutation();

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
          toast({
            title: "Notifikasi",
            description: data.message,
          });

          setCreatedPost(true);
          setTags([]);
          setTagInput("");
        },
        onError: (error) => {
          toast({
            title: "Notifikasi",
            description: DEFAULT_ERROR_MSG,
          });

          console.error(error);
        },
      }
    );

    form.reset();
  };

  useEffect(() => {
    if (openCreateMenu) form.setFocus("content");
  }, [openCreateMenu]);

  return (
    <div
      className={`fixed inset-0 bg-white/80 backdrop-blur-md z-20 items-center justify-center ${
        openCreateMenu ? "flex " : "hidden"
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
                <InputTags
                  tags={tags}
                  setTags={setTags}
                  tagInput={tagInput}
                  setTagInput={setTagInput}
                />

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
                  <Button disabled={isPending} type="submit" className="grow">
                    {isPending ? "Proses..." : "Buat Postingan"}
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
