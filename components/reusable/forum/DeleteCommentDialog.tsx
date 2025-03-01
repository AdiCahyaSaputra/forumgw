import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_ERROR_MSG } from "@/lib/constant/error.constant";
import { trpc } from "@/lib/trpc";

type TDeleteDialog = {
  comment_id: number;
  openDeleteDialog: boolean;
  setOpenDeleteDialog: (value: React.SetStateAction<boolean>) => void;
  onCommentChange: () => void;
};

const DeleteCommentDialog: React.FC<TDeleteDialog> = ({
  comment_id,
  openDeleteDialog,
  setOpenDeleteDialog,
  onCommentChange
}) => {
  const { toast } = useToast();

  const { mutate: deleteComment, isPending } =
    trpc.comment.deleteComment.useMutation();

  const deleteHandler = () => {
    deleteComment(
      {
        comment_id,
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Notifikasi",
            description: data.message,
          });

          setOpenDeleteDialog(false);

          onCommentChange();
        },
        onError: (error) => {
          toast({
            title: "Notifikasi",
            description: DEFAULT_ERROR_MSG,
          });

          console.error(error);
        },
      }
    );
  };

  return (
    <div
      className={`fixed inset-0 z-20 bg-white/60 justify-center items-center ${
        openDeleteDialog ? "flex" : "hidden"
      }`}
    >
      <Card>
        <CardHeader>
          <CardTitle>Hapus Komentar</CardTitle>
          <CardDescription>
            Cuma sekedar konfirmasi aja sih ini mah awowkwowk 😅
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end gap-2">
            <Button
              disabled={isPending}
              variant="destructive"
              onClick={deleteHandler}
            >
              {isPending ? "Proses..." : "Yaudah Sih"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
            >
              Gak Jadi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteCommentDialog;
