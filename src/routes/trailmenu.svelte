<script lang="ts">
  import { page } from "$app/state";
  import MenuIcon from "$lib/componments/icons/menu-icon.svelte";

  let open = $state(false);
  let breadcrumbs = $derived(
    (page.data.breadcrumbs as { name: string; href?: string }[]).map(
      (elem, i) => ({
        name: elem.name,
        href: !elem.href || elem.href === page.url.pathname ? null : elem.href,
      }),
    ),
  );
</script>

<div class="relative">
  <button
    class="w-10 h-10 flex items-center justify-center gap-2 mr-4 text-xl font-bold tracking-widest uppercase bg-primary/10 rounded-full cursor-pointer hover:bg-primary/20 transition-colors disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/25"
    onclick={() => (open = true)}
    disabled={breadcrumbs.length === 0}
  >
    <MenuIcon />
  </button>
  {#if open}
    <div
      class="fixed top-0 left-0 w-screen h-screen"
      onclick={() => (open = false)}
      aria-hidden={true}
    ></div>
    <div
      class="absolute left-0 bg-black/75 backdrop-blur-sm p-2 rounded-lg shadow-md"
    >
      <ul>
        {#each breadcrumbs as bc}
          {#if bc.href}
            <li class="whitespace-nowrap">
              <a
                href={bc.href}
                class="px-2 py-1 hover:bg-primary/20 transition-colors rounded-lg"
                onclick={() => (open = false)}
              >
                {bc.name}
              </a>
            </li>
          {:else}
            <li class="px-2 py-1 font-bold whitespace-nowrap">
              > {bc.name}
            </li>
          {/if}
        {/each}
      </ul>
    </div>
  {/if}
</div>
