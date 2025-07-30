<script lang="ts">
  import Section from "$lib/componments/section.svelte";
  import Subtext from "$lib/componments/subtext.svelte";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();
</script>

<div class="flex flex-col gap-4">
  <Section title="Welcome to Tracker!" w="md">
    <p>Tracker is a customizable progress tracker, scoreboard and more!</p>
    {#if data.isLoggedIn}
      <p class="mt-4">
        Welcome back, <strong>{data.user.username}</strong>
      </p>
    {:else}
      <p class="mt-4">Sign in to get started...</p>
    {/if}
  </Section>
  <Section title="Recently added" w="md">
    {#if data.recentGames}
      <ol>
        {#each data.recentGames as game (game.id)}
          <li>
            <a
              href={`/game/${game.id}`}
              class="flex flex-row gap-2 hover:bg-primary/20 transition-colors rounded-lg"
            >
              <div class="w-[64px] h-[64px]">
                <img
                  src={`/static/${game.icon}`}
                  alt={`${game.name} logo`}
                  class="w-full h-full overflow-hidden object-scale-down"
                />
              </div>
              <div>
                <p class="font-bold">{game.name}</p>
                <Subtext>
                  Contains {game.categoryCount}
                  {game.categoryCount === 1 ? "category" : "categories"}
                </Subtext>
              </div>
            </a>
          </li>
        {/each}
      </ol>
    {/if}
  </Section>
</div>
