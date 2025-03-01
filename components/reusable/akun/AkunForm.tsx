"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_ERROR_MSG } from "@/lib/constant/error.constant";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoadingState from "../state/LoadingState";
import UploadPPForm from "./UploadPPForm";

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Yaelah nama nya pendek amat min(3)",
    })
    .max(255, {
      message: "Jangan asal ngisi bre max(255)",
    }),
  username: z
    .string()
    .min(3, {
      message: "Username kamu terlalu pendek min(3)",
    })
    .max(20, {
      message: "Username kamu kepanjangan bre max(20)",
    }),
  bio: z.string().max(100, {
    message: "Bio kamu kepanjangan bre max(100)",
  }),
});

const AkunForm: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      name: "",
      bio: "",
    },
  });

  const { toast } = useToast();

  const { data: userResponse, refetch } = trpc.user.getAuthUser.useQuery();

  const { mutate: editProfile, isPending } =
    trpc.user.editProfile.useMutation();

  const submitHandler = (values: z.infer<typeof formSchema>) => {
    editProfile(
      {
        name: values.name,
        username: values.username,
        bio: values.bio.length ? values.bio : null,
        image: userResponse?.data?.image || null,
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Notifikasi",
            description: data.message,
          });

          refetch();
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
  };

  useEffect(() => {
    if (userResponse?.data) {
      form.setValue("name", userResponse.data.name);
      form.setValue("username", userResponse.data.username);
      form.setValue("bio", userResponse.data.bio ?? "");
    }
  }, [userResponse]);

  return (
    <>
      <UploadPPForm
        user={userResponse?.data}
        onProfileChange={() => refetch()}
      />

      <div className="mt-6 pb-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)}>
            <div className="space-y-2">
              <LoadingState
                data={userResponse?.data}
                loadingFallback={
                  <Skeleton className="w-full lg:w-4/12 h-8 bg-muted rounded-md" />
                }
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Nama Lengkap"
                          autoComplete="off"
                          autoFocus={true}
                          className="lg:w-4/12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </LoadingState>
              <LoadingState
                data={userResponse?.data}
                loadingFallback={
                  <Skeleton className="w-full lg:w-4/12 h-8 bg-muted rounded-md" />
                }
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Username"
                          autoComplete="off"
                          className="lg:w-4/12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </LoadingState>
              <LoadingState
                data={userResponse?.data}
                loadingFallback={
                  <Skeleton className="w-full lg:w-4/12 h-24 bg-muted rounded-md" />
                }
              >
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Bio (max 100)"
                          autoComplete="off"
                          className="lg:w-4/12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </LoadingState>
            </div>

            <LoadingState
              data={userResponse?.data}
              loadingFallback={
                <Skeleton className="lg:w-28 w-full mt-4 h-8 bg-primary rounded-md" />
              }
            >
              <Button
                disabled={isPending}
                type="submit"
                className="mt-4 lg:w-max w-full"
              >
                {isPending ? "Proses..." : "Ubah Profil Akun"}
              </Button>
            </LoadingState>
          </form>
        </Form>
      </div>
    </>
  );
};

export default AkunForm;
