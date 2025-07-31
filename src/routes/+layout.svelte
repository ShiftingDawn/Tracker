<script lang="ts">
  import MenuIcon from "$lib/components/icons/menu-icon.svelte";
  import Logo from "$lib/logo.svelte";
  import { twMerge } from "tailwind-merge";
  import "../app.css";
  import Trailmenu from "./trailmenu.svelte";

  let { children, data } = $props();

  let drawerOpen = $state(false);
</script>

<svelte:head>
  <title>Tracker</title>
</svelte:head>

<header
  class="sticky top-0 z-10 h-16 flex items-center text-primary-fg w-full backdrop-blur-sm"
>
  <div class="flex flex-row items-center px-4 gap-4">
    <button
      class="w-10 h-10 flex items-center justify-center gap-2 text-xl font-bold tracking-widest uppercase bg-primary rounded-full cursor-pointer hover:bg-primary/20 transition-colors"
      onclick={() => (drawerOpen = true)}
      aria-haspopup="menu"
      aria-label="open drawer"
    >
      <MenuIcon />
    </button>
    <a
      href="/"
      aria-label="homepage"
      class="flex items-center gap-2 px-4 py-1 text-xl font-bold tracking-widest uppercase bg-primary rounded-full"
    >
      <div class="w-8 h-8"><Logo /></div>
      Tracker
    </a>
  </div>
</header>
<main>
  {@render children()}
</main>
<div
  class={twMerge(
    "fixed z-20 inset-0 pointer-events-none transition-all backdrop-blur-none",
    drawerOpen && "pointer-events-auto backdrop-blur-sm",
  )}
  aria-hidden={!drawerOpen}
  role="dialog"
  tabindex="-1"
  aria-modal="true"
>
  <div
    class="fixed inset-0"
    onclick={() => (drawerOpen = false)}
    aria-hidden="true"
  ></div>
  <div
    class={twMerge(
      "h-full w-64 bg-drawer text-drawer-fg -translate-x-full transition-transform ease-in-out duration-75",
      drawerOpen && "translate-x-0",
    )}
    aria-hidden={!drawerOpen}
  >
    <Trailmenu
      closeDrawer={() => (drawerOpen = false)}
      username={data.username}
    />
  </div>
</div>
