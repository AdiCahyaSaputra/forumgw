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
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { VenetianMask } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type TProps = {
  openCreateMenu: boolean;
  setOpenCreateMenu: (value: React.SetStateAction<boolean>) => void;
  setCreatedPost: (value: React.SetStateAction<boolean>) => void;
  group_public_id: string;
};

const formSchema = z.object({
  content: z
    .string()
    .min(1, {
      message: "Postingan kamu terlalu pendek min(1)",
    })
    .max(255, {
      message: "Postingan kamu kepanjangan max(255)",
    }),
});

const CreateGroupPostForm: React.FC<TProps> = ({
  openCreateMenu,
  setOpenCreateMenu,
  setCreatedPost,
  group_public_id,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const { toast } = useToast();

  const { mutate: createPost, isPending } =
    trpc.group.createGroupPost.useMutation();

  const [isAnonymousPost, setIsAnonymousPost] = useState(false);

  const submitHandler = async (values: z.infer<typeof formSchema>) => {
    createPost(
      {
        isAnonymousPost,
        content: filterBadWord(values.content),
        group_public_id,
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Notifikasi",
            description: data.message,
          });

          setCreatedPost(true);
        },
        onError: (error) => {
          toast({
            title: "Notifikasi",
            description: DEFAULT_ERROR_MSG,
          });

          console.log(error);
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
              <form onSubmit={form.handleSubmit(submitHandler)}>
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

export default CreateGroupPostForm;
