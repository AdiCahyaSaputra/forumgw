-- CreateTable
CREATE TABLE "reply_comment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reply_comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reply_comment" ADD CONSTRAINT "reply_comment_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reply_comment" ADD CONSTRAINT "reply_comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
