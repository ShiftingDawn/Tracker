<script lang="ts">
  import {enhance} from "$app/forms";
  import Button from "$lib/components/button.svelte";
  import Input from "$lib/components/input.svelte";
  import Section from "$lib/components/section.svelte";
  import FormImageSelect from "$lib/components/formimageselect.svelte";
  import {SaveIcon} from "$lib/icons";
  import type {GameQuestTask} from "$lib/server/db";

  const {
    title,
    existing,
  }: {
    title: string;
    existing?: GameQuestTask & (null | { icon: { id: string, fileName: string } });
  } = $props();
  let chosenImage = $state<[string, string,] | undefined>(
    existing?.icon
      ? [existing.icon.id, existing.icon.fileName,]
      : undefined
  );
</script>

<Section {title} w="md">
  <form
    method="post"
    enctype="multipart/form-data"
    use:enhance
    class="flex flex-col gap-2"
  >
    <Input
      label="Name"
      name="name"
      minlength={3}
      maxlength={64}
      required
      autocomplete="off"
      autocapitalize="off"
      defaultValue={existing?.name}
    />
    <Input
      label="Description (optional)"
      name="description"
      minlength={3}
      autocomplete="off"
      autocapitalize="sentences"
      defaultValue={existing?.description ?? ""}
    />
    <FormImageSelect title="Task icon (optional)" chosen={chosenImage}
                     onselect={(id, name) => chosenImage = [id,name,]}
                     onclear={() => chosenImage = undefined}/>
    <div class="mx-auto">
      <Button type="submit">
        <SaveIcon/>
        Submit
      </Button>
    </div>
  </form>
</Section>
