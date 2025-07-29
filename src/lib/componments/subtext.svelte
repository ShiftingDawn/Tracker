<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";
    import { twMerge } from "tailwind-merge";

    const {
        children,
        class: cls,
        ...props
    }: HTMLAttributes<HTMLSpanElement> & { class?: string } = $props();
</script>

<span class={twMerge("text-black/70", cls)} {...props}>
    {@render children?.()}
</span>
