<script lang="ts">
  import {enhance} from "$app/forms";
  import Button from "$lib/components/button.svelte";
  import Section from "$lib/components/section.svelte";
  import type {PageProps} from "./$types";

  const {data, params,}: PageProps = $props();
</script>

<Section title={`Delete task: ${data.task.name}`} w="md">
  <p>Are you sure you want to delete the task "{data.task.name}"?</p>
  <p>Deleting the task will also delete all attached items!</p>
  <p><strong>This cannot be undone!</strong></p>
  <div class="flex flex-row gap-2 justify-end">
    <form method="post" use:enhance>
      <Button type="submit" variant="outline">Delete</Button>
    </form>
    <Button
      href={`/game/${params.gameId}/category/${params.categoryId}/quest/${params.questId}/task/${params.taskId}`}
    >
      Cancel
    </Button>
  </div>
</Section>
