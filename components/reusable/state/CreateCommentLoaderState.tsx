import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

const CreateCommentLoaderState = (props: Props) => {
  return (
    <div className="flex items-center gap-2 mt-4">
      <Skeleton className="w-8 h-8 rounded-md" />
      <Skeleton className="grow h-8 rounded-md" />
    </div>
  );
};

export default CreateCommentLoaderState;
