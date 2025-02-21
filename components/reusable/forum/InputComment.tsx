import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { user } from "@prisma/client";
import React, { ChangeEventHandler, useRef, useState } from "react";
import EmptyState from "../state/EmptyState";
import LoadingState from "../state/LoadingState";

type Props = {
  commentText: string;
  setCommentText: (value: React.SetStateAction<string>) => void;

  mentionUserIds: string[];
  setMentionUserIds: (value: React.SetStateAction<string[]>) => void;
};

const InputComment = ({
  commentText,
  setCommentText,
  mentionUserIds,
  setMentionUserIds,
}: Props) => {
  const [usernameToMention, setUsernameToMention] = useState("");
  const [showUserOptions, setShowUserOptions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { data: userResponse } = trpc.user.getUsersForMentioning.useQuery(
    { username: usernameToMention },
    {
      enabled: showUserOptions,
    }
  );

  const commentChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    const commentTextInput = e.target.value;

    setCommentText(e.target.value);

    if (commentTextInput.includes("@")) {
      const splittedCommentTextInput = commentTextInput.split(" ");
      const lastInputText =
        splittedCommentTextInput[splittedCommentTextInput.length - 1];

      setShowUserOptions(lastInputText.startsWith("@"));
      setUsernameToMention(lastInputText.startsWith("@") ? lastInputText : "");
    } else {
      setShowUserOptions(false);
      setUsernameToMention("");
    }
  };

  const mentionUserHandler = (
    user: Pick<user, "id" | "username" | "name" | "image">
  ) => {
    const splittedCommentTextInput = commentText.split(" ");
    const commentTextCompletion = splittedCommentTextInput.slice(0, -1);
    const lastMentionedUserId = mentionUserIds[mentionUserIds.length - 1];

    commentTextCompletion.push(`@${user.username}`);

    setCommentText(commentTextCompletion.join(" "));

    if (lastMentionedUserId !== user.id) {
      setMentionUserIds([...mentionUserIds, user.id]);
    }

    setShowUserOptions(false);
    setUsernameToMention("");

    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Komentar..."
        value={commentText}
        onChange={commentChangeHandler}
        required
        ref={inputRef}
      />
      {showUserOptions && (
        <div className="absolute -bottom-25 shadow-md p-2 bg-background inset-x-0 rounded-lg border">
          <LoadingState
            data={userResponse?.data}
            loadingFallback={<p>Lagi di cari...</p>}
          >
            <EmptyState
              status={userResponse?.status}
              message="Gak ada wkwkwk (btw nge tag diri sendiri is prohibited yaw)"
            >
              {userResponse?.data.map((user, idx) => (
                <button
                  role="option"
                  aria-selected="false"
                  type="button"
                  key={idx}
                  className="p-2 flex gap-4 hover:bg-secondary rounded-lg cursor-pointer w-full focus:outline-hidden focus:bg-secondary"
                  onClick={() => mentionUserHandler(user)}
                >
                  <Avatar className="rounded-lg">
                    <AvatarImage className="rounded-lg" src={user.image || ""} />
                    <AvatarFallback className="rounded-lg">
                      {user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <h4 className="font-bold lg:text-base text-sm">
                      {user.name}
                    </h4>
                    <p className="lg:text-sm text-xs">@{user.username}</p>
                  </div>
                </button>
              ))}
            </EmptyState>
          </LoadingState>
        </div>
      )}
    </div>
  );
};

export default InputComment;
