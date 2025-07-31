CREATE TABLE "user_quest_pinned" (
	"user_id" uuid NOT NULL,
	"quest_id" uuid NOT NULL,
	"order" smallint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_quest_pinned_user_id_quest_id_pk" PRIMARY KEY("user_id","quest_id")
);
--> statement-breakpoint
DROP INDEX "unique_name_section_id";--> statement-breakpoint
DROP INDEX "unique_name_game_id";--> statement-breakpoint
DROP INDEX "unique_name_category_id";--> statement-breakpoint
DROP INDEX "unique_user_id_quest_id";--> statement-breakpoint
ALTER TABLE "user_quest_pinned" ADD CONSTRAINT "user_quest_pinned_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_quest_pinned" ADD CONSTRAINT "user_quest_pinned_quest_id_game_quest_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."game_quest"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_quest_pinned.unique_user_id_quest_id" ON "user_quest_pinned" USING btree ("user_id","quest_id");--> statement-breakpoint
CREATE UNIQUE INDEX "game_board_category.unique_name_section_id" ON "game_board_category" USING btree ("name","section_id");--> statement-breakpoint
CREATE UNIQUE INDEX "game_board_section.unique_name_game_id" ON "game_board_section" USING btree ("name","game_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_game_quest.name_category_id" ON "game_quest" USING btree ("name","category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_quest_completion.unique_user_id_quest_id" ON "user_quest_completion" USING btree ("user_id","quest_id");