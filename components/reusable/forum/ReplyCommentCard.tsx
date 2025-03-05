import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getMetaData } from "@/lib/helper/str.helper";
import { useAuth } from "@/lib/hook/auth.hook";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Balancer from "react-wrap-balancer";
import DeleteReplyCommentDialog from "./DeleteReplyCommentDialog";
import EditReplyCommentForm from "./EditReplyCommentForm";

type Props = {
  text: string;
  id: number;
  created_at: string;
  user: {
    image: string | null;
    username: string;
  };
  onReplyCommentChange: () => void;
};

const ReplyCommentCard = ({
  text,
  id,
  created_at,
  user,
  onReplyCommentChange,
}: Props) => {
  const { currentUser } = useAuth();

  const [openEditMenu, setOpenEditMenu] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <li className="p-3 border-b">
      <EditReplyCommentForm
        openEditMenu={openEditMenu}
        setOpenEditMenu={setOpenEditMenu}
        reply_comment_id={id}
        text={text}
        onCommentChange={onReplyCommentChange}
      />

      <DeleteReplyCommentDialog
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        reply_comment_id={id}
        onCommentChange={onReplyCommentChange}
      />

      <div className="flex items-center justify-between">
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

        {currentUser.username === user?.username && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="w-max flex items-center gap-2"
                variant="outline"
                size="sm"
              >
                <Menu className="w-4 aspect-square" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
              <DropdownMenuItem
                onClick={() => setOpenEditMenu(true)}
                className="cursor-pointer"
              >
                Edit Komen
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setOpenDeleteDialog(true)}
                className="cursor-pointer focus:bg-destructive focus:text-white"
              >
                Hapus Komen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <p className="mt-2 cst-wrap-text">
        <Balancer>{text}</Balancer>
      </p>
    </li>
  );
};

export default ReplyCommentCard;
