<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import Image from "$lib/components/image.svelte";
  import Section from "$lib/components/section.svelte";
  import Subtext from "$lib/components/subtext.svelte";
  import icons from "$lib/icons";
  import Icon from "@iconify/svelte";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();
</script>

<Section w="md">
  {#snippet actions()}
    <Button
      href={`/game/${data.game.id}/category/${data.category.id}`}
      variant="text"
      class="w-full"
    >
      <div class="text-[1.5rem]">
        <Icon icon={icons.chevronLeft} />
      </div>
      {data.category.name}
    </Button>
  {/snippet}
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
        <Icon icon={icons.edit} />
        Edit
      </Button>
      <Button
        variant="outline"
        href={`/game/${data.game.id}/category/${data.category.id}/quest/${data.quest.id}/delete`}
      >
        <Icon icon={icons.delete} />
        Delete
      </Button>
    </div>
  {/if}
</Section>
