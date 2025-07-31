<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/components/button.svelte";
  import Input from "$lib/components/input.svelte";
  import Section from "$lib/components/section.svelte";
  import icons from "$lib/icons";
  import type { Game } from "$lib/server/db/schema";
  import Icon from "@iconify/svelte";
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
  }: {
    title: string;
    existing?: Game;
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
      label="Game icon"
      description="Only png, jpg and jpeg, max 2mb. Images that are not 128x128 will be scaled accordingly."
      error={fileSizeOk ? undefined : "Image exceeds size limit."}
      name="icon"
      type="file"
      accept="image/png,image/jpeg"
      required={!existing}
      autocomplete="off"
      autocapitalize="off"
      class="px-0 py-0 file:bg-primary file:text-primary-fg file:rounded-lg file:px-2 file:py-1 hover:file:bg-primary/70 file:cursor-pointer"
      onchange={validateFile}
    />
    <div class="mx-auto">
      <Button type="submit">
        <Icon icon={icons.save} />
        Submit
      </Button>
    </div>
  </form>
</Section>
