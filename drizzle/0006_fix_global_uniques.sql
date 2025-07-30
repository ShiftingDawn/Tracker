ALTER TABLE "game_board_category" DROP CONSTRAINT "game_board_category_name_unique";--> statement-breakpoint
ALTER TABLE "game_board_section" DROP CONSTRAINT "game_board_section_name_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "unique_name_section_id" ON "game_board_category" USING btree ("name","section_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_name_game_id" ON "game_board_section" USING btree ("name","game_id");