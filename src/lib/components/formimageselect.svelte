<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import Imageselect from "$lib/components/imageselect.svelte";

  const {
    chosen,
    onselect,
    required,
    title,
    name,
  }: {
    chosen: [string, string,] | undefined,
    onselect: (id: string, name: string) => void,
    required?: boolean,
    title: string,
    name?: string,
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
        <img class="w-32 aspect-square" src={`/img/${chosen[0]}`} alt={chosen[1]}/>
      {/if}
    </div>
    <div>
      <Button type="button" onclick={(e) => {
        e.preventDefault();
        imageModalOpen = true;
      }}>
        Select
      </Button>
    </div>
  </div>
  <Imageselect open={imageModalOpen} onclose={() => imageModalOpen = false} onselect={handleSelect}/>
  <input {required} type="hidden" name={name ?? "icon"} value={chosen ? chosen[0] : undefined}/>
</div>
