<script lang="ts">
	import { onMount } from 'svelte';
	import { emailAddress, type EmailKey } from '$lib/email';

	/** A mailto link whose address only exists after the page runs in a browser.
	 * The prerendered HTML shows a neutral placeholder instead. */
	let {
		which = 'gmail',
		label,
		class: cls = ''
	}: { which?: EmailKey; label?: string; class?: string } = $props();

	let address = $state<string | null>(null);
	onMount(() => {
		address = emailAddress(which);
	});
</script>

<a class={cls} href={address ? `mailto:${address}` : undefined}>{label ?? address ?? 'email'}</a>
