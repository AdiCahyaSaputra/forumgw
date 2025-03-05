import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";
import { user } from "@prisma/client";
import { Reply } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import EmptyState from "../state/EmptyState";
import LoadingState from "../state/LoadingState";
import InputComment from "./InputComment";
import ReplyCommentCard from "./ReplyCommentCard";

type Props = {
  commentId: number;

  replyCommentCount: number;
  setReplyCommentCount: (value: React.SetStateAction<number>) => void;
};

const ReplyCommentList = (props: Props) => {
  const [replyCommentText, setReplyCommentText] = useState("");
  const [mentionUserIds, setMentionUserIds] = useState<user["id"][]>([]);

  const { toast } = useToast();

  const { data: replyComments, refetch: gimmeAFcknLatestReplyCommentsData } =
    trpc.comment.getReplyComment.useQuery({
      commentId: props.commentId,
    });

  const { mutate: replyTheComment, isPending: isReplying } =
    trpc.comment.replyComment.useMutation();

  const handleReplyComment = (e: FormEvent) => {
    e.preventDefault();

    replyTheComment(
      {
        text: replyCommentText,
        mention_users: mentionUserIds,
        comment_id: props.commentId,
      },
      {
        onSuccess: () => {
          setReplyCommentText("");
          setMentionUserIds([]);

          gimmeAFcknLatestReplyCommentsData();
        },
        onError: (error) => {
          toast({
            title: "Notifikasi",
            description: "Duh error bre",
          });

          setReplyCommentText("");
          setMentionUserIds([]);

          console.error(error);
        },
      }
    );
  };

  useEffect(() => {
    props.setReplyCommentCount(
      replyComments?.data ? replyComments.data.length : 0
    );
  }, [replyComments]);

  return (
    <div className="relative">
      <ul className="flex flex-col gap-2 max-h-44 overflow-y-auto">
        <LoadingState
          data={replyComments}
          loadingFallback={
            <Skeleton className="p-4 w-full bg-secondary"></Skeleton>
          }
        >
          <EmptyState
            status={replyComments?.status}
            message={replyComments?.message}
            className="w-full rounded-none"
          >
            {replyComments?.data?.map((replyComment, idx) => (
              <ReplyCommentCard
                key={idx}
                {...replyComment}
                onReplyCommentChange={() => gimmeAFcknLatestReplyCommentsData()}
              />
            ))}
          </EmptyState>
        </LoadingState>
      </ul>
      <div className="p-3 sticky bg-white rounded-b-md bottom-0 border-t z-10">
        <form className="flex gap-2 items-start" onSubmit={handleReplyComment}>
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
            type="submit"
            disabled={isReplying}
          >
            <Reply className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ReplyCommentList;
