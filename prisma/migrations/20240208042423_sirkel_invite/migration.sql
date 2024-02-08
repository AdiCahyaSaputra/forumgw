-- DropForeignKey
ALTER TABLE "group_member" DROP CONSTRAINT "group_member_user_id_fkey";

-- DropForeignKey
ALTER TABLE "group_post" DROP CONSTRAINT "group_post_group_id_fkey";

-- DropForeignKey
ALTER TABLE "group_post" DROP CONSTRAINT "group_post_post_id_fkey";

-- CreateTable
CREATE TABLE "group_invitation" (
    "id" SERIAL NOT NULL,
    "group_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "group_invitation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_post" ADD CONSTRAINT "group_post_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_post" ADD CONSTRAINT "group_post_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_invitation" ADD CONSTRAINT "group_invitation_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_invitation" ADD CONSTRAINT "group_invitation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
