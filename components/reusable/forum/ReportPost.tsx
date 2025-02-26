import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";

type Props = {
  openReason: boolean;
  setOpenReason: (value: React.SetStateAction<boolean>) => void;
  setReason: (value: React.SetStateAction<string>) => void;
  isPending: boolean;
  reportHandler: () => void;
};

const ReportPost = ({
  openReason,
  setOpenReason,
  setReason,
  isPending,
  reportHandler,
}: Props) => {
  return (
    <div
      className={`fixed inset-0 bg-white/80 backdrop-blur-md z-20 items-center justify-center ${openReason ? "flex" : "hidden"
        }`}
    >
      <Card>
        <CardTitle className="font-bold p-4">Apa alasan lo bre ?</CardTitle>
        <CardContent className="p-4 pt-0">
          <Input
            onChange={(e) => setReason(e.target.value)}
            required
            autoFocus={true}
            type="text"
            placeholder="Jangan panjang panjang..."
          />
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2 justify-between">
          <Button
            onClick={reportHandler}
            disabled={isPending}
            className="w-1/2"
            variant="destructive"
          >
            {isPending ? "Proses..." : "Laporin"}
          </Button>
          <Button
            onClick={() => setOpenReason(false)}
            className="w-1/2"
            variant="outline"
          >
            Gak Jadi
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReportPost;
