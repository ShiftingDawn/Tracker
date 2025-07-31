<script lang="ts">
  import Image from "$lib/components/image.svelte";
  import Section from "$lib/components/section.svelte";
  import Subtext from "$lib/components/subtext.svelte";
  import type { GameQuest } from "$lib/server/db/schema";
  import type { Snippet } from "svelte";

  const {
    title,
    emptyLabel,
    quests,
    gameId,
    categoryId,
    actions,
  }: {
    title: string;
    emptyLabel: string;
    quests: (GameQuest & { creator: { username: string } })[];
    gameId: string;
    categoryId: string;
    actions?: Snippet;
  } = $props();
</script>

<Section {title} w="md" class="mt-4" {actions}>
  {#if quests.length > 0}
    <ol>
      {#each quests as quest (quest.id)}
        <li>
          <a
            href={`/game/${gameId}/category/${categoryId}/quest/${quest.id}`}
            class="flex flex-row gap-2 hover:bg-primary/20 transition-colors rounded-lg"
          >
            {#if quest.icon}
              <Image
                size={64}
                src={`/img/${quest.icon}`}
                alt={`${quest.name} quest icon`}
              />
            {:else}
              <div class="h-[64px]" aria-hidden="true"></div>
            {/if}
            <div class="flex flex-col">
              <p class="font-bold">{quest.name}</p>
              <p>{quest.description}</p>
              <Subtext>Added by {quest.creator.username}</Subtext>
            </div>
          </a>
        </li>
      {/each}
    </ol>
  {:else}
    <p>{emptyLabel}</p>
  {/if}
</Section>
