<script lang="ts">
  import Section from "$lib/components/section.svelte";
  import Gamelistitem from "$lib/shared/gamelistitem.svelte";
  import type {PageProps} from "./$types";

  const {data,}: PageProps = $props();
</script>

<div class="flex flex-col gap-4">
  <Section title="Welcome to Tracker!" w="md">
    <p>Tracker is a customizable progress tracker, scoreboard and more!</p>
    {#if data.isLoggedIn}
      <p class="mt-4">
        Welcome back, <strong>{data.user!.username}</strong>
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
            <Gamelistitem {game}/>
          </li>
        {/each}
      </ol>
    {/if}
  </Section>
</div>
