"use client";

import CardForum from "@/components/reusable/forum/CardForum";
import Comment from "@/components/reusable/forum/Comment";
import InputComment from "@/components/reusable/forum/InputComment";
import SubMenuHeader from "@/components/reusable/layout/SubMenuHeader";
import CommentLoaderState from "@/components/reusable/state/CommentLoaderState";
import CreateCommentLoaderState from "@/components/reusable/state/CreateCommentLoaderState";
import LoadingState from "@/components/reusable/state/LoadingState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_ERROR_MSG } from "@/lib/constant/error.constant";
import { filterBadWord } from "@/lib/helper/sensor.helper";
import { useAuth } from "@/lib/hook/auth.hook";
import { trpc } from "@/lib/trpc";
import { user } from "@prisma/client";
import { SendHorizonal } from "lucide-react";
import React, { use, useState } from "react";

type Props = {
  params: Promise<{
    public_id: string;
    post_public_id: string;
  }>;
};

const GroupPostDetailPage = ({ params }: Props) => {
  const { public_id, post_public_id } = use(params);

  const { data: postResponse, refetch } =
    trpc.group.getDetailedGroupPost.useQuery({
      public_group_id: public_id,
      public_post_id: post_public_id,
    });

  const { mutate: createComment, isPending } =
    trpc.comment.createComment.useMutation();

  const [commentText, setCommentText] = useState("");
  const [mentionUserIds, setMentionUserIds] = useState<user["id"][]>([]);

  const { currentUser } = useAuth();
  const { toast } = useToast();

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const countOfMentionUserInComment = commentText
      .split(" ")
      .filter((comment) => comment.startsWith("@")).length;

    const correctedMentionedUserIds = mentionUserIds.slice(
      0,
      countOfMentionUserInComment
    );

    createComment(
      {
        public_id: post_public_id,
        text: filterBadWord(commentText),
        mention_users: correctedMentionedUserIds,
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Notifikasi",
            description: data.message,
          });

          setCommentText("");
          refetch();
        },
        onError: (error) => {
          toast({
            title: "Notifikasi",
            description: DEFAULT_ERROR_MSG,
          });

          setCommentText("");

          console.error(error);
        },
      }
    );
  };

  return (
    <>
      <SubMenuHeader
        data={null}
        title="Detail Postingan"
        backUrl={`/sirkel/${public_id}`}
      />
      <div className="container mt-4 pb-40">
        <LoadingState
          data={postResponse?.data}
          loadingFallback={
            <Skeleton className="w-full h-24 rounded-md bg-muted" />
          }
        >
          {postResponse?.data && (
            <CardForum
              {...postResponse.data}
              _count={{
                comments: postResponse.data.comments.length,
              }}
            />
          )}
        </LoadingState>
        <LoadingState
          data={currentUser}
          loadingFallback={<CreateCommentLoaderState />}
        >
          {currentUser && (
            <div className="mt-4 flex items-center gap-2">
              <Avatar className="rounded-md w-8 h-8">
                <AvatarImage src={currentUser.image ?? ""} />
                <AvatarFallback className="rounded-md">
                  {currentUser.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <form
                onSubmit={submitHandler}
                className="flex items-center grow gap-2"
              >
                <InputComment
                  commentText={commentText}
                  setCommentText={setCommentText}
                  mentionUserIds={mentionUserIds}
                  setMentionUserIds={setMentionUserIds}
                  groupPublicId={public_id}
                />
                <Button size="icon" type="submit" disabled={isPending}>
                  <SendHorizonal className="w-4 aspect-square" />
                </Button>
              </form>
            </div>
          )}
        </LoadingState>
        <div className="mt-4 space-y-2">
          <LoadingState
            data={postResponse?.data}
            loadingFallback={<CommentLoaderState />}
          >
            {postResponse?.data?.comments.map((comment) => (
              <Comment
                replyCommentOpenByDefault={
                  comment.id.toString() ===
                  new URLSearchParams(window.location.search).get("commentId")
                }
                {...comment}
                key={comment.id}
                onCommentChange={() => refetch()}
              />
            ))}
          </LoadingState>
        </div>
      </div>
    </>
  );
};

export default GroupPostDetailPage;
