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
import { filterBadWord } from "@/lib/helper/sensor.helper";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "nama nya pendek amat min(3)",
    })
    .max(255, {
      message: "Jangan asal ngisi bre max(255)",
    })
    .refine((data) => !filterBadWord(data).includes("***"), {
      message: "Gak boleh toxic ya bre",
    }),
  username: z
    .string()
    .min(3, {
      message: "Username nya terlalu pendek min(3)",
    })
    .max(20, {
      message: "Username nya kepanjangan bre max(20)",
    })
    .refine((data) => !filterBadWord(data).includes("***"), {
      message: "Gak boleh toxic ya bre",
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

const Daftar: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
  });

  const { toast } = useToast();

  const router = useRouter();

  const [response, setResponse] = useState({
    status: 0,
    message: "",
  });

  const { mutate: signUp, isPending } = trpc.user.signUp.useMutation();

  const submitHandler = (values: z.infer<typeof formSchema>) => {
    signUp(values, {
      onSuccess: (data) => {
        setResponse(data);
        form.reset();
      },
      onError: (error) => {
        setResponse({
          ...response,
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

      if (response.status === 201) {
        const to = setTimeout(() => {
          router.push("/login");
        }, 500);

        return () => {
          clearTimeout(to);
        };
      }

      setResponse({
        status: 0,
        message: "",
      });
    }
  }, [response]);

  return (
    <Card className="w-max border-none shadow-none">
      <CardHeader>
        <CardTitle className="lg:text-xl">Bikin Akun Dulu Bre 🤗</CardTitle>
        <CardDescription>
          Mo bikin akun fake atau beneran <br />
          anggota baru nih ?<br />
        </CardDescription>
        <CardContent className="px-0 py-0 pt-4">
          {response.status === 201 ? (
            <p className="py-2 px-4 bg-secondary rounded-md animate-bounce">
              Teleport ke menu login...
            </p>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submitHandler)}>
                <div className="space-y-2">
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
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Username"
                            autoComplete="off"
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
                  disabled={isPending}
                  type="submit"
                  className="mt-4 w-full"
                >
                  {isPending ? "Proses.." : "Daftar"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter
          className={`px-0 py-0 pt-4 flex-col ${
            response.status === 201 && "hidden"
          }`}
        >
          <Separator className="mb-4" />
          <Link href="/login" className="w-full">
            <Button className="w-full" variant="outline">
              Udah ada akun sih aslinya 😆
            </Button>
          </Link>
        </CardFooter>
      </CardHeader>
    </Card>
  );
};

export default Daftar;
