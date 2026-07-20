/*
  Warnings:

  - You are about to drop the `ImageStore` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ImageStore" DROP CONSTRAINT "ImageStore_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "game" DROP CONSTRAINT "game_icon_id_fkey";

-- DropForeignKey
ALTER TABLE "game_category" DROP CONSTRAINT "game_category_icon_id_fkey";

-- DropForeignKey
ALTER TABLE "game_quest" DROP CONSTRAINT "game_quest_icon_id_fkey";

-- DropForeignKey
ALTER TABLE "game_quest_task" DROP CONSTRAINT "game_quest_task_icon_id_fkey";

-- DropTable
DROP TABLE "ImageStore";

-- CreateTable
CREATE TABLE "images" (
    "id" UUID NOT NULL,
    "file_name" VARCHAR(64) NOT NULL,
    "file_type" VARCHAR(32) NOT NULL,
    "creator_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_category" ADD CONSTRAINT "game_category_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_quest" ADD CONSTRAINT "game_quest_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_quest_task" ADD CONSTRAINT "game_quest_task_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
