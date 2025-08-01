<script lang="ts">
  import { api } from "$lib/api";
  import { AddIcon, MinusIcon } from "$lib/icons";
  import { onMount, type Snippet } from "svelte";
  import { twMerge } from "tailwind-merge";
  import { tv, type VariantProps } from "tailwind-variants";
  import Button from "./button.svelte";

  const section = tv({
    base: "mx-auto min-[28rem]:rounded-2xl shadow-lg bg-white p-2 w-full",
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
    collapseStateId,
    initialCollapseState,
    children,
  }: {
    title?: string;
    class?: string;
    actions?: Snippet;
    actionsNewLine?: boolean;
    collapseStateId?: string;
    initialCollapseState?: boolean;
    children?: Snippet;
  } & VariantProps<typeof section> = $props();

  let collapsed = $state(initialCollapseState ?? false);

  function handleCollapse(applyOnly?: boolean) {
    if (!applyOnly) collapsed = !collapsed;
    const el = document.getElementById(collapseStateId!) as HTMLDivElement;
    if (!collapsed) {
      el.style.maxHeight = `${el.scrollHeight}px`;
    } else {
      el.style.maxHeight = "0px";
    }
    api.post("/config/section", { id: collapseStateId!, collapsed });
  }

  onMount(() => {
    if (collapseStateId) {
      const el = document.getElementById(collapseStateId!) as HTMLDivElement;
      el.style.maxHeight = `${el.scrollHeight}px`;
      handleCollapse(true);
    }
  });
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
        {#if collapseStateId}
          <Button variant="text" class="h-8" onclick={() => handleCollapse()}>
            {#if collapsed}
              <AddIcon />
            {:else}
              <MinusIcon />
            {/if}
          </Button>
        {/if}
        <div
          class="text-nowrap rounded-2xl bg-primary flex-1 px-2 py-1 text-center font-bold text-primary-fg w-full"
        >
          {title}
        </div>
      {/if}
      {#if actions && (!collapseStateId || !collapsed)}
        <div class={twMerge("flex flex-row gap-2", !title && "w-full")}>
          {@render actions()}
        </div>
      {/if}
    </div>
  {/if}
  <div
    class={twMerge(
      "transition-[max-height] overflow-hidden",
      collapsed && "max-h-0",
    )}
    id={collapseStateId}
  >
    <div class="p-2">
      {@render children?.()}
    </div>
  </div>
</div>
