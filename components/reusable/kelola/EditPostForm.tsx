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
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { VenetianMask } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type TProps = {
  postId: string;
  content: string;
  categoryId: number;
  isAnonymous: boolean;
  openEditMenu: boolean;
  setOpenEditMenu: (value: React.SetStateAction<boolean>) => void;
  setResponse: (value: React.SetStateAction<{ message: string }>) => void;
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

const EditPostForm: React.FC<TProps> = ({
  postId,
  content,
  categoryId,
  isAnonymous,
  openEditMenu,
  setOpenEditMenu,
  setResponse,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content,
    },
  });

  const [isAnonymousPost, setIsAnonymousPost] = useState(isAnonymous);

  const { mutate: updatePost, isLoading } = trpc.post.updatePost.useMutation();

  const submitHandler = (values: z.infer<typeof formSchema>) => {
    updatePost(
      {
        ...values,
        categoryId: categoryId === 1 ? "1" : categoryId === 2 ? "2" : "1",
        visibilityTo: isAnonymousPost ? "anonymous" : "public",
        postId,
      },
      {
        onSuccess: (data) => {
          setResponse(data);
          setOpenEditMenu(false);
        },
        onError: (error) => {
          setResponse({
            message: "Duh error bre",
          });

          console.log(error);
          setOpenEditMenu(false);
        },
      },
    );
  };

  return (
    <div
      className={`fixed inset-0 bg-white/80 backdrop-blur-md z-20 items-center justify-center ${
        openEditMenu ? "flex " : "hidden"
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
            Tulis aja apa yang lu mau, <br />
            <span className="font-bold">selagi gk ngerugiin gw mah</span>
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
