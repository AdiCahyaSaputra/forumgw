import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { getMetaData } from "@/lib/helper/str.helper";
import { trpc } from "@/lib/trpc";
import { Megaphone, MessagesSquare, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type TProps = {
  id: string;
  content: string;
  createdAt: string;
  User?: {
    name: string;
    username: string;
    image: string | null;
    id: string;
  } | null;
  Anonymous?: {
    username: string;
    id: string;
  } | null;
  Comment?:
    | {
        id: number;
      }[]
    | null;
};

const CardForum: React.FC<TProps> = ({
  id,
  content,
  createdAt,
  User,
  Anonymous,
  Comment,
}) => {
  const [reason, setReason] = useState("");
  const [openReason, setOpenReason] = useState(false);
  const [response, setResponse] = useState({
    message: "",
  });

  const router = useRouter();

  const { toast } = useToast();

  const { mutate: reportPost, isLoading } = trpc.post.reportPost.useMutation();

  const reportHandler = () => {
    reportPost(
      {
        postId: id,
        reason,
      },
      {
        onSuccess: (data) => {
          setResponse(data);
        },
        onError: (error) => {
          setResponse({
            message: "Duh error bre",
          });

          console.log(error);
        },
      },
    );
  };

  useEffect(() => {
    if (!!response.message) {
      toast({
        title: "Notifikasi",
        description: response.message,
      });

      setResponse({
        message: "",
      });
    }
  }, [response]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-white/80 backdrop-blur-md z-20 items-center justify-center ${
          openReason ? "flex" : "hidden"
        }`}
      >
        <Card>
          <CardTitle className="font-bold p-4">Apa alasan lo bre ?</CardTitle>
          <CardContent className="p-4 pt-0">
            <Input
              onChange={(e) => setReason(e.target.value)}
              required
              autoFocus={true}
              type="text"
              placeholder="Jangan panjang panjang..."
            />
          </CardContent>
          <CardFooter className="p-4 pt-0 flex gap-2 justify-between">
            <Button
              onClick={reportHandler}
              disabled={isLoading}
              className="w-1/2"
              variant="destructive"
            >
              {isLoading ? "Proses..." : "Laporin"}
            </Button>
            <Button
              onClick={() => setOpenReason(false)}
              className="w-1/2"
              variant="outline"
            >
              Gak Jadi
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Card>
        <CardTitle
          onClick={() => router.push(`/profil/${User?.username}`)}
          className={`p-4 pb-0 group ${!Anonymous && "cursor-pointer"}`}
        >
          <div className="flex items-start gap-4">
            <Avatar className="rounded-md">
              <AvatarImage src={(User && User.image) ?? ""} />
              <AvatarFallback className="rounded-md">
                {(User && User.name[0].toUpperCase()) ?? "A"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className={`${!Anonymous && "group-hover:underline"}`}>
                {Anonymous ? "Anonymous" : User && User.name}
              </h2>
              <p
                className={`text-foreground/60 ${
                  !Anonymous && "group-hover:underline"
                }`}
              >
                {Anonymous ? Anonymous.username : User && User.username}
              </p>
            </div>
          </div>
        </CardTitle>
        <CardContent className="p-4 pt-2">
          <div>
            <small className="text-foreground/60 font-bold">
              Dibuat saat {getMetaData(createdAt)}
            </small>
          </div>
          <p className="mt-1">{content}</p>
        </CardContent>
        <CardFooter className="p-0 flex-col items-start pb-2">
          <Separator className="mb-2" />
          <div className="space-x-2 px-4">
            <Button variant="ghost" size="default" className="space-x-2">
              <MessagesSquare className="w-5 aspect-square" />
              <span>{Comment?.length}</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="w-5 aspect-square" />
            </Button>
            <Button
              onClick={() => setOpenReason(true)}
              variant="destructive"
              size="icon"
            >
              <Megaphone className="w-5 aspect-square" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default CardForum;
