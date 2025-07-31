<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/componments/button.svelte";
  import SaveIcon from "$lib/componments/icons/save-icon.svelte";
  import Input from "$lib/componments/input.svelte";
  import Section from "$lib/componments/section.svelte";
  import Select from "$lib/componments/select.svelte";
  import type { GameQuest } from "$lib/server/db/schema";
  import type { ChangeEventHandler } from "svelte/elements";

  let fileSizeOk: boolean = $state(true);

  const validateFile: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.currentTarget.files || e.currentTarget.files.length !== 1) return;
    if (e.currentTarget.files[0].size > 2097152) {
      e.currentTarget.setCustomValidity("File too large.");
      fileSizeOk = false;
    } else {
      fileSizeOk = true;
    }
  };

  const {
    title,
    existing,
    selectedCategory,
    categories,
  }: {
    title: string;
    existing?: GameQuest;
    selectedCategory?: string;
    categories: Record<string, string>;
  } = $props();
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
    <Input
      label="Category icon (optional)"
      description="Only png, jpg, jpeg and webp max 2mb. Images that are not 128x128 will be scaled accordingly."
      error={fileSizeOk ? undefined : "Image exceeds size limit."}
      name="icon"
      type="file"
      accept="image/png,image/jpeg,image/webp"
      autocomplete="off"
      autocapitalize="off"
      class="px-0 py-0 file:bg-primary file:text-primary-fg file:rounded-lg file:px-2 file:py-1 hover:file:bg-primary/70 file:cursor-pointer"
      onchange={validateFile}
    />
    <div class="mx-auto">
      <Button type="submit">
        <SaveIcon />
        Submit
      </Button>
    </div>
  </form>
</Section>
