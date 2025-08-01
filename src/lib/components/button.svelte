<script lang="ts">
  import type {
    HTMLAnchorAttributes,
    HTMLButtonAttributes,
  } from "svelte/elements";
  import { twMerge } from "tailwind-merge";
  import { tv, type VariantProps } from "tailwind-variants";

  const button = tv({
    base: "cursor-pointer transition-all px-4 py-1 data-disabled:shadow-none data-disabled:text-primary/50 data-disabled:cursor-not-allowed flex items-center justify-center gap-1 whitespace-nowrap",
    variants: {
      variant: {
        default:
          "bg-primary text-primary-fg rounded-full shadow-md hover:scale-102 active:scale-98 active:shadow-none data-disabled:bg-primary/10",
        outline:
          "border-2 border-primary rounded-full text-primary text-center hover:bg-primary/10 data-disabled:border-primary/50 data-disabled:bg-transparent",
        text: "text-primary font-bold hover:bg-primary-alt rounded-full data-disabled:bg-transparent data-disabled:text-black/50",
        icon: "p-0 text-primary *:w-[2em] *:h-[2em] hover:text-primary/75 disabled:text-primary/30 hover:scale-102",
      },
    },
    defaultVariants: { variant: "default" },
  });

  const {
    variant,
    children,
    class: cls,
    href,
    type = "button",
    disabled,
    ...props
  }: { href?: string } & VariantProps<typeof button> &
    HTMLButtonAttributes &
    HTMLAnchorAttributes & { class?: string } = $props();
</script>

{#if href}
  <a
    href={disabled ? undefined : href}
    class={twMerge(button({ variant }), cls)}
    aria-disabled={disabled || undefined}
    role={disabled ? "link" : undefined}
    tabindex={disabled ? -1 : undefined}
    {...props}
    data-disabled={disabled || undefined}
  >
    {@render children?.()}
  </a>
{:else}
  <button
    class={twMerge(button({ variant }), cls)}
    {disabled}
    data-disabled={disabled || undefined}
    {...props}
  >
    {@render children?.()}
  </button>
{/if}
