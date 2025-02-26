import { Button } from "@/components/ui/button";
import { user } from "@prisma/client";
import { Reply } from "lucide-react";
import { useState } from "react";
import InputComment from "./InputComment";
import ReplyCommentCard from "./ReplyCommentCard";

type Props = {};

const ReplyCommentList = (props: Props) => {
  const [replyCommentText, setReplyCommentText] = useState("");
  const [mentionUserIds, setMentionUserIds] = useState<user["id"][]>([]);

  return (
    <div className="relative">
      <ul className="flex flex-col gap-2 max-h-44 overflow-y-auto">
        <ReplyCommentCard />
        <ReplyCommentCard />
        <ReplyCommentCard />
      </ul>
      <div className="p-3 sticky bottom-0 border-t">
        <form className="flex gap-2 items-start">
          <InputComment
            commentText={replyCommentText}
            setCommentText={setReplyCommentText}
            mentionUserIds={mentionUserIds}
            setMentionUserIds={setMentionUserIds}
            inputPlaceholder="Balas Komentar..."
          />
          <Button
            size="icon"
            variant="outline"
            className="flex items-center gap-2"
          >
            <Reply className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ReplyCommentList;
