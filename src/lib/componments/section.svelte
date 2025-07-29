<script lang="ts">
  import type { Snippet } from "svelte";
  import { twMerge } from "tailwind-merge";
  import { tv, type VariantProps } from "tailwind-variants";

  const section = tv({
    base: "mx-auto rounded-2xl shadow-lg bg-white p-2 w-full",
    variants: {
      w: {
        xs: "max-w-xs",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
      },
    },
  });
  const {
    title,
    w,
    class: cls,
    actions,
    actionsNewLine,
    children,
  }: {
    title?: string;
    class?: string;
    actions?: Snippet;
    actionsNewLine?: boolean;
    children?: Snippet;
  } & VariantProps<typeof section> = $props();
</script>

<div class={twMerge(section({ w }), cls)}>
  {#if title || actions}
    <div
      class={twMerge(
        "flex flex-row flex-wrap items-center gap-2",
        actionsNewLine && "flex-col",
      )}
    >
      {#if title}
        <div
          class="text-nowrap rounded-2xl bg-primary flex-1 px-2 py-1 text-center font-bold text-primary-fg w-full"
        >
          {title}
        </div>
      {/if}
      {@render actions?.()}
    </div>
  {/if}
  <div class="rounded-2xl bg-surface-alt p-2 inset-shadow">
    {@render children?.()}
  </div>
</div>
