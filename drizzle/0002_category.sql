CREATE TABLE "game_board_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(64) NOT NULL,
	"description" varchar(255) NOT NULL,
	"icon" uuid DEFAULT gen_random_uuid(),
	"game_id" uuid NOT NULL,
	"creator_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "game_board_category_name_unique" UNIQUE("name"),
	CONSTRAINT "game_board_category_description_unique" UNIQUE("description")
);
--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "game_board_category" ADD CONSTRAINT "game_board_category_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_board_category" ADD CONSTRAINT "game_board_category_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;