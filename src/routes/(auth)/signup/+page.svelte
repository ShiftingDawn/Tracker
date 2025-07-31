<script lang="ts">
	import { enhance } from "$app/forms";
	import Button from "$lib/componments/button.svelte";
	import Divider from "$lib/componments/divider.svelte";
	import Input from "$lib/componments/input.svelte";
	import Section from "$lib/componments/section.svelte";
	import type { ActionData } from "./$types";

	let { form }: { form: ActionData } = $props();
</script>

<Section title="Sign up" w="sm">
	<div class="flex flex-col gap-4">
		<p style="color: red">{form?.message ?? ""}</p>
		<form method="post" use:enhance class="flex flex-col gap-2">
			<Input
				label="Username"
				name="username"
				minlength={3}
				maxlength={24}
				required
				autocomplete="off"
				autocapitalize="off"
			/>
			<Input
				label="Password"
				name="password"
				type="password"
				minlength={8}
				required
				autocomplete="off"
				autocapitalize="off"
			/>
			<Input
				label="Confirm password"
				name="password2"
				type="password"
				minlength={8}
				required
				autocomplete="off"
				autocapitalize="off"
			/>
			<div class="mx-auto">
				<Button type="submit">Sign up</Button>
			</div>
		</form>
		<Divider>OR</Divider>
		<Button href="/signin" variant="outline">Already have an account?</Button>
	</div>
</Section>
