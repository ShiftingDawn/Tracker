-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game" (
    "id" UUID NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "icon" UUID NOT NULL,
    "creator_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_section" (
    "id" UUID NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "order" SMALLINT NOT NULL,
    "game_id" UUID NOT NULL,
    "creator_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_category" (
    "id" UUID NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "description" TEXT,
    "icon" UUID,
    "order" SMALLINT NOT NULL,
    "section_id" UUID NOT NULL,
    "creator_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_quest" (
    "id" UUID NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "description" TEXT NOT NULL,
    "icon" UUID,
    "order" SMALLINT NOT NULL,
    "category_id" UUID NOT NULL,
    "creator_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_quest_completion" (
    "user_id" UUID NOT NULL,
    "quest_id" UUID NOT NULL,
    "completed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_quest_completion_pkey" PRIMARY KEY ("user_id","quest_id")
);

-- CreateTable
CREATE TABLE "user_quest_pinned" (
    "user_id" UUID NOT NULL,
    "quest_id" UUID NOT NULL,
    "order" SMALLINT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_quest_pinned_pkey" PRIMARY KEY ("user_id","quest_id")
);

-- CreateTable
CREATE TABLE "game_quest_task" (
    "id" UUID NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "description" TEXT NOT NULL,
    "icon" UUID,
    "order" SMALLINT NOT NULL,
    "quest_id" UUID NOT NULL,
    "creator_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_quest_task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_quest_task_completion" (
    "user_id" UUID NOT NULL,
    "task_id" UUID NOT NULL,
    "completed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_quest_task_completion_pkey" PRIMARY KEY ("user_id","task_id")
);

-- CreateTable
CREATE TABLE "user_quest_task_pinned" (
    "user_id" UUID NOT NULL,
    "task_id" UUID NOT NULL,
    "order" SMALLINT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_quest_task_pinned_pkey" PRIMARY KEY ("user_id","task_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_quest_completion_user_id_quest_id_key" ON "user_quest_completion"("user_id", "quest_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_quest_pinned_user_id_quest_id_key" ON "user_quest_pinned"("user_id", "quest_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_quest_task_completion_user_id_task_id_key" ON "user_quest_task_completion"("user_id", "task_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_quest_task_pinned_user_id_task_id_key" ON "user_quest_task_pinned"("user_id", "task_id");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_section" ADD CONSTRAINT "game_section_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_section" ADD CONSTRAINT "game_section_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_category" ADD CONSTRAINT "game_category_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "game_section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_category" ADD CONSTRAINT "game_category_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_quest" ADD CONSTRAINT "game_quest_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "game_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_quest" ADD CONSTRAINT "game_quest_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quest_completion" ADD CONSTRAINT "user_quest_completion_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quest_completion" ADD CONSTRAINT "user_quest_completion_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "game_quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quest_pinned" ADD CONSTRAINT "user_quest_pinned_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quest_pinned" ADD CONSTRAINT "user_quest_pinned_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "game_quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_quest_task" ADD CONSTRAINT "game_quest_task_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "game_quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_quest_task" ADD CONSTRAINT "game_quest_task_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quest_task_completion" ADD CONSTRAINT "user_quest_task_completion_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quest_task_completion" ADD CONSTRAINT "user_quest_task_completion_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "game_quest_task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quest_task_pinned" ADD CONSTRAINT "user_quest_task_pinned_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quest_task_pinned" ADD CONSTRAINT "user_quest_task_pinned_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "game_quest_task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
