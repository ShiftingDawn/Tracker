<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import Image from "$lib/components/image.svelte";
  import Section from "$lib/components/section.svelte";
  import Subtext from "$lib/components/subtext.svelte";
  import icons from "$lib/icons";
  import Icon from "@iconify/svelte";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();
</script>

<div class="flex flex-col gap-4">
  <Section w="md">
    <div class="flex gap-4">
      <Image size={128} src={`/img/${data.game.icon}`} alt="game logo" />
      <div>
        <h1 class="text-xl font-bold">{data.game.name}</h1>
        <Subtext>Added by {data.game.creator.username}</Subtext>
      </div>
    </div>
    {#if data.isGameOwner}
      <div class="mt-4 flex gap-2 flex-wrap">
        <Button href={`/game/${data.game.id}/edit`}>
          <Icon icon={icons.edit} />
          Edit game
        </Button>
        <Button href={`/game/${data.game.id}/sections`}>
          <Icon icon={icons.grid} />
          Edit sections
        </Button>
        <Button href={`/game/${data.game.id}/category/create`}>
          <Icon icon={icons.add} />
          Add category
        </Button>
      </div>
    {/if}
  </Section>
  <div class="flex justify-center gap-4 flex-wrap">
    {#each data.game.sections as section (section.id)}
      <Section title={section.name} w="md" class="m-0">
        {#snippet actions()}
          {#if section.creatorId === data.userId}
            <Button href={`/game/${data.game.id}/sections/order/${section.id}`}>
              <Icon icon={icons.menu} />
              Order
            </Button>
          {/if}
        {/snippet}
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
                      src={`/img/${category.icon}`}
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
              </li>
            {/each}
          </ol>
        {:else}
          <p>No categories have been created yet.</p>
        {/if}
      </Section>
    {/each}
  </div>
</div>
