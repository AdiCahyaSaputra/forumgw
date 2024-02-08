-- DropForeignKey
ALTER TABLE "group_member" DROP CONSTRAINT "group_member_group_id_fkey";

-- AddForeignKey
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
