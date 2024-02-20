import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getMetaData } from "@/lib/helper/str.helper";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import Balancer from "react-wrap-balancer";

type TProps = {
  reason: string;
  post?: {
    id: string;
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
  } | null;
};

const CardPostReport: React.FC<TProps> = ({ reason, post }) => {
  const trimReason = (length: number, str: string) => {
    const splittedStr = str.split("");
    splittedStr.splice(length + 1, str.length - length + 1, "...");

    return splittedStr.join("");
  };

  return (
    <Card>
      <CardTitle className={`p-4 pb-0`}>
        <div className="flex items-start gap-4">
          <Avatar className="rounded-md">
            <AvatarImage src={(post?.user && post?.user?.image) ?? ""} />
            <AvatarFallback className="rounded-md">
              {(post?.user && post?.user?.name[0].toUpperCase()) ?? "A"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2>
              {post?.anonymous ? "Anonymous" : post?.user && post?.user?.name}
            </h2>
            <p className="text-foreground/60">
              {post?.anonymous
                ? post?.anonymous?.username
                : post?.user && post?.user?.username}
            </p>
          </div>
        </div>
      </CardTitle>
      <CardContent className="p-4 pt-2">
        <div>
          <small className="text-foreground/60 font-bold">
            Dibuat saat {getMetaData(post?.created_at!)}
          </small>
        </div>
        <p className="mt-1 cst-wrap-text">
          <Balancer>{post?.content}</Balancer>
        </p>
      </CardContent>
      <CardFooter className="p-0 flex-col items-start">
        <Separator />
        <div className="flex justify-between items-center py-2 px-4 bg-destructive text-white rounded-md rounded-t-none w-full">
          <p className="font-bold">
            Alasan:{" "}
            <span className="font-normal">{trimReason(15, reason)}</span>
          </p>
          <Link href={`/reported-post/detail/${post?.id}`}>
            <Button variant="ghost" size="icon">
              <ChevronRight className="w-5 aspect-square" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardPostReport;
