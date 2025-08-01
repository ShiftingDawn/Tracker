<script lang="ts">
  import Section from "$lib/components/section.svelte";
  import Gamelistitem from "$lib/shared/gamelistitem.svelte";
  import Listitem from "$lib/shared/listitem.svelte";

  const { data } = $props();
</script>

<div class="flex flex-col gap-4">
  <Section title="Profile settings" w="md"></Section>
  <Section
    title="My games"
    w="md"
    collapseStateId="profile.owngames"
    initialCollapseState={data.collapseData.ownGames}
  >
    <ul>
      {#each data.games as game (game.id)}
        <li>
          <Gamelistitem {game} />
        </li>
      {/each}
    </ul>
  </Section>
  <Section
    title="Contributed quest categories"
    w="md"
    collapseStateId="profile.contribcategories"
    initialCollapseState={data.collapseData.contribCategories}
  >
    <ul>
      {#if data.contribCategories.length > 0}
        {#each data.contribCategories as category (category.id)}
          <li>
            <Listitem
              title={category.name}
              image={category.icon
                ? { id: category.icon, alt: `${category.name} category icon` }
                : undefined}
              href={`/game/${category.gameId}/category/${category.id}`}
              text={[category.gameName]}
            />
          </li>
        {/each}
      {:else}
        <p>No contributions yet.</p>
      {/if}
    </ul>
  </Section>
  <Section
    title="Contributed quests"
    w="md"
    collapseStateId="profile.contribquests"
    initialCollapseState={data.collapseData.contribQuests}
  >
    <ul>
      {#if data.contribQuests.length > 0}
        {#each data.contribQuests as quest (quest.id)}
          <li>
            <Listitem
              title={quest.name}
              image={quest.icon
                ? { id: quest.icon, alt: `${quest.name} quest icon` }
                : undefined}
              href={`/game/${quest.gameId}/category/${quest.categoryId}/quest/${quest.id}`}
              text={[quest.gameName, quest.categoryName]}
            />
          </li>
        {/each}
      {:else}
        <p>No contributions yet.</p>
      {/if}
    </ul>
  </Section>
</div>
