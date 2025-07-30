<script lang="ts">
  import { makeId } from "$lib/clientutil";
  import type { HTMLSelectAttributes } from "svelte/elements";
  import { twMerge } from "tailwind-merge";

  let {
    label,
    description,
    error,
    id: realId,
    value = $bindable(),
    class: cls,
    children,
    ...props
  }: HTMLSelectAttributes & {
    label: string | false;
    description?: string;
    error?: string | true;
    class?: string;
  } = $props();

  const id: string = $derived(makeId(realId));
</script>

<label class="w-full flex flex-col gap-1.5">
  {label}
  <select
    bind:value
    {id}
    aria-invalid={error === undefined ? undefined : Boolean(error)}
    aria-errormessage={error ? `${id}emsg` : undefined}
    class={twMerge("bg-primary/20 px-2 py-1 rounded-lg", cls)}
    {...props}
  >
    {@render children?.()}
  </select>
  {#if description}
    <span class="ml-2 text-black/70">{description}</span>
  {/if}
  {#if typeof error === "string"}
    <span id={`${id}emsg`} class="text-error-fg">{error}</span>
  {/if}
</label>
