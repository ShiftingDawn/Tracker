<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/components/button.svelte";
  import Image from "$lib/components/image.svelte";
  import Section from "$lib/components/section.svelte";
  import Subtext from "$lib/components/subtext.svelte";
  import Toggleswitch from "$lib/components/toggleswitch.svelte";
  import { ChevronLeftIcon, DeleteIcon, EditIcon } from "$lib/icons";
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
        <ChevronLeftIcon />
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
      {#if data.isLoggedIn}
        <div class="mt-2 flex gap-2">
          <form method="post" use:enhance action="?/togglepin">
            <Toggleswitch
              label="Pin"
              checked={data.quest.pinnedQuests.length > 0}
              name="pinned"
              onchange={(e) => e.currentTarget.closest("form")!.submit()}
            />
          </form>
          <form method="post" use:enhance action="?/togglecompletion">
            <Toggleswitch
              label="Complete"
              checked={Boolean(data.completionData)}
              name="completed"
              onchange={(e) => e.currentTarget.closest("form")!.submit()}
            />
          </form>
        </div>
      {/if}
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
