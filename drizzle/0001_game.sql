CREATE TABLE "game" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(64) NOT NULL,
	"icon" uuid DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	CONSTRAINT "game_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "game" ADD CONSTRAINT "game_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;