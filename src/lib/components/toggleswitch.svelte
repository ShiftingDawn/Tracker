<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";
    import { twMerge } from "tailwind-merge";

    let {
        label,
        labelChecked,
        checked = $bindable(),
        ...props
    }: HTMLInputAttributes & {
        label: string;
        labelChecked?: string;
        checked: boolean;
    } = $props();
</script>

<div>
    <label
        class={twMerge(
            "block rounded-full px-4 py-1 font-bold border-2 text-center cursor-pointer",
            checked && "bg-success text-success-fg border-success-fg",
            !checked && "bg-error text-error-fg border-error-fg",
        )}
    >
        {#if checked}
            {labelChecked ?? label}
        {:else}
            {label}
        {/if}
        <input type="checkbox" bind:checked class="hidden" {...props} />
    </label>
</div>
