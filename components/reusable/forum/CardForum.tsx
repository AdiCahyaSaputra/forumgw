import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_ERROR_MSG } from "@/lib/constant/error.constant";
import { getMetaData } from "@/lib/helper/str.helper";
import Tag from "@/lib/interface/Tag";
import { trpc } from "@/lib/trpc";
import { Megaphone, MessagesSquare, Share2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Balancer } from "react-wrap-balancer";
import ReportPost from "./ReportPost";

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

  const { toast } = useToast();

  const searchParams = useSearchParams();

  const { mutate: reportPost, isPending } = trpc.post.reportPost.useMutation();

  const reportHandler = () => {
    reportPost(
      {
        public_id,
        reason,
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Notifikasi",
            description: data.message,
          });

          setOpenReason(false);
          setReason("");
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

  return (
    <>
      <ReportPost
        openReason={openReason}
        setOpenReason={setOpenReason}
        setReason={setReason}
        isPending={isPending}
        reportHandler={reportHandler}
      />
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
                  const category = searchParams?.get("c") ?? "fyp";
                  const existingTags = searchParams?.get("t");
                  const newTagId = tag.id;
                  const tagList = existingTags
                    ? `${newTagId},${existingTags}`
                    : newTagId;

                  const tagFilterPath = `/forum?c=${category}&t=${tagList}`;

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
