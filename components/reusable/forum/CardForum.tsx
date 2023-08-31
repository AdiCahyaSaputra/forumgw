import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getMetaData } from "@/lib/helper/str.helper";
import { Megaphone, MessagesSquare, Share2 } from "lucide-react";
import React from "react";

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
  Comment:
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
  return (
    <Card>
      <CardTitle className="p-4 pb-0 group cursor-pointer">
        <div className="flex items-start gap-4">
          <Avatar className="rounded-md">
            <AvatarImage />
            <AvatarFallback className="rounded-md">PP</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="group-hover:underline">
              {Anonymous ? "Anonymous" : User && User.name}
            </h2>
            <p className="text-foreground/60 group-hover:underline">
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
          <Button variant="destructive" size="icon">
            <Megaphone className="w-5 aspect-square" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardForum;
