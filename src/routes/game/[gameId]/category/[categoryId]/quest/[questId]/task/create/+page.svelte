<script lang="ts">
  import Taskform from "$lib/shared/taskform.svelte";
  import type {PageProps} from "./$types";

  const {data,}: PageProps = $props();
</script>

<Taskform title={`Add task to ${data.quest.name}`}/>
