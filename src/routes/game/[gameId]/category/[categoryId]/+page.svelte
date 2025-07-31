<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import AddIcon from "$lib/components/icons/add-icon.svelte";
  import DeleteIcon from "$lib/components/icons/delete-icon.svelte";
  import EditIcon from "$lib/components/icons/edit-icon.svelte";
  import Image from "$lib/components/image.svelte";
  import Section from "$lib/components/section.svelte";
  import Subtext from "$lib/components/subtext.svelte";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();
</script>

<Section w="md">
  <div class="flex gap-4">
    {#if data.category.icon}
      <Image size={128} src={`/img/${data.category.icon}`} alt="game logo" />
    {/if}
    <div>
      <h1 class="text-xl font-bold">{data.category.name}</h1>
      <p>{data.category.description}</p>
      <Subtext>Added by {data.categoryCreator.username}</Subtext>
    </div>
  </div>
  {#if data.isCategoryOwner}
    <div class="mt-4 flex gap-2">
      <Button href={`/game/${data.game.id}/category/${data.category.id}/edit`}>
        <EditIcon />
        Edit
      </Button>
      <Button
        variant="outline"
        href={`/game/${data.game.id}/category/${data.category.id}/delete`}
      >
        <DeleteIcon />
        Delete
      </Button>
    </div>
  {/if}
</Section>

{#snippet questActions()}
  <Button
    href={`/game/${data.game.id}/category/${data.category.id}/quest/create`}
  >
    <AddIcon />
    Add new quest
  </Button>
{/snippet}
<Section
  title="Quests"
  w="md"
  class="mt-4"
  actions={data.isCategoryOwner ? questActions : undefined}
>
  {#if data.quests.length > 0}
    <ol>
      {#each data.quests as quest (quest.id)}
        <li>
          <a
            href={`/game/${data.game.id}/category/${data.category.id}/quest/${quest.id}`}
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
    <p>No quests have been created yet.</p>
  {/if}
</Section>
