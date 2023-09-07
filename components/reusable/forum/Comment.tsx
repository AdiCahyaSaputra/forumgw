import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMetaData } from "@/lib/helper/str.helper";
import Link from "next/link";
import React from "react";

type TProps = {
  id: number;
  text: string;
  createdAt: string;
  User?: {
    id: string;
    username: string;
    image: string | null;
  } | null;
};

const Comment: React.FC<TProps> = ({ id, text, createdAt, User }) => {
  return (
    <div className="flex items-start gap-2">
      <Avatar className="w-10 h-10 rounded-md">
        <AvatarImage src={User?.image ?? ""} />
        <AvatarFallback className="rounded-md">
          {User?.username[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="py-2 px-3 bg-white border rounded-md grow">
        <Link href={`/profil/${User?.username}`}>
          <h4 className="text-lg font-bold hover:underline">
            {User?.username}
          </h4>
        </Link>
        <p className="text-sm text-foreground/60">{getMetaData(createdAt)}</p>

        <p className="mt-2">{text}</p>
      </div>
    </div>
  );
};

export default Comment;
