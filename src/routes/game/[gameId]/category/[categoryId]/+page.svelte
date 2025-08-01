<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import Image from "$lib/components/image.svelte";
  import Section from "$lib/components/section.svelte";
  import Subtext from "$lib/components/subtext.svelte";
  import {
    AddIcon,
    ChevronLeftIcon,
    DeleteIcon,
    EditIcon,
    MenuIcon,
  } from "$lib/icons";
  import type { PageProps } from "./$types";
  import Questlist from "./questlist.svelte";

  const { data }: PageProps = $props();
  const pinned = $derived(
    data.isLoggedIn
      ? data.quests
          .filter((quest) => quest.pinnedQuests.length > 0)
          .sort((a, b) => a.pinnedQuests[0].order - b.pinnedQuests[0].order)
      : null,
  );
  const incomplete = $derived(
    data.isLoggedIn
      ? data.quests.filter((quest) => quest.completedQuests.length === 0)
      : data.quests,
  );
  const completed = $derived(
    data.isLoggedIn
      ? data.quests.filter((quest) => quest.completedQuests.length > 0)
      : null,
  );
</script>

<Section w="md">
  {#snippet actions()}
    <Button href={`/game/${data.game.id}`} variant="text" class="w-full">
      <div class="text-[1.5rem]">
        <ChevronLeftIcon />
      </div>
      {data.game.name}
    </Button>
  {/snippet}
  <div class="flex gap-4">
    <div class="w-[128px] h-[128px]">
      {#if data.category.icon}
        <Image size={128} src={`/img/${data.category.icon}`} alt="game logo" />
      {/if}
    </div>
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
      <Button href={`/game/${data.game.id}/category/${data.category.id}/order`}>
        <MenuIcon />
        Order
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

{#if pinned}
  <Questlist
    title="Pinned quests"
    emptyLabel="No quests have been pinned yet."
    gameId={data.game.id}
    categoryId={data.category.id}
    quests={pinned}
    collapseStateId={`pnd${data.category.id}`}
    initialCollapseState={data.collapseData?.pin}
    canPinQuests={data.isLoggedIn}
    isPinned={() => true}
  />
{/if}

{#snippet questActions()}
  <Button
    href={`/game/${data.game.id}/category/${data.category.id}/quest/create`}
  >
    <AddIcon />
    Add new quest
  </Button>
{/snippet}
<Questlist
  title="Quests"
  emptyLabel="No quests have been created yet."
  gameId={data.game.id}
  categoryId={data.category.id}
  quests={incomplete}
  collapseStateId={`inc${data.category.id}`}
  initialCollapseState={data.collapseData?.incomplete}
  actions={data.isCategoryOwner ? questActions : undefined}
  canPinQuests={data.isLoggedIn}
  isPinned={(questId) => pinned?.findIndex((q) => q.id === questId) !== -1}
/>
{#if completed}
  <Questlist
    title="Completed quests"
    emptyLabel="No quests have been completed yet."
    gameId={data.game.id}
    categoryId={data.category.id}
    quests={completed}
    collapseStateId={`cmp${data.category.id}`}
    initialCollapseState={data.collapseData?.complete}
    canPinQuests={data.isLoggedIn}
    isPinned={(questId) => pinned?.findIndex((q) => q.id === questId) !== -1}
  />
{/if}
