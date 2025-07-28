<script lang="ts">
  import Section from "$lib/componments/section.svelte";

  const { data } = $props();
</script>

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
