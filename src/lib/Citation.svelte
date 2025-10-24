<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import { getContext } from 'svelte';

	export type Reference = { n: number; href: string; label: string };

	const { n, href, label }: { n: number; href?: string; label?: string } = $props();

	const refMap = getContext<Map<number, Reference> | undefined>('references');

	const resolved = $derived.by(() => {
		const found = refMap?.get(n);
		return {
			href: href ?? found?.href ?? '#',
			label: label ?? found?.label ?? `Reference ${n}`
		};
	});
</script>

<Tooltip.Root delayDuration={200}>
	<Tooltip.Trigger class="no-underline">
		<a
			href={'#ref-' + n}
			aria-label={`Jump to reference ${n}`}
			class="text-cream-500 hover:underline"
		>
			[{n}]
		</a>
	</Tooltip.Trigger>
	<Tooltip.Content sideOffset={8}>
		<div
			class="shadow-sharp simple-noise relative rounded-input border-grid bg-cream-50 shadow-popover outline-hidden flex items-center justify-center border p-3 text-sm font-medium"
		>
			<a
				href={resolved.href}
				target="_blank"
				rel="noopener noreferrer"
				class="text-cream-500 hover:underline"
			>
				{resolved.label}
			</a>
		</div>
	</Tooltip.Content>
</Tooltip.Root>
