<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";
    import { twMerge } from "tailwind-merge";

    let {
        labelChecked,
        labelUnchecked,
        checked = $bindable(),
        ...props
    }: HTMLInputAttributes & {
        labelChecked: string;
        labelUnchecked: string;
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
            {labelChecked}
        {:else}
            {labelUnchecked}
        {/if}
        <input type="checkbox" bind:checked class="hidden" {...props} />
    </label>
</div>
