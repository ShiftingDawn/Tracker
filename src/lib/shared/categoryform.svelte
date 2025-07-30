<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/componments/button.svelte";
  import Input from "$lib/componments/input.svelte";
  import Section from "$lib/componments/section.svelte";
  import Select from "$lib/componments/select.svelte";
  import type { GameBoardCategory } from "$lib/server/db/schema";
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
    sections,
  }: {
    title: string;
    existing?: GameBoardCategory;
    sections: Record<string, string>;
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
    <Input
      label="Description (optional)"
      name="description"
      maxlength={255}
      autocomplete="off"
      autocapitalize="sentences"
      defaultValue={existing?.description ?? ""}
    />
    <Input
      label="Category icon (optional)"
      description="Only png, jpg and jpeg, max 2mb. Images that are not 128x128 will be scaled accordingly."
      error={fileSizeOk ? undefined : "Image exceeds size limit."}
      name="icon"
      type="file"
      accept="image/png,image/jpeg"
      autocomplete="off"
      autocapitalize="off"
      class="px-0 py-0 file:bg-primary file:text-primary-fg file:rounded-lg file:px-2 file:py-1 hover:file:bg-primary/70 file:cursor-pointer"
      onchange={validateFile}
    />
    <Select label="Section" name="section">
      {#each Object.entries(sections) as section (section[0])}
        <option
          value={section[0]}
          selected={existing && section[0] === existing.sectionId}
        >
          {section[1]}
        </option>
      {/each}
    </Select>
    <div class="text-center">
      <Button type="submit">Submit</Button>
    </div>
  </form>
</Section>
