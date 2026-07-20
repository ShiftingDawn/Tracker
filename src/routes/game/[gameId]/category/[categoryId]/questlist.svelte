<script lang="ts">
  import {enhance} from "$app/forms";
  import IconImage from "$lib/components/iconimage.svelte";
  import Section from "$lib/components/section.svelte";
  import Subtext from "$lib/components/subtext.svelte";
  import Toggleswitch from "$lib/components/toggleswitch.svelte";
  import {PinIcon} from "$lib/icons";
  import type {Snippet} from "svelte";
  import type {GameQuest} from "$lib/server/db";

  const {
    title,
    emptyLabel,
    quests,
    gameId,
    categoryId,
    collapseStateId,
    initialCollapseState,
    canPinQuests,
    isPinned,
    actions,
  }: {
    title: string;
    emptyLabel: string;
    quests: (GameQuest & { creator: { username: string } })[];
    gameId: string;
    categoryId: string;
    collapseStateId: string;
    initialCollapseState?: boolean;
    canPinQuests: boolean;
    isPinned?: (questId: string) => boolean;
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
  {#if quests.length > 0}
    <ol>
      {#each quests as quest (quest.id)}
        <li
          class="flex flex-row gap-2 hover:bg-primary/20 transition-colors rounded-lg"
        >
          <a
            href={`/game/${gameId}/category/${categoryId}/quest/${quest.id}`}
            class="w-full flex flex-row gap-2"
          >
            {#if quest.iconId}
              <IconImage size={64} id={quest.iconId} alt={`${quest.name} quest icon`}/>
            {:else}
              <div class="h-[64px]" aria-hidden="true"></div>
            {/if}
            <div class="flex flex-col w-full">
              <p class="font-bold">{quest.name}</p>
              <p>{quest.description}</p>
              <Subtext>Added by {quest.creator.username}</Subtext>
            </div>
          </a>
          {#if canPinQuests && isPinned}
            <div class="p-2 flex items-center justify-center">
              <form method="post" use:enhance action="?/togglepin">
                <input type="hidden" name="quest" value={quest.id}/>
                <Toggleswitch
                  variant="icon"
                  checked={isPinned(quest.id)}
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
