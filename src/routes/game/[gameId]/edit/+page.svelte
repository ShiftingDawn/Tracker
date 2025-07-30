<script lang="ts">
  import Gameform from "$lib/shared/gameform.svelte";

  const { data } = $props();
</script>

<Gameform title={`Edit ${data.game.name}`} existing={data.game} />
