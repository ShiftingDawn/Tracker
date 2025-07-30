CREATE TABLE "game_board_section" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(64) NOT NULL,
	"description" varchar(255),
	"game_id" uuid NOT NULL,
	"creator_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "game_board_section_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "game_board_category" DROP CONSTRAINT "game_board_category_game_id_game_id_fk";
--> statement-breakpoint
INSERT INTO "game_board_section"("name", "description", "game_id", "creator_id") SELECT 'Default', 'Default (unsorted) categories', "id", "creator_id" FROM "game";--> statement-breakpoint
ALTER TABLE "game_board_category" ADD COLUMN "section_id" uuid;--> statement-breakpoint
UPDATE "game_board_category" SET "section_id" = (
	SELECT "id" FROM "game_board_section" WHERE "game_board_section"."game_id" = "game_board_category"."game_id"
);
--> statement-breakpoint
ALTER TABLE "game_board_category" ALTER COLUMN "section_id" SET NOT NULL;--> statement-breakpoint

ALTER TABLE "game_board_section" ADD CONSTRAINT "game_board_section_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_board_section" ADD CONSTRAINT "game_board_section_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_board_category" ADD CONSTRAINT "game_board_category_section_id_game_board_section_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."game_board_section"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_board_category" DROP COLUMN "game_id";