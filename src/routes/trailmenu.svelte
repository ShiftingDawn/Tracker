<script lang="ts">
  import { page } from "$app/state";
  import Divider from "$lib/components/divider.svelte";
  import Logo from "$lib/logo.svelte";

  const {
    closeDrawer,
    username,
  }: {
    closeDrawer: () => void;
    username: string | null;
  } = $props();

  const [current, breadcrumbs] = $derived.by(() => {
    const all = (
      page.data.breadcrumbs as { name: string; href?: string }[]
    ).map((elem) => ({
      name: elem.name,
      href: !elem.href || elem.href === page.url.pathname ? null : elem.href,
    }));
    if (all.length === 0) return [null, []];
    return [
      all[all.length - 1],
      all.length === 1 ? [] : all.slice(0, all.length - 1).reverse(),
    ];
  });
</script>

<div class="absolute inset-0 flex flex-col">
  <a
    href="/"
    class="flex items-center gap-2 justify-center my-4"
    data-sveltekit-reload
  >
    <div class="w-8 h-8"><Logo /></div>
    <span class="text-xl font-bold tracking-widest uppercase">Tracker</span>
  </a>
  <Divider />
  <div class="my-4">
    {#if username}
      <p class="pl-2 text-drawer-fg/75">{username}</p>
      <a
        href="/account"
        class="py-1 pl-4 hover:bg-primary/50 transition-colors block w-full"
        onclick={closeDrawer}
      >
        View profile
      </a>
      <a
        href="/signout"
        class="py-1 pl-4 hover:bg-primary/50 transition-colors block w-full"
        data-sveltekit-reload
      >
        Sign out
      </a>
    {:else}
      <p class="pl-2 text-drawer-fg/75">Guest user</p>
      <a
        href="/signin"
        class="py-1 pl-4 hover:bg-primary/50 transition-colors block w-full"
        onclick={closeDrawer}
      >
        Sign in
      </a>
    {/if}
  </div>
  <Divider />
  {#if current}
    <div class="pt-2">
      <p class="ml-2 text-drawer-fg/75">Current page</p>
      {#if current.href}
        <a
          href={current.href}
          class="pl-4 py-1 hover:bg-primary/50 transition-colors block w-full"
          onclick={closeDrawer}
        >
          {current.name}
        </a>
      {:else}
        <div class="pl-4 py-1 w-full font-bold">
          {current.name}
        </div>
      {/if}
    </div>
  {/if}
  {#if breadcrumbs.length > 0}
    <div class="mt-2">
      <p class="ml-2 text-drawer-fg/75">Previous pages</p>
      <ol class="w-full">
        {#each breadcrumbs as bc (bc.name)}
          {#if bc.href}
            <li class="whitespace-nowrap w-full">
              <a
                href={bc.href}
                class="py-1 pl-4 hover:bg-primary/50 transition-colors block w-full"
                onclick={closeDrawer}
              >
                {bc.name}
              </a>
            </li>
          {:else}
            <li class="p-2 bg-primary/10 block w-full font-bold">
              {bc.name}
            </li>
          {/if}
        {/each}
      </ol>
    </div>
  {/if}
</div>
