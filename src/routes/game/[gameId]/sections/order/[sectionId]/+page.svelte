<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/components/button.svelte";
  import Section from "$lib/components/section.svelte";
  import { ChevronDownIcon, ChevronUpIcon, SaveIcon } from "$lib/icons";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();
  const categories = $state<string[]>(
    data.section.categories.map((category) => category.id),
  );

  function moveUp(id: string) {
    const index = categories.indexOf(id);
    if (index === 0) return;
    const cur = categories[index - 1];
    categories[index - 1] = id;
    categories[index] = cur;
  }
  function moveDown(id: string) {
    const index = categories.indexOf(id);
    if (index === categories.length - 1) return;
    const cur = categories[index + 1];
    categories[index + 1] = id;
    categories[index] = cur;
  }
</script>

<Section w="md" title={`Edit category order: ${data.section.name}`}>
  {#snippet actions()}
    <form method="post" use:enhance>
      {#each categories as categoryId (categoryId)}
        <input type="hidden" name="order" value={categoryId} />
      {/each}
      <Button type="submit">
        <SaveIcon />
        Save
      </Button>
    </form>
  {/snippet}
  <ol class="divide-y divide-primary">
    {#each categories as categoryId, index (categoryId)}
      {@const category = data.section.categories.find(
        (s) => s.id === categoryId,
      )!}
      <li>
        <div class="flex gap-2 py-1">
          <span class="w-full">
            {category.name}
          </span>
          <Button
            onclick={() => moveUp(categoryId)}
            disabled={index === 0}
            variant="text"
          >
            <ChevronUpIcon />
          </Button>
          <Button
            onclick={() => moveDown(categoryId)}
            disabled={index === categories.length - 1}
            variant="text"
          >
            <ChevronDownIcon />
          </Button>
        </div>
      </li>
    {/each}
  </ol>
</Section>
