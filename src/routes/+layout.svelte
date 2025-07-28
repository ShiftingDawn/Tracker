<script lang="ts">
  import "../app.css";

  let { children, data } = $props();
</script>

<header>
  <nav
    class="sticky top-0 w-full h-16 backdrop-blur-xs border-b border-primary flex items-center justify-between text-primary mb-4"
  >
    <a
      href="/"
      aria-label="homepage"
      class="mx-4 px-4 py-1 text-xl font-bold tracking-widest uppercase bg-primary/10 rounded-full"
    >
      Tracker
    </a>
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
