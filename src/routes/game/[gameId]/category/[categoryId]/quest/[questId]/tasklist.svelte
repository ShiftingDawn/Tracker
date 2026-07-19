<script lang="ts">
  import {enhance} from "$app/forms";
  import Image from "$lib/components/image.svelte";
  import Section from "$lib/components/section.svelte";
  import Subtext from "$lib/components/subtext.svelte";
  import Toggleswitch from "$lib/components/toggleswitch.svelte";
  import {PinIcon} from "$lib/icons";
  import type {GameQuestTask} from "$lib/server/db/schema";
  import type {Snippet} from "svelte";

  const {
    title,
    emptyLabel,
    tasks,
    gameId,
    categoryId,
    questId,
    collapseStateId,
    initialCollapseState,
    canPinTasks,
    isPinned,
    actions,
  }: {
    title: string;
    emptyLabel: string;
    tasks: (GameQuestTask & { creator: { username: string } })[];
    gameId: string;
    categoryId: string;
    questId: string;
    collapseStateId: string;
    initialCollapseState?: boolean;
    canPinTasks: boolean;
    isPinned?: (taskId: string) => boolean;
    actions?: Snippet;
  } = $props();
</script>

<Section
  {title}
  w="md"
  class="mt-4"
  {actions}
  {collapseStateId}
  {initialCollapseState}
>
  {#if tasks.length > 0}
    <ol>
      {#each tasks as task (task.id)}
        <li class="flex flex-row gap-2 hover:bg-primary/20 transition-colors rounded-lg">
          <a
            href={`/game/${gameId}/category/${categoryId}/quest/${questId}/task/${task.id}`}
            class="w-full flex flex-row gap-2"
          >
            {#if task.icon}
              <Image
                size={64}
                src={`/img/${task.icon}`}
                alt={`${task.name} task icon`}
              />
            {:else}
              <div class="h-[64px]" aria-hidden="true"></div>
            {/if}
            <div class="flex flex-col w-full">
              <p class="font-bold">{task.name}</p>
              <p>{task.description}</p>
              <Subtext>Added by {task.creator.username}</Subtext>
            </div>
          </a>
          {#if canPinTasks && isPinned}
            <div class="p-2 flex items-center justify-center">
              <form method="post" use:enhance action="?/toggletaskpin">
                <input type="hidden" name="task" value={task.id}/>
                <Toggleswitch
                  variant="icon"
                  checked={isPinned(task.id)}
                  name="pinned"
                  onchange={(e) => e.currentTarget.closest("form")!.submit()}
                >
                  {#snippet label()}
                    <PinIcon/>
                  {/snippet}
                </Toggleswitch>
              </form>
            </div>
          {/if}
        </li>
      {/each}
    </ol>
  {:else}
    <p>{emptyLabel}</p>
  {/if}
</Section>
