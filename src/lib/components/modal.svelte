<script lang="ts">
  import type {Snippet} from "svelte";
  import {fade} from "svelte/transition";
  import {twMerge} from "tailwind-merge";

  const {
    open,
    onclose,
    canclose,
    title,
    children,
    actions,
  }: {
    open: boolean,
    onclose: () => void,
    canclose?: boolean,
    title?: string,
    children: Snippet,
    actions?: Snippet
  } = $props();
</script>

<div class={twMerge(
  "fixed z-50 top-0 left-0 right-0 bottom-0 pointer-events-none flex items-end pb-16 md:pb-0 md:items-center lg:items-start lg:pt-16 justify-center backdrop-blur-none transition-all",
  open && "pointer-events-auto"
)}>
  {#if open}
    <button type="button" aria-label="Close dialog" onclick={onclose}
            class="absolute inset-0 backdrop-blur-xs"
            disabled={canclose === false}
    ></button>
    <div in:fade={{duration: 150,}} out:fade={{duration: 150,}}
         class="relative min-w-xs bg-white min-[28rem]:rounded-2xl shadow-lg flex flex-col gap-2"
    >
      {#if title}
        <div class="text-xl font-bold uppercase bg-primary text-primary-fg p-4 min-[28rem]:rounded-t-2xl shadow-lg">
          {title}
        </div>
      {/if}
      <div class="p-4">
        {@render children()}
      </div>
      {#if actions}
        <div class="flex items-center gap-2 justify-end p-4 rounded-b-lg">
          {@render actions()}
        </div>
      {/if}
    </div>
  {/if}
</div>
