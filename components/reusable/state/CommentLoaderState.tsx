import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

const CommentLoaderState = (props: Props) => {
  return (
    <div className="flex items-start gap-2 mt-4">
      <Skeleton className="w-10 h-10 rounded-md" />
      <Skeleton className="grow h-24 rounded-md" />
    </div>
  );
};

export default CommentLoaderState;
