<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import Imageselect from "$lib/components/imageselect.svelte";
  import IconImage from "$lib/components/iconimage.svelte";

  const {
    chosen,
    onselect,
    onclear,
    required,
    title,
    name,
  }: {
    chosen: [string, string,] | undefined,
    onselect: (id: string, name: string) => void,
    onclear: () => void;
    title: string,
    name?: string,
    required?: boolean,
  } = $props();
  let imageModalOpen = $state(false);

  function handleSelect(id: string, name: string) {
    imageModalOpen = false;
    onselect(id, name);
  }
</script>

<div class="flex flex-col gap-4 justify-center">
  <span>{title}</span>
  <div class="flex gap-2 items-center">
    <div class="w-32 h-32 bg-primary-alt rounded-md shadow-md">
      {#if chosen}
        <IconImage id={chosen[0]} alt={chosen[1]}/>
      {/if}
    </div>
    <div class="flex flex-row gap-2">
      <Button type="button" onclick={(e) => {
        e.preventDefault();
        imageModalOpen = true;
      }}>
        Select
      </Button>
      {#if !required }
        <Button type="button" onclick={(e) => {
          e.preventDefault();
          onclear();
        }}>
          Clear
        </Button>
      {/if}
    </div>
  </div>
  <Imageselect open={imageModalOpen} onclose={() => imageModalOpen = false} onselect={handleSelect}/>
  <input {required} type="hidden" name={name ?? "icon"} value={chosen ? chosen[0] : undefined}/>
</div>
