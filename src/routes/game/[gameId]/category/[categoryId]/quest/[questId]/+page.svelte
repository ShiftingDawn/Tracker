<script lang="ts">
  import {enhance} from "$app/forms";
  import Button from "$lib/components/button.svelte";
  import Image from "$lib/components/image.svelte";
  import Section from "$lib/components/section.svelte";
  import Subtext from "$lib/components/subtext.svelte";
  import Toggleswitch from "$lib/components/toggleswitch.svelte";
  import {AddIcon, ChevronLeftIcon, DeleteIcon, EditIcon} from "$lib/icons";
  import type {PageProps} from "./$types";
  import TaskList from "./tasklist.svelte";

  const {data,}: PageProps = $props();
  const pinned = $derived(
    data.isLoggedIn
      ? data.tasks
        .filter((task) => task.pinnedTasks.length > 0)
        .sort((a, b) => a.pinnedTasks[0].order - b.pinnedTasks[0].order)
      : null
  );
  const incomplete = $derived(
    data.isLoggedIn
      ? data.tasks.filter((task) => task.completedTasks.length === 0)
      : data.tasks
  );
  const completed = $derived(
    data.isLoggedIn
      ? data.tasks.filter((task) => task.completedTasks.length > 0)
      : null
  );
</script>

<Section w="md">
  {#snippet actions()}
    <Button
      href={`/game/${data.game.id}/category/${data.category.id}`}
      variant="text"
      class="w-full"
    >
      <div class="text-[1.5rem]">
        <ChevronLeftIcon/>
      </div>
      {data.category.name}
    </Button>
  {/snippet}
  <div class="flex gap-4">
    {#if data.quest.icon}
      <Image size={128} src={`/img/${data.quest.icon}`} alt="quest logo"/>
    {/if}
    <div>
      <h1 class="text-xl font-bold">{data.quest.name}</h1>
      <p>{data.quest.description}</p>
      <Subtext>Added by {data.questCreator.username}</Subtext>
      {#if data.isLoggedIn}
        <div class="mt-2 flex gap-2">
          <form method="post" use:enhance action="?/togglepin">
            <Toggleswitch
              label="Pin"
              checked={data.quest.pinnedQuests.length > 0}
              name="pinned"
              onchange={(e) => e.currentTarget.closest("form")!.submit()}
            />
          </form>
          <form method="post" use:enhance action="?/togglecompletion">
            <Toggleswitch
              label="Complete"
              checked={Boolean(data.completionData)}
              name="completed"
              onchange={(e) => e.currentTarget.closest("form")!.submit()}
            />
          </form>
        </div>
      {/if}
    </div>
  </div>
  {#if data.isQuestOwner}
    <div class="mt-4 flex gap-2">
      <Button
        href={`/game/${data.game.id}/category/${data.category.id}/quest/${data.quest.id}/edit`}
      >
        <EditIcon/>
        Edit
      </Button>
      <Button
        variant="outline"
        href={`/game/${data.game.id}/category/${data.category.id}/quest/${data.quest.id}/delete`}
      >
        <DeleteIcon/>
        Delete
      </Button>
    </div>
  {/if}
</Section>

{#if pinned}
  <TaskList
    title="Pinned tasks"
    emptyLabel="No tasks have been pinned yet."
    gameId={data.game.id}
    categoryId={data.category.id}
    questId={data.quest.id}
    tasks={pinned}
    collapseStateId={`pnd${data.quest.id}`}
    initialCollapseState={data.collapseData?.pin}
    canPinTasks={data.isLoggedIn}
    isPinned={() => true}
  />
{/if}

{#snippet taskActions()}
  <Button
    href={`/game/${data.game.id}/category/${data.category.id}/quest/${data.quest.id}/task/create`}
  >
    <AddIcon/>
    Add new task
  </Button>
{/snippet}
<TaskList
  title="Tasks"
  emptyLabel="No tasks have been created yet."
  gameId={data.game.id}
  categoryId={data.category.id}
  questId={data.quest.id}
  tasks={incomplete}
  collapseStateId={`inc${data.quest.id}`}
  initialCollapseState={data.collapseData?.incomplete}
  actions={data.isQuestOwner ? taskActions : undefined}
  canPinTasks={data.isLoggedIn}
  isPinned={(taskId) => pinned?.findIndex((q) => q.id === taskId) !== -1}
/>
{#if completed}
  <TaskList
    title="Completed qutasksests"
    emptyLabel="No tasks have been completed yet."
    gameId={data.game.id}
    categoryId={data.category.id}
    questId={data.quest.id}
    tasks={completed}
    collapseStateId={`cmp${data.category.id}`}
    initialCollapseState={data.collapseData?.complete}
    canPinTasks={data.isLoggedIn}
    isPinned={(taskId) => pinned?.findIndex((q) => q.id === taskId) !== -1}
  />
{/if}
