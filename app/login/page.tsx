"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_ERROR_MSG } from "@/lib/constant/error.constant";
import { setAccessToken } from "@/lib/helper/api.helper";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Username nya terlalu pendek min(3)",
    })
    .max(20, {
      message: "Username nya kepanjangan bre max(20)",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password nya terlalu pendek min(8)",
    })
    .max(100, {
      message: "Password nya kepanjangan bre max(100)",
    }),
});

const Login: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate: signIn, isPending, isSuccess } = trpc.user.signIn.useMutation();

  const { toast } = useToast();

  const router = useRouter();

  const submitHandler = (values: z.infer<typeof formSchema>) => {
    signIn(values, {
      onSuccess: async (response) => {
        toast({
          title: "Notifikasi",
          description: response.message,
        });

        form.reset();

        if (response.status === 200) {
          const { isSuccess } = await setAccessToken(response.data!);

          if (isSuccess) router.push("/forum?c=fyp");
        }
      },
      onError: (error) => {
        toast({
          title: "Notifikasi",
          description: DEFAULT_ERROR_MSG,
        });

        form.reset();

        console.log(error);
      },
    });
  };

  return (
    <>
      <div className="fixed lg:flex hidden items-start gap-4 top-4 left-4">
        <p>🤤</p>
        <p className="text-muted">Developer sedang melihatmu</p>
      </div>
      <Card className="w-max border-none shadow-none">
        <CardHeader>
          <CardTitle className="lg:text-xl">👋 Login Dulu Bre</CardTitle>
          <CardDescription>
            Sebelum mulai masuk ke menu utama, <br />
            wajib login dulu
          </CardDescription>
          <CardContent className="px-0 py-0 pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submitHandler)}>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Username"
                            autoComplete="off"
                            autoFocus={true}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Password"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isPending || isSuccess}
                  className="mt-4 w-full"
                >
                  {isPending ? "Proses..." : isSuccess ? "Teleport ke menu utama..." : "Login"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className={`px-0 py-0 pt-4 flex-col`}>
            <Separator className="mb-4" />
            <Link href="/daftar" className="w-full">
              <Button className="w-full" variant="outline">
                Belum Punya Akun?
              </Button>
            </Link>
          </CardFooter>
        </CardHeader>
      </Card>
    </>
  );
};

export default Login;
