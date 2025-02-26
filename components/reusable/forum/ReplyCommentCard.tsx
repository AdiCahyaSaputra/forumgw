import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

type Props = {};

const ReplyCommentCard = (props: Props) => {
  return (
    <li className="p-3 border-b">
      <div className="flex items-start gap-2">
        <Avatar className="w-10 h-10 rounded-md">
          <AvatarImage src={""} />
          <AvatarFallback className="rounded-md">A</AvatarFallback>
        </Avatar>
        <div>
          <Link href={`/profil/`}>
            <Badge
              variant={
                // currentUser.username === user?.username
                //   ? "default"
                //   : "outline"
                "outline"
              }
            >
              John
            </Badge>
          </Link>
          <p className="text-xs text-foreground/60 mt-1">2 hari yang lalu</p>
        </div>
      </div>

      <p className="mt-2 cst-wrap-text">
        <Balancer>Hello</Balancer>
      </p>
    </li>
  );
};

export default ReplyCommentCard;
