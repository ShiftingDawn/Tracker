/*
  Warnings:

  - You are about to drop the column `icon` on the `game` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `game_category` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `game_quest` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `game_quest_task` table. All the data in the column will be lost.
  - Added the required column `icon_id` to the `game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "game" DROP COLUMN "icon",
ADD COLUMN     "icon_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "game_category" DROP COLUMN "icon",
ADD COLUMN     "icon_id" UUID;

-- AlterTable
ALTER TABLE "game_quest" DROP COLUMN "icon",
ADD COLUMN     "icon_id" UUID;

-- AlterTable
ALTER TABLE "game_quest_task" DROP COLUMN "icon",
ADD COLUMN     "icon_id" UUID;

-- CreateTable
CREATE TABLE "ImageStore" (
    "id" UUID NOT NULL,
    "file_name" VARCHAR(64) NOT NULL,
    "file_type" VARCHAR(32) NOT NULL,
    "creator_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImageStore_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImageStore" ADD CONSTRAINT "ImageStore_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "ImageStore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_category" ADD CONSTRAINT "game_category_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "ImageStore"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_quest" ADD CONSTRAINT "game_quest_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "ImageStore"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_quest_task" ADD CONSTRAINT "game_quest_task_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "ImageStore"("id") ON DELETE SET NULL ON UPDATE CASCADE;
