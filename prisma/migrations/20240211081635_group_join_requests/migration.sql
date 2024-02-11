-- CreateTable
CREATE TABLE "group_join_request" (
    "id" SERIAL NOT NULL,
    "group_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "group_join_request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "group_join_request" ADD CONSTRAINT "group_join_request_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_join_request" ADD CONSTRAINT "group_join_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
