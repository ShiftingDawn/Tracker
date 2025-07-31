<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/components/button.svelte";
  import Divider from "$lib/components/divider.svelte";
  import AddIcon from "$lib/components/icons/add-icon.svelte";
  import ChevronDownIcon from "$lib/components/icons/chevron-down-icon.svelte";
  import ChevronUpIcon from "$lib/components/icons/chevron-up-icon.svelte";
  import DeleteIcon from "$lib/components/icons/delete-icon.svelte";
  import SaveIcon from "$lib/components/icons/save-icon.svelte";
  import Input from "$lib/components/input.svelte";
  import Section from "$lib/components/section.svelte";
  import type { PageProps } from "./$types";

  const { data, form }: PageProps = $props();
  const sections = $state<string[]>(
    data.game.sections.map((section) => section.id),
  );

  $effect(() => {
    if (form?.type === "add" && form.id && !sections.includes(form.id)) {
      sections.push(form.id);
    } else if (form?.type === "rem" && form.id && sections.includes(form.id)) {
      const index = sections.indexOf(form.id);
      sections.splice(index, 1);
    }
  });

  function moveUp(id: string) {
    const index = sections.indexOf(id);
    if (index === 0) return;
    const cur = sections[index - 1];
    sections[index - 1] = id;
    sections[index] = cur;
  }
  function moveDown(id: string) {
    const index = sections.indexOf(id);
    if (index === sections.length - 1) return;
    const cur = sections[index + 1];
    sections[index + 1] = id;
    sections[index] = cur;
  }
</script>

<Section w="md" title={`Edit sections for ${data.game.name}`}>
  {#snippet actions()}
    <form method="post" use:enhance action="?/save">
      {#each sections as sectionId (sectionId)}
        <input type="hidden" name="order" value={sectionId} />
      {/each}
      <Button type="submit">
        <SaveIcon />
        Save
      </Button>
    </form>
  {/snippet}
  <ol class="divide-y divide-primary">
    {#each sections as sectionId, index (sectionId)}
      {@const section = data.game.sections.find((s) => s.id === sectionId)!}
      <li>
        <div class="flex gap-2 py-1">
          <span class="w-full">
            {section.name} ({section.categories.length})
          </span>
          <form method="post" use:enhance action="?/removesection">
            <input type="hidden" name="id" value={sectionId} />
            <Button
              type="submit"
              disabled={section.categories.length > 0}
              variant="text"
            >
              <DeleteIcon />
            </Button>
          </form>
          <Button
            onclick={() => moveUp(sectionId)}
            disabled={index === 0}
            variant="text"
          >
            <ChevronUpIcon />
          </Button>
          <Button
            onclick={() => moveDown(sectionId)}
            disabled={index === sections.length - 1}
            variant="text"
          >
            <ChevronDownIcon />
          </Button>
        </div>
      </li>
    {/each}
  </ol>
  <Divider />
  <form
    class="mt-4 flex flex-row gap-2"
    method="post"
    use:enhance
    action="?/addsection"
  >
    <Input label="Add section" name="name" />
    <div class="flex items-end">
      <Button>
        <AddIcon />
        Add
      </Button>
    </div>
  </form>
</Section>
