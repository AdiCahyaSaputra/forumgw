-- CreateTable
CREATE TABLE "jwt" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "jwt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "jwt" ADD CONSTRAINT "jwt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
