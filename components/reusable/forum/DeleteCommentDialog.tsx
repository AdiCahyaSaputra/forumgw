import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

type TDeleteDialog = {
  comment_id: number;
  openDeleteDialog: boolean;
  setOpenDeleteDialog: (value: React.SetStateAction<boolean>) => void;
  setResponse: (value: React.SetStateAction<{ message: string }>) => void;
};

const DeleteCommentDialog: React.FC<TDeleteDialog> = ({
  comment_id,
  openDeleteDialog,
  setOpenDeleteDialog,
  setResponse,
}) => {
  const { mutate: deleteComment, isPending } =
    trpc.comment.deleteComment.useMutation();

  const deleteHandler = () => {
    deleteComment(
      {
        comment_id,
      },
      {
        onSuccess: (data) => {
          setResponse(data);
          setOpenDeleteDialog(false);
        },
        onError: (error) => {
          setResponse({
            message: "Duh error bre",
          });

          console.log(error);
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
