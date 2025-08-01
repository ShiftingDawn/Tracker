<script lang="ts">
  import Dot from "$lib/components/dot.svelte";
  import Subtext from "$lib/components/subtext.svelte";

  const {
    href,
    image,
    title,
    text,
  }: {
    href: string;
    image?: { id: string; alt: string };
    title: string;
    text?: string[];
  } = $props();
</script>

<a
  {href}
  class="flex flex-row gap-2 hover:bg-primary/20 transition-colors rounded-lg"
>
  <div class="w-[64px] h-[64px]">
    {#if image}
      <img
        src={`/img/${image.id}`}
        alt={image.alt}
        class="w-full h-full overflow-hidden object-scale-down"
      />
    {/if}
  </div>
  <div class="flex flex-col">
    <p class="font-bold">{title}</p>
    {#if text}
      {#each text as line, i (i)}
        <Subtext>
          <Dot />
          {line}
        </Subtext>
      {/each}
    {/if}
  </div>
</a>
