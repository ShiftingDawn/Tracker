<script lang="ts">
  import {enhance} from "$app/forms";
  import Button from "$lib/components/button.svelte";
  import Section from "$lib/components/section.svelte";
  import {ChevronDownIcon, ChevronUpIcon, SaveIcon} from "$lib/icons";
  import type {PageProps} from "./$types";

  const {data,}: PageProps = $props();
  const quests = $state<string[]>(
    data.category.quests.map((quest) => quest.id)
  );

  function moveUp(id: string) {
    const index = quests.indexOf(id);
    if (index === 0) return;
    const cur = quests[index - 1];
    quests[index - 1] = id;
    quests[index] = cur;
  }

  function moveDown(id: string) {
    const index = quests.indexOf(id);
    if (index === quests.length - 1) return;
    const cur = quests[index + 1];
    quests[index + 1] = id;
    quests[index] = cur;
  }
</script>

<Section w="md" title={`Edit quest order: ${data.category.name}`}>
  {#snippet actions()}
    <form method="post" use:enhance>
      {#each quests as questId (questId)}
        <input type="hidden" name="order" value={questId}/>
      {/each}
      <Button type="submit">
        <SaveIcon/>
        Save
      </Button>
    </form>
  {/snippet}
  <ol class="divide-y divide-primary">
    {#each quests as questId, index (questId)}
      {@const quest = data.category.quests.find((s) => s.id === questId)!}
      <li>
        <div class="flex gap-2 py-1">
          <span class="w-full">
            {quest.name}
          </span>
          <Button
            onclick={() => moveUp(questId)}
            disabled={index === 0}
            variant="text"
          >
            <ChevronUpIcon/>
          </Button>
          <Button
            onclick={() => moveDown(questId)}
            disabled={index === quests.length - 1}
            variant="text"
          >
            <ChevronDownIcon/>
          </Button>
        </div>
      </li>
    {/each}
  </ol>
</Section>
