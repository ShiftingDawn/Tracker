<script lang="ts">
  import Button from "$lib/componments/button.svelte";
  import DeleteIcon from "$lib/componments/icons/delete-icon.svelte";
  import EditIcon from "$lib/componments/icons/edit-icon.svelte";
  import Image from "$lib/componments/image.svelte";
  import Section from "$lib/componments/section.svelte";
  import Subtext from "$lib/componments/subtext.svelte";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();
</script>

<Section w="md">
  <div class="flex gap-4">
    {#if data.quest.icon}
      <Image size={128} src={`/img/${data.quest.icon}`} alt="quest logo" />
    {/if}
    <div>
      <h1 class="text-xl font-bold">{data.quest.name}</h1>
      <p>{data.quest.description}</p>
      <Subtext>Added by {data.questCreator.username}</Subtext>
    </div>
  </div>
  {#if data.isQuestOwner}
    <div class="mt-4 flex gap-2">
      <Button
        href={`/game/${data.game.id}/category/${data.category.id}/quest/${data.quest.id}/edit`}
      >
        <EditIcon />
        Edit
      </Button>
      <Button
        variant="outline"
        href={`/game/${data.game.id}/category/${data.category.id}/quest/${data.quest.id}/delete`}
      >
        <DeleteIcon />
        Delete
      </Button>
    </div>
  {/if}
</Section>
