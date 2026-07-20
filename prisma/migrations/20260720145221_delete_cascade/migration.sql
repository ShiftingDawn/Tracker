-- DropForeignKey
ALTER TABLE "user_quest_completion" DROP CONSTRAINT "user_quest_completion_quest_id_fkey";

-- DropForeignKey
ALTER TABLE "user_quest_completion" DROP CONSTRAINT "user_quest_completion_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_quest_pinned" DROP CONSTRAINT "user_quest_pinned_quest_id_fkey";

-- DropForeignKey
ALTER TABLE "user_quest_pinned" DROP CONSTRAINT "user_quest_pinned_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_quest_task_completion" DROP CONSTRAINT "user_quest_task_completion_task_id_fkey";

-- DropForeignKey
ALTER TABLE "user_quest_task_completion" DROP CONSTRAINT "user_quest_task_completion_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_quest_task_pinned" DROP CONSTRAINT "user_quest_task_pinned_task_id_fkey";

-- DropForeignKey
ALTER TABLE "user_quest_task_pinned" DROP CONSTRAINT "user_quest_task_pinned_user_id_fkey";

-- AddForeignKey
ALTER TABLE "user_quest_completion" ADD CONSTRAINT "user_quest_completion_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quest_completion" ADD CONSTRAINT "user_quest_completion_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "game_quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quest_pinned" ADD CONSTRAINT "user_quest_pinned_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quest_pinned" ADD CONSTRAINT "user_quest_pinned_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "game_quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quest_task_completion" ADD CONSTRAINT "user_quest_task_completion_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quest_task_completion" ADD CONSTRAINT "user_quest_task_completion_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "game_quest_task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quest_task_pinned" ADD CONSTRAINT "user_quest_task_pinned_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quest_task_pinned" ADD CONSTRAINT "user_quest_task_pinned_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "game_quest_task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
