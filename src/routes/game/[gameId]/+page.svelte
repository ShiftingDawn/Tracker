<script lang="ts">
    import Section from "$lib/componments/section.svelte";
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props();
</script>

<Section w="md">
    <div class="flex gap-4">
        <img src={`/static/${data.game.icon}`} alt="game logo" />
        <div>
            <h1 class="text-xl font-bold">{data.game.name}</h1>
            <p>Added by {data.game.creator.username}</p>
        </div>
    </div>
</Section>
