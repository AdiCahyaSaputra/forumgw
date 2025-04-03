"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_ERROR_MSG } from "@/lib/constant/error.constant";
import { OurFileRouter } from "@/lib/helper/uploadthing.helper";
import { TCurrentAuthUser } from "@/lib/hook/auth.hook";
import { trpc } from "@/lib/trpc";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { Plus } from "lucide-react";
import React, { useState } from "react";

const { uploadFiles } = generateReactHelpers<OurFileRouter>();

type TProps = {
  user?: Omit<TCurrentAuthUser, "role"> | null;
  onProfileChange: () => void;
};

const UploadPPForm: React.FC<TProps> = ({ user, onProfileChange }) => {
  const { toast } = useToast();

  const { mutate: editProfile } = trpc.user.editProfile.useMutation();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState("");

  const [beginUpload, setBeginUpload] = useState(false);

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      if (file.size > 1024 * 3000) {
        return alert("Ukuran file terlalu besar");
      }

      setFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const fileUploadHandler = async () => {
    if (!file || !user) return;

    const formData = new FormData();
    formData.append("file", file);

    setBeginUpload(true);

    const uploadResponse = await uploadFiles({
      files: [file],
      endpoint: "imageUploader",
    });

    editProfile(
      {
        name: user?.name,
        username: user?.username,
        bio: user?.bio,
        image: uploadResponse[0].url,
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Notifikasi",
            description: data.message,
          });

          setFile(null);
          setFilePreview("");
          setBeginUpload(false);
          setOpen(false);

          onProfileChange();
        },
        onError: (error) => {
          toast({
            title: "Notifikasi",
            description: DEFAULT_ERROR_MSG,
          });

          setFile(null);
          setFilePreview("");

          console.error(error);

          setBeginUpload(false);
        },
      }
    );
  };

  return (
    <div className="mt-4 flex items-start gap-4">
      <Avatar
        onClick={() => setOpen(true)}
        className="rounded-md cursor-pointer w-16 h-16"
      >
        <AvatarImage src={user?.image ?? ""} />
        <AvatarFallback className="rounded-md">
          {user && user.username[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div>
        <h3 className="text-md font-bold">Ubah Foto Profil Lo</h3>
        <p className="text-sm text-foreground/60">
          PP kok Anime, Kartun, Idol ?
        </p>
      </div>

      <div
        className={`${
          open ? "block" : "hidden"
        } fixed inset-0 bg-black/50 z-20 flex justify-center items-center`}
      >
        <Card className="lg:w-1/5 w-8/12">
          <CardHeader>
            <CardTitle className="text-xl">Ubah Foto Profil</CardTitle>
            <CardDescription>
              Maksimal <code className="p-1 bg-muted rounded">2MB</code> Ukuran
              <code className="p-1 bg-muted rounded">500x500</code>
            </CardDescription>
            <CardContent className="p-0 pt-4">
              <div
                className="w-full aspect-square bg-muted relative bg-cover bg-center group"
                style={{
                  backgroundImage: `url(${filePreview})`,
                }}
              >
                {filePreview && (
                  <div className="absolute inset-0 bg-black/80 hidden transition-all items-center group-hover:flex justify-center">
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setFile(null);
                        setFilePreview("");
                      }}
                    >
                      Hapus
                    </Button>
                  </div>
                )}
                <label
                  htmlFor="pp"
                  className={`absolute inset-0 flex items-center justify-center cursor-pointer ${
                    filePreview && "hidden"
                  }`}
                >
                  <Plus />
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="pp"
                  multiple={false}
                  className="hidden"
                  onChange={fileChangeHandler}
                />
              </div>
            </CardContent>
            <CardFooter className="p-0 gap-2 pt-4 justify-between">
              <Button
                disabled={beginUpload}
                className="w-1/2"
                onClick={fileUploadHandler}
              >
                {beginUpload ? "Proses..." : "Upload"}
              </Button>
              <Button
                className="w-1/2"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Gk Jadi
              </Button>
            </CardFooter>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default UploadPPForm;
