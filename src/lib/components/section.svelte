<script lang="ts">
  import { makeId } from "$lib/clientutil";
  import icons from "$lib/icons";
  import Icon from "@iconify/svelte";
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
    children,
  }: {
    title?: string;
    class?: string;
    actions?: Snippet;
    actionsNewLine?: boolean;
    collapseStateId?: string;
    children?: Snippet;
  } & VariantProps<typeof section> = $props();

  let collapsed = $state(false);

  function handleCollapse() {
    collapsed = !collapsed;
    const el = document.getElementById(collapseStateId!) as HTMLDivElement;
    if (!collapsed) {
      el.style.maxHeight = `${el.scrollHeight}px`;
      localStorage.removeItem(collapseStateId!);
    } else {
      el.style.maxHeight = "0px";
      localStorage.setItem(collapseStateId!, "true");
    }
  }

  onMount(() => {
    if (collapseStateId) {
      const el = document.getElementById(collapseStateId!) as HTMLDivElement;
      el.style.maxHeight = `${el.scrollHeight}px`;
      collapsed = !(collapseStateId in localStorage);
      handleCollapse();
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
          <Button variant="text" class="h-8" onclick={handleCollapse}>
            <Icon icon={collapsed ? icons.add : icons.minus} />
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
  <div class="transition-[max-height] overflow-hidden" id={collapseStateId}>
    <div class="rounded-2xl bg-surface-alt p-2 inset-shadow">
      {@render children?.()}
    </div>
  </div>
</div>
