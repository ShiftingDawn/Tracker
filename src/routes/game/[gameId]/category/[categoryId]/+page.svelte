<script lang="ts">
  import Button from "$lib/componments/button.svelte";
  import Image from "$lib/componments/image.svelte";
  import Section from "$lib/componments/section.svelte";
  import Subtext from "$lib/componments/subtext.svelte";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();
</script>

<Section w="md">
  {#snippet actions()}
    <Button href={`/game/${data.game.id}`} variant="text">
      Back to {data.game.name}
    </Button>
    {#if data.isOwner}
      <Button href={`/game/${data.game.id}/category/${data.category.id}/edit`}>
        Edit
      </Button>
    {/if}
  {/snippet}
  <div class="flex gap-4">
    {#if data.category.icon}
      <Image size={128} src={`/static/${data.category.icon}`} alt="game logo" />
    {/if}
    <div>
      <h1 class="text-xl font-bold">{data.category.name}</h1>
      <p>{data.category.description}</p>
      <Subtext>Added by {data.creator.username}</Subtext>
    </div>
  </div>
</Section>
