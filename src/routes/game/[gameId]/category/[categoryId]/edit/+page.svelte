<script lang="ts">
  import Categoryform from "$lib/shared/categoryform.svelte";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();
</script>

<Categoryform
  title={`Edit category: ${data.category.name}`}
  existing={data.category}
/>
