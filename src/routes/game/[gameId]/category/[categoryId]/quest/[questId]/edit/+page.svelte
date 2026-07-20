<script lang="ts">
  import Questform from "$lib/shared/questform.svelte";
  import type {PageProps} from "./$types";

  const {data,}: PageProps = $props();
</script>

<Questform
  title={`Edit quest: ${data.quest.name}`}
  selectedCategory={data.quest.categoryId}
  existing={data.quest}
  categories={Object.fromEntries(
    Object.entries(data.categories).map(([, v,]) => [v.id, v.name,])
  )}
/>
