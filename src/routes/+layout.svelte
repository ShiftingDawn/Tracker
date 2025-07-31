<script lang="ts">
  import Logo from "$lib/logo.svelte";
  import "../app.css";
  import Trailmenu from "./trailmenu.svelte";

  let { children, data } = $props();
</script>

<svelte:head>
  <title>Tracker</title>
</svelte:head>

<header>
  <nav
    class="sticky top-0 w-full h-16 backdrop-blur-sm flex items-center justify-between text-primary mb-4 bg-black/75"
  >
    <div class="flex flex-row items-center">
      <a
        href="/"
        aria-label="homepage"
        class="flex items-center gap-2 mx-4 px-4 py-1 text-xl font-bold tracking-widest uppercase bg-primary/10 rounded-full"
      >
        <div class="w-8 h-8"><Logo /></div>
        Tracker
      </a>
      <Trailmenu />
    </div>
    {#if data.isLoggedIn}
      <a
        href="/account"
        class="mx-4 px-4 py-1 font-bold uppercase bg-primary/10 rounded-full"
      >
        Account
      </a>
    {:else}
      <a
        href="/signin"
        class="mx-4 px-4 py-1 font-bold uppercase bg-primary/10 rounded-full"
      >
        Sign in
      </a>
    {/if}
  </nav>
</header>
<main>
  {@render children()}
</main>
