import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { getMetaData } from "@/lib/helper/str.helper";
import Tag from "@/lib/interface/Tag";
import { trpc } from "@/lib/trpc";
import { Megaphone, MessagesSquare, Share2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Balancer } from "react-wrap-balancer";

type TProps = {
  public_id: string;
  content: string;
  created_at: string;
  user?: {
    name: string;
    username: string;
    image: string | null;
  } | null;
  anonymous?: {
    username: string;
  } | null;
  tag_post: { tag: Tag }[];
  _count: {
    comments: number;
  };
};

const CardForum: React.FC<TProps> = ({
  public_id,
  content,
  created_at,
  user,
  anonymous,
  tag_post,
  _count,
}) => {
  const [reason, setReason] = useState("");
  const [openReason, setOpenReason] = useState(false);
  const [response, setResponse] = useState({
    message: "",
  });

  const { toast } = useToast();

  const searchParams = useSearchParams();

  const { mutate: reportPost, isLoading } = trpc.post.reportPost.useMutation();

  const reportHandler = () => {
    reportPost(
      {
        public_id,
        reason,
      },
      {
        onSuccess: (data) => {
          setResponse(data);
          setOpenReason(false);
          setReason("");
        },
        onError: (error) => {
          setResponse({
            message: "Duh error bre",
          });

          console.log(error);
        },
      }
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
        <Link href={`/profil/${user?.username}`}>
          <CardTitle
            className={`p-4 pb-0 group ${!anonymous && "cursor-pointer"}`}
          >
            <div className="flex items-start gap-4">
              <Avatar className="rounded-md">
                <AvatarImage src={(user && user.image) ?? ""} />
                <AvatarFallback className="rounded-md">
                  {(user && user.name[0].toUpperCase()) ?? "A"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className={`${!anonymous && "group-hover:underline"}`}>
                  {anonymous ? "Anonymous" : user && user.name}
                </h2>
                <p
                  className={`text-foreground/60 ${
                    !anonymous && "group-hover:underline"
                  }`}
                >
                  {anonymous ? anonymous.username : user && user.username}
                </p>
              </div>
            </div>
          </CardTitle>
        </Link>
        <CardContent className="p-4 pt-2">
          <div className="flex flex-col">
            <small className="text-foreground/60 text-sm">
              Dibuat saat {getMetaData(created_at)}
            </small>

            {tag_post.length > 0 && (
              <div className="py-2 space-x-2">
                {tag_post.map(({ tag }, idx) => {
                  let tagFilter = [tag.id.toString()];

                  if (searchParams?.has("t")) {
                    tagFilter.push(...searchParams.get("t")!.split(","));
                  }

                  const tagFilterPath = `/forum?c=${searchParams?.get("c") ?? "fyp"}&t=${tagFilter.join(",")}`;

                  return (
                    <Link href={tagFilterPath} key={idx}>
                      <Badge
                        variant="outline"
                        className="w-max hover:bg-muted cursor-pointer"
                      >
                        #{tag.name}
                      </Badge>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          <p className="mt-1 cst-wrap-text">
            <Balancer>{content}</Balancer>
          </p>
        </CardContent>
        <CardFooter className="p-0 flex-col items-start pb-2">
          <Separator className="mb-2" />
          <div className="space-x-2 px-4 py-2">
            <Link href={`/forum/${public_id}`}>
              <Button variant="outline" size="default" className="space-x-2">
                <MessagesSquare className="w-5 aspect-square" />
                <span>{_count.comments}</span>
              </Button>
            </Link>
            <Button variant="outline" size="icon">
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
