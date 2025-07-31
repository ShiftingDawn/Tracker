CREATE TABLE "user_quest_completion" (
	"user_id" uuid NOT NULL,
	"quest_id" uuid NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_quest_completion_user_id_quest_id_pk" PRIMARY KEY("user_id","quest_id")
);
--> statement-breakpoint
ALTER TABLE "user_quest_completion" ADD CONSTRAINT "user_quest_completion_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_quest_completion" ADD CONSTRAINT "user_quest_completion_quest_id_game_quest_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."game_quest"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_id_quest_id" ON "user_quest_completion" USING btree ("user_id","quest_id");