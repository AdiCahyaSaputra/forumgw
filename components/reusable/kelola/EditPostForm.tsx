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
import Tag from "@/lib/interface/Tag";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { VenetianMask } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputTags from "../forum/InputTags";

type TProps = {
  post_id: string;
  tag_post: {
    tag: Tag;
  }[];
  content: string;
  isAnonymous: boolean;
  openEditMenu: boolean;
  setOpenEditMenu: (value: React.SetStateAction<boolean>) => void;
  setResponse: (value: React.SetStateAction<{ message: string }>) => void;
};

const formSchema = z.object({
  content: z
    .string()
    .min(1, {
      message: "Postingan nya terlalu pendek min(1)",
    })
    .max(255, {
      message: "Postingan nya kepanjangan max(255)",
    }),
});

const EditPostForm: React.FC<TProps> = ({
  post_id,
  content,
  tag_post,
  isAnonymous,
  openEditMenu,
  setOpenEditMenu,
  setResponse,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const [tags, setTags] = useState<Tag[]>(tag_post.map((item) => item.tag));
  const [tagInput, setTagInput] = useState("");

  const [isAnonymousPost, setIsAnonymousPost] = useState(isAnonymous);

  const { mutate: updatePost, isLoading } = trpc.post.updatePost.useMutation();

  const submitHandler = (values: z.infer<typeof formSchema>) => {
    updatePost(
      {
        ...values,
        visibilityTo: isAnonymousPost ? "anonymous" : "public",
        post_id,
        tags,
      },
      {
        onSuccess: (data) => {
          setResponse(data);
          setOpenEditMenu(false);

          setTagInput("");
        },
        onError: (error) => {
          setResponse({
            message: "Duh error bre",
          });

          console.log(error);
          setOpenEditMenu(false);
        },
      }
    );
  };

  useEffect(() => {
    form.setValue("content", content);
  }, [content]);

  return (
    <div
      className={`fixed inset-0 bg-white/80 backdrop-blur-md z-20 items-center justify-center ${
        openEditMenu ? "flex " : "hidden"
      }`}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-start justify-between">
            <span className="text-xl">Edit Postingan</span>
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
                  setResponse={setResponse}
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
                  <Button disabled={isLoading} type="submit" className="grow">
                    {isLoading ? "Proses..." : "Edit Postingan"}
                  </Button>
                  <Button
                    onClick={() => setOpenEditMenu(false)}
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

export default EditPostForm;
