<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/componments/button.svelte";
  import Input from "$lib/componments/input.svelte";
  import Section from "$lib/componments/section.svelte";
  import type { ChangeEventHandler } from "svelte/elements";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();

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
</script>

<Section title={`Add category to ${data.game.name}`} w="md">
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
    />
    <Input
      label="Description"
      name="description"
      minlength={3}
      maxlength={255}
      required
      autocomplete="off"
      autocapitalize="sentences"
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
    <div class="text-center">
      <Button type="submit">Submit</Button>
    </div>
  </form>
</Section>
