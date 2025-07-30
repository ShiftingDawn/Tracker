<script lang="ts">
  import Button from "$lib/componments/button.svelte";
  import Image from "$lib/componments/image.svelte";
  import Section from "$lib/componments/section.svelte";
  import Subtext from "$lib/componments/subtext.svelte";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();
</script>

<div class="flex flex-col gap-4">
  <Section w="md" title={data.game.name}>
    <div class="flex gap-4">
      <Image size={128} src={`/static/${data.game.icon}`} alt="game logo" />
      <div>
        <Subtext>Added by {data.game.creator.username}</Subtext>
      </div>
    </div>
    {#if data.isOwner}
      <div class="mt-4">
        <Button href={`/game/${data.game.id}/edit`}>Edit game</Button>
        <Button href={`/game/${data.game.id}/sections`}>Edit sections</Button>
        <Button href={`/game/${data.game.id}/category/create`}>Add category</Button>
      </div>
    {/if}
  </Section>
  {#each data.game.sections as section (section.id)}
    <Section title={section.name} w="md">
      {#if section.categories.length > 0}
        <ol>
          {#each section.categories as category (category.id)}
            <li>
              <a
                href={`/game/${data.game.id}/category/${category.id}`}
                class="flex flex-row gap-2 hover:bg-primary/20 transition-colors rounded-lg"
              >
                {#if category.icon}
                  <Image
                    size={64}
                    src={`/static/${category.icon}`}
                    alt={`${category.name} category icon`}
                  />
                {:else}
                  <div class="h-[64px]" aria-hidden="true"></div>
                {/if}
                <div class="flex flex-col">
                  <p class="font-bold">{category.name}</p>
                  {#if category.description}
                    <p>{category.description}</p>
                  {/if}
                  <Subtext>Added by {category.creator.username}</Subtext>
                </div>
              </a>
            </li>{/each}
        </ol>
      {/if}
    </Section>
  {/each}
</div>
