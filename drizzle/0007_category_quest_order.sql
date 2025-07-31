CREATE TABLE "game_quest" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(64) NOT NULL,
	"description" text NOT NULL,
	"icon" uuid DEFAULT gen_random_uuid(),
	"order" smallint NOT NULL,
	"category_id" uuid NOT NULL,
	"creator_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "game_board_category" ADD COLUMN "order" smallint NOT NULL;--> statement-breakpoint
ALTER TABLE "game_quest" ADD CONSTRAINT "game_quest_category_id_game_board_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."game_board_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_quest" ADD CONSTRAINT "game_quest_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_name_category_id" ON "game_quest" USING btree ("name","category_id");