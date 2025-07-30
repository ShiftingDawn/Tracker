<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/componments/button.svelte";
  import Section from "$lib/componments/section.svelte";
  import type { PageProps } from "./$types";

  const { data, params }: PageProps = $props();
</script>

<Section title={`Delete category: ${data.category.name}`} w="md">
  <p>Are you sure you want to delete the category "{data.category.name}"?</p>
  <p>Deleting the category will also delete all attached items!</p>
  <p><strong>This cannot be undone!</strong></p>
  <div class="flex flex-row gap-2 justify-end">
    <form method="post" use:enhance>
      <Button type="submit" variant="outline">Delete</Button>
    </form>
    <Button href={`/game/${params.gameId}/category/${params.categoryId}`}>
      Cancel
    </Button>
  </div>
</Section>
