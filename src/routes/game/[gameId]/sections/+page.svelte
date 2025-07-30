<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/componments/button.svelte";
  import Divider from "$lib/componments/divider.svelte";
  import Input from "$lib/componments/input.svelte";
  import Section from "$lib/componments/section.svelte";
  import type { PageProps } from "./$types";

  const { data, form }: PageProps = $props();
  const sections = $state<string[]>(
    data.game.sections.map((section) => section.id),
  );

  $effect(() => {
    if (form?.id && !sections.includes(form.id)) {
      sections.push(form.id);
    }
  });
  const moveUp = (id: string) => {
    const index = sections.indexOf(id);
    if (index === 0) return;
    const cur = sections[index - 1];
    sections[index - 1] = id;
    sections[index] = cur;
  };
  const moveDown = (id: string) => {
    const index = sections.indexOf(id);
    if (index === sections.length - 1) return;
    const cur = sections[index + 1];
    sections[index + 1] = id;
    sections[index] = cur;
  };
</script>

<Section w="md" title={`Edit sections for ${data.game.name}`}>
  {#snippet actions()}
    <form method="post" use:enhance action="?/save">
      {#each sections as sectionId, index (sectionId)}
        <input type="hidden" name="order" value={sectionId} />
      {/each}
      <Button type="submit">Save</Button>
    </form>
  {/snippet}
  <ol class="divide-y divide-primary">
    {#each sections as sectionId, index (sectionId)}
      <li>
        <div class="flex gap-2 py-1">
          <span class="w-full">
            {data.game.sections.find((s) => s.id === sectionId)!.name}
          </span>
          <Button onclick={() => moveUp(sectionId)} disabled={index === 0}>
            UP
          </Button>
          <Button
            onclick={() => moveDown(sectionId)}
            disabled={index === sections.length - 1}
          >
            DOWN
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
      <Button>Add</Button>
    </div>
  </form>
</Section>
