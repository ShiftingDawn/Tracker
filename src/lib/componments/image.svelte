<script lang="ts">
    import type { HTMLImgAttributes } from "svelte/elements";
    import { twMerge } from "tailwind-merge";

    const {
        size,
        class: cls,
        ...props
    }: HTMLImgAttributes & { size: number; class?: string } = $props();
</script>

<div style={`width:${size}px;height:${size}px`} class="flex items-center justify-center">
    <img
        src={twMerge("w-full h-full overflow-hidden object-scale-down", cls)}
        {...props}
    />
</div>
