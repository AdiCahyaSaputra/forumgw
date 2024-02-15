"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCheckIcon, UserMinusIcon, UserPlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import EmptyState from "@/components/reusable/state/EmptyState";
import { useAuth } from "@/lib/hook/auth.hook";
import { useToast } from "@/components/ui/use-toast";
import SubMenuHeader from "@/components/reusable/layout/SubMenuHeader";

type TUser = {
  name: string;
  username: string;
  image: string | null;
};

type TProps = {
  params: {
    public_id: string;
  };
};

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  invitedUsername: z.array(z.string()).nullable(),
  logo: z.string().nullable(),
});

const EditSirkelPage = ({ params }: TProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      invitedUsername: null,
      logo: null,
    },
  });

  const [users, setUsers] = useState<TUser[]>([]);
  const [responseUser, setResponseUser] = useState<{
    status: number;
    message: string;
    data?: TUser[];
  }>({
    status: 200,
    message: "",
    data: [],
  });
  const [username, setUsername] = useState("");

  const { currentUser } = useAuth();
  const { toast } = useToast();

  const { mutate: searchUser, isLoading } = trpc.user.searchUser.useMutation();
  const { mutate: editGroup, isLoading: editGroupLoading } =
    trpc.group.editGroup.useMutation();

  const { data: groupResponse } =
    trpc.group.getDetailedGroupMemberByPublicId.useQuery({
      public_id: params.public_id,
    });

  const isUserAlreadyInvited = (username: string) => {
    return !!users.find((user) => user.username === username);
  };

  const handleCreateGroup = async (values: z.infer<typeof formSchema>) => {
    editGroup(
      {
        group_public_id: params.public_id,
        update_data: values,
      },
      {
        onSuccess: (response) => {
          toast({
            title: "Notifikasi",
            description: response.message,
          });

          // form.reset();
          // setUsers([]);
        },
        onError: (err) => {
          toast({
            title: "Notifikasi",
            description: "Ada error bre",
          });

          console.log(err);
        },
      },
    );
  };

  useEffect(() => {
    if (groupResponse?.data) {
      const usernames = groupResponse.data.group_member.map((member) => {
        return member.user.username;
      });

      const users = groupResponse.data.group_member.map((member) => {
        return member.user;
      });

      form.setValue("name", groupResponse.data.name);
      form.setValue("description", groupResponse.data.description);
      form.setValue("invitedUsername", usernames);

      setUsers(users);
    }
  }, [groupResponse]);

  useEffect(() => {
    if (users.length) {
      const usernames = users.map((user) => user.username);
      form.setValue("invitedUsername", usernames);
    }
  }, [users]);

  return (
    <>
      <SubMenuHeader title="Edit Sirkel" backUrl="/kelola-sirkel" />
      <div className="container">
        <h2 className="text-lg font-bold mt-4">Edit Data Sirkel Lu</h2>
        <p className="text-foreground/60">
          Mungkin ada yang pengen lu rubah yakan
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateGroup)}
            className="mt-4 space-y-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Nama Sirkel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Deskripsikan Sirkel lu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <div>
                <h4 className="text-lg font-bold">Langsung Rekrut Member?</h4>
                <p className="text-foreground/60 text-sm">
                  Member yang di invite bakal nerima{" "}
                  <span className="font-bold">undangan</span> buat gabung dari
                  sirkel ini
                </p>
              </div>

              <ul className="my-2 space-y-2">
                {users.map((user, idx) => (
                  <li key={idx} className="flex justify-between">
                    <div className="flex space-x-2">
                      <Avatar className="rounded-md">
                        <AvatarImage src={user.image ?? ""} />
                        <AvatarFallback className="rounded-md bg-muted">
                          {user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h4 className="text-sm font-bold">{user.name}</h4>
                        <p className="text-foreground/60 text-xs">
                          {user.username}
                        </p>
                      </div>
                    </div>

                    {user.username !== currentUser?.username && (
                      <Button
                        type="button"
                        onClick={() => {
                          const usersList = users.filter(
                            (_, userIdx) => userIdx !== idx,
                          );
                          setUsers(usersList);
                        }}
                        variant="destructive"
                      >
                        <UserMinusIcon className="w-5 h-5" />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <UserPlusIcon className="w-5 h-5" />
                    <span>Invite Member</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Member Terbaik Lu</DialogTitle>
                  </DialogHeader>
                  <Input
                    placeholder="username"
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    value={username}
                  />
                  <Button
                    onClick={() => {
                      searchUser(
                        { username },
                        {
                          onSuccess: (response) => {
                            setResponseUser(response);
                          },
                          onError: (err) => {
                            console.log(err);
                          },
                        },
                      );
                    }}
                    type="button"
                    disabled={isLoading}
                  >
                    {isLoading ? "Proses.." : "Cari User"}
                  </Button>

                  <ul>
                    <EmptyState
                      status={responseUser.status}
                      message={responseUser.message}
                    >
                      {responseUser.data?.map((user, idx) => (
                        <li key={idx} className="flex justify-between">
                          <div className="flex space-x-2">
                            <Avatar className="rounded-md">
                              <AvatarImage src={user.image ?? ""} />
                              <AvatarFallback className="rounded-md bg-muted">
                                {user.username[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div>
                              <h4 className="text-sm font-bold">{user.name}</h4>
                              <p className="text-foreground/60 text-xs">
                                {user.username}
                              </p>
                            </div>
                          </div>

                          {user.username !== currentUser?.username && (
                            <Button
                              type="button"
                              onClick={() => {
                                if (!isUserAlreadyInvited(user.username)) {
                                  setUsers([...users, user]);
                                }
                              }}
                              variant={
                                isUserAlreadyInvited(user.username)
                                  ? "outline"
                                  : "default"
                              }
                            >
                              {isUserAlreadyInvited(user.username) ? (
                                <UserCheckIcon className="w-5 h-5" />
                              ) : (
                                <UserPlusIcon className="w-5 h-5" />
                              )}
                            </Button>
                          )}
                        </li>
                      ))}
                    </EmptyState>
                  </ul>
                </DialogContent>
              </Dialog>
            </div>

            <Button type="submit" disabled={editGroupLoading}>
              {editGroupLoading ? "Proses.." : "Edit Sirkel"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default EditSirkelPage;
