<script lang="ts">
  import Categoryform from "$lib/shared/categoryform.svelte";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();
</script>

<Categoryform
  title={`Add category to ${data.game.name}`}
  sections={Object.fromEntries(
    Object.entries(data.sections).map(([k, v]) => [v.id, v.name]),
  )}
/>
