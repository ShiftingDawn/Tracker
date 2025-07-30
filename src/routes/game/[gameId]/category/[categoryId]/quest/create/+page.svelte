<script lang="ts">
  import Questform from "$lib/shared/questform.svelte";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();
</script>

<Questform
  title={`Add quest to ${data.category.name}`}
  selectedCategory={data.category.id}
  categories={Object.fromEntries(
    Object.entries(data.categories).map(([, v]) => [v.id, v.name]),
  )}
/>
