<script lang="ts">
	/** Reusable section header with consistent styling and decorative line.
	 * Props:
	 * - title: Optional heading text. If omitted, provide your own heading via the default slot.
	 * - tag: Heading tag (h1–h6). Defaults to h2.
	 * - headingClass: Extra classes for the heading element.
	 * - containerClass: Extra classes for the outer container.
	 */
	export let title: string | undefined = undefined;
	export let tag: keyof HTMLElementTagNameMap = 'h2';
	export let headingClass = 'font-serif font-medium text-lg lg:text-xl';
	export let containerClass = '';

	const baseContainer =
		'border-grid border-b lg:border-t-0 p-0 px-6 lg:p-8 lg:pb-0 relative corner-decoration corner-bl ';
</script>

<div class={`${baseContainer} ${containerClass}`.trim()}>
	{#if title}
		<svelte:element this={tag} class={headingClass}>{title}</svelte:element>
	{/if}
	<!-- Slot content can include custom heading / description paragraphs -->
	<slot />
</div>
