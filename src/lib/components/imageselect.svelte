<script lang="ts">

  import Input from "$lib/components/input.svelte";
  import type {ChangeEventHandler} from "svelte/elements";
  import Button from "./button.svelte";
  import {enhance} from "$app/forms";
  import Modal from "./modal.svelte";
  import type {ImageStore} from "$lib/server/db/schema";
  import {onMount} from "svelte";

  const {
    open,
    onclose,
    onselect,
    //
  }: {
    open: boolean,
    onclose: () => void,
    onselect: (id: string, name: string) => void,
    //
  } = $props();
  let fileSizeOk: boolean = $state(true);

  async function fetchImages() {
    const response = await fetch("/api/img/fetch");
    const json = await response.json();
    return json as ImageStore[];
  }

  let fetchImagePromise: Promise<ImageStore[]> | undefined = $state();
  onMount(() => fetchImagePromise = fetchImages());

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

<Modal title="Select image" {open} {onclose}>
  <div class="flex flex-col gap-4">
    <div class="max-w-md">
      <form method="post" use:enhance={({formElement,}) => () => {
        fetchImagePromise = fetchImages();
        formElement.reset();
      }} action="/api/img/upload" enctype="multipart/form-data">
        <Input
          description="Only png, jpg and jpeg, max 2mb. Images that are not 128x128 will be scaled accordingly."
          error={fileSizeOk ? undefined : "Image exceeds size limit."}
          name="image"
          type="file"
          accept="image/png,image/jpeg"
          required
          autocomplete="off"
          autocapitalize="off"
          class="px-0 py-0 file:bg-primary file:text-primary-fg file:rounded-lg file:px-2 file:py-1 hover:file:bg-primary/70 file:cursor-pointer"
          onchange={validateFile}
        />
        <Button type="submit">
          Upload
        </Button>
      </form>
    </div>
    <div class="flex gap-4 flex-wrap">
      {#await fetchImagePromise}
        <span>LOADING</span>
      {:then images}
        {#each images as image(image.id)}
          <button class="cursor-pointer" onclick={(e) => {
            e.preventDefault();
            onselect(image.id, image.fileName);
          }} type="button">
            <img class="w-32 aspect-square" src={`/img/${image.id}`} alt={image.fileName}/>
          </button>
        {/each}
      {/await}
    </div>
  </div>
</Modal>
