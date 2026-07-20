<script lang="ts">
  import {enhance} from "$app/forms";
  import Button from "$lib/components/button.svelte";
  import Input from "$lib/components/input.svelte";
  import Section from "$lib/components/section.svelte";
  import Select from "$lib/components/select.svelte";
  import {SaveIcon} from "$lib/icons";
  import type {GameQuest} from "$lib/server/db";
  import FormImageSelect from "$lib/components/formimageselect.svelte";

  const {
    title,
    existing,
    selectedCategory,
    categories,
  }: {
    title: string;
    existing?: GameQuest & (null | { icon: { id: string, fileName: string } });
    selectedCategory?: string;
    categories: Record<string, string>;
  } = $props();
  let chosenImage = $state<[string, string,] | undefined>(
    existing?.icon
      ? [existing.icon.id, existing.icon.fileName,]
      : undefined
  );
</script>

<Section {title} w="md">
  <form
    method="post"
    enctype="multipart/form-data"
    use:enhance
    class="flex flex-col gap-2"
  >
    <Input
      label="Name"
      name="name"
      minlength={3}
      maxlength={64}
      required
      autocomplete="off"
      autocapitalize="off"
      defaultValue={existing?.name}
    />
    <Select label="Category" name="category">
      {#each Object.entries(categories) as category (category[0])}
        <option
          value={category[0]}
          selected={selectedCategory
            ? category[0] === selectedCategory
            : undefined}
        >
          {category[1]}
        </option>
      {/each}
    </Select>
    <Input
      label="Description"
      name="description"
      minlength={3}
      required
      autocomplete="off"
      autocapitalize="sentences"
      defaultValue={existing?.description}
    />
    <FormImageSelect title="Quest icon (optional)" chosen={chosenImage}
                     onselect={(id, name) => chosenImage = [id,name,]} required={!existing}/>
    <div class="mx-auto">
      <Button type="submit">
        <SaveIcon/>
        Submit
      </Button>
    </div>
  </form>
</Section>
