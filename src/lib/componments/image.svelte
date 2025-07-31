<script lang="ts">
    import type { HTMLImgAttributes } from "svelte/elements";
    import { twMerge } from "tailwind-merge";

    const {
        size,
        class: cls,
        ...props
    }: HTMLImgAttributes & { size: number; class?: string } = $props();
</script>

<div style={`max-width:${size}px;max-height:${size}px`} class="w-full h-full flex items-center justify-center">
    <img
        src={twMerge("w-full h-full overflow-hidden object-scale-down", cls)}
        {...props}
    />
</div>
