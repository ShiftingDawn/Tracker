CREATE TABLE "game_quest_task" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(64) NOT NULL,
	"description" text NOT NULL,
	"icon" uuid DEFAULT gen_random_uuid(),
	"order" smallint NOT NULL,
	"quest_id" uuid NOT NULL,
	"creator_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_quest_task_completion" (
	"user_id" uuid NOT NULL,
	"quest_task_id" uuid NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_quest_task_completion_user_id_quest_task_id_pk" PRIMARY KEY("user_id","quest_task_id")
);
--> statement-breakpoint
CREATE TABLE "user_quest_task_pinned" (
	"user_id" uuid NOT NULL,
	"quest_task_id" uuid NOT NULL,
	"order" smallint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_quest_task_pinned_user_id_quest_task_id_pk" PRIMARY KEY("user_id","quest_task_id")
);
--> statement-breakpoint
ALTER TABLE "game_quest_task" ADD CONSTRAINT "game_quest_task_quest_id_game_quest_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."game_quest"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_quest_task" ADD CONSTRAINT "game_quest_task_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_quest_task_completion" ADD CONSTRAINT "user_quest_task_completion_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_quest_task_completion" ADD CONSTRAINT "user_quest_task_completion_quest_task_id_game_quest_task_id_fk" FOREIGN KEY ("quest_task_id") REFERENCES "public"."game_quest_task"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_quest_task_pinned" ADD CONSTRAINT "user_quest_task_pinned_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_quest_task_pinned" ADD CONSTRAINT "user_quest_task_pinned_quest_task_id_game_quest_task_id_fk" FOREIGN KEY ("quest_task_id") REFERENCES "public"."game_quest_task"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_game_quest_task.name_quest_id" ON "game_quest_task" USING btree ("name","quest_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_quest_completion.unique_user_id_quest_task_id" ON "user_quest_task_completion" USING btree ("user_id","quest_task_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_quest_pinned.unique_user_id_quest_task_id" ON "user_quest_task_pinned" USING btree ("user_id","quest_task_id");