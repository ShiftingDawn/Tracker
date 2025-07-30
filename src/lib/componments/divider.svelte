<script lang="ts">
  import type { Snippet } from "svelte";
  import { twMerge } from "tailwind-merge";

  let props: { class?: string; children?: Snippet } = $props();
</script>

<div
  role="separator"
  class={twMerge(
    "flex before:w-full before:self-center before:border-b before:border-primary after:w-full after:self-center after:border-b after:border-primary",
    props.class
  )}
>
  <div class="rounded-2xl bg-primary px-2 text-nowrap text-primary-fg">
    {@render props.children?.()}
  </div>
</div>
