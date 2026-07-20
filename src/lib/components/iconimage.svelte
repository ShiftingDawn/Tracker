<script lang="ts">

  import {twMerge} from "tailwind-merge";

  const {
    id,
    alt,
    size = 128,
    class: cls,
  }: {
    id: string;
    alt: string;
    size?: number,
    class?: string;
  } = $props();
</script>

<div style={`max-width:${size}px;max-height:${size}px`} class={twMerge("w-full h-full flex items-center justify-center overflow-hidden", cls)}>
  <img src={`/img/${id}`} alt={alt} class="max-w-full max-h-full object-contain" />
</div>
