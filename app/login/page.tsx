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
import { setAccessToken } from "@/lib/helper/api.helper";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Username lu terlalu pendek min(3)",
    })
    .max(20, {
      message: "Username lu kepanjangan bre max(20)",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password lu terlalu pendek min(8)",
    })
    .max(100, {
      message: "Password lu kepanjangan bre max(100)",
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

  const { mutate: signIn, isLoading } = trpc.user.signIn.useMutation();

  const [response, setResponse] = useState({
    status: 0,
    message: "",
  });

  const { toast } = useToast();

  const router = useRouter();

  const submitHandler = (values: z.infer<typeof formSchema>) => {
    signIn(values, {
      onSuccess: async (data) => {
        setResponse(data);
        form.reset();

        if (data.status === 200) {
          const { isSuccess } = await setAccessToken(data.data as string);

          // The users is online
          // console.log(`${process.env.BASE_SOCKET_URL}/api/ws/socket`);
          await fetch(`${process.env.BASE_SOCKET_URL}/api/ws/socket`);

          if (isSuccess) router.push("/forum?c=fyp");
        }
      },
      onError: (error) => {
        setResponse({
          status: 400,
          message: "Duh error bre",
        });
        form.reset();

        console.log(error);
      },
    });
  };

  useEffect(() => {
    if (!!response.message) {
      toast({
        title: "Notifikasi",
        description: response.message,
      });

      setResponse({
        ...response,
        message: "",
      });
    }
  }, [response]);

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
            yakali nggak login bre
          </CardDescription>
          <CardContent className="px-0 py-0 pt-4">
            {response.status === 200 ? (
              <p className="py-2 px-4 bg-secondary rounded-md animate-bounce">
                Teleport ke menu utama...
              </p>
            ) : (
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
                    disabled={isLoading}
                    className="mt-4 w-full"
                  >
                    {isLoading ? "Proses..." : "Login"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter
            className={`px-0 py-0 pt-4 flex-col ${
              response.status === 200 && "hidden"
            }`}
          >
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
