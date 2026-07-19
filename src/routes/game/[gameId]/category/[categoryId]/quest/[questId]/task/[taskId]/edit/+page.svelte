<script lang="ts">
  import Taskform from "$lib/shared/taskform.svelte";
  import type {PageProps} from "./$types";

  const {data,}: PageProps = $props();
</script>

<Taskform
  title={`Edit task: ${data.task.name}`}
  existing={data.task}
/>
