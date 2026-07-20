<script lang="ts">
  import Listitem from "./listitem.svelte";

  const {game,}: {
    game: {
      id: string;
      name: string;
      icon: { id: string };
      sectionCount?: number;
      categoryCount?: number;
    };
  } = $props();
</script>

<Listitem
  title={game.name}
  image={game.icon ? { id: game.icon.id, alt: `${game.name} logo`, } : undefined}
  href={`/game/${game.id}`}
  text={[
    ...(game.sectionCount !== undefined
      ? [
        game.sectionCount +
        " " +
        (game.sectionCount === 1 ? "section" : "sections"),
      ]
      : []),
    ...(game.categoryCount !== undefined
      ? [
        game.categoryCount +
        " " +
        (game.categoryCount === 1 ? "category" : "categories"),
      ]
      : []),
  ]}
/>
