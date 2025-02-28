import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getMetaData } from "@/lib/helper/str.helper";
import { useAuth } from "@/lib/hook/auth.hook";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

type Props = {
  text: string;
  id: number;
  created_at: string;
  user: {
    image: string | null;
    username: string;
  };
};

const ReplyCommentCard = ({ text, id, created_at, user }: Props) => {
  const { currentUser } = useAuth();

  return (
    <li className="p-3 border-b">
      <div className="flex items-start gap-2">
        <Avatar className="w-10 h-10 rounded-md">
          <AvatarImage src={user.image || ""} />
          <AvatarFallback className="rounded-md">
            {user.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <Link href={`/profil/${user.username}`}>
            <Badge
              variant={
                currentUser.username === user.username ? "default" : "outline"
              }
            >
              {user.username}
            </Badge>
          </Link>
          <p className="text-xs text-foreground/60 mt-1">
            {getMetaData(created_at)}
          </p>
        </div>
      </div>

      <p className="mt-2 cst-wrap-text">
        <Balancer>{text}</Balancer>
      </p>
    </li>
  );
};

export default ReplyCommentCard;
