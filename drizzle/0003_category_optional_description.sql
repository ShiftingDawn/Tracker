ALTER TABLE "game_board_category" DROP CONSTRAINT "game_board_category_description_unique";--> statement-breakpoint
ALTER TABLE "game_board_category" ALTER COLUMN "description" DROP NOT NULL;