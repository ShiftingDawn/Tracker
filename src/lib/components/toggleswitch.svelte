<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";
  import { tv, type VariantProps } from "tailwind-variants";

  const toggleswitch = tv({
    base: "block rounded-full text-center cursor-pointer border-2",
    variants: {
      variant: {
        default: "px-4 py-1 font-bold",
        icon: "p-1",
      },
      checked: {
        true: "text-success-fg border-success-fg",
        false: "text-error-fg border-error-fg",
      },
    },
    compoundVariants: [
      { variant: "default", checked: true, class: "bg-success" },
      { variant: "default", checked: false, class: "bg-error" },
    ],
    defaultVariants: { variant: "default" },
  });

  let {
    variant,
    label,
    labelChecked,
    checked = $bindable(),
    ...props
  }: HTMLInputAttributes &
    Pick<VariantProps<typeof toggleswitch>, "variant"> & {
      label: string | Snippet;
      labelChecked?: string | Snippet;
      checked: boolean;
    } = $props();
  const checkedLabel = $derived(labelChecked ?? label);
</script>

<div>
  <label class={toggleswitch({ variant, checked })}>
    {#if checked}
      {#if typeof checkedLabel === "string"}
        {checkedLabel}
      {:else}
        {@render checkedLabel()}
      {/if}
    {:else if typeof label === "string"}
      {label}
    {:else}
      {@render label()}
    {/if}
    <input type="checkbox" bind:checked class="hidden" {...props} />
  </label>
</div>
