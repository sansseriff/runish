<script lang="ts">
	/** Reusable section header with consistent borders, padding, heading styling, and corner diamond.
	 * Props:
	 * - title: Optional heading text. If omitted, provide your own heading via the default slot.
	 * - tag: Heading tag (h1–h6). Defaults to h2.
	 * - headingClass: Extra classes for the heading element.
	 * - containerClass: Extra classes for the outer container.
	 * - diamondClass: Extra classes for the diamond element (e.g. to add a custom class hook).
	 */
	export let title: string | undefined = undefined;
	export let tag: keyof HTMLElementTagNameMap = 'h2';
	// Include dark mode color override (#99a1ad)
	export let headingClass = 'font-serif font-medium lg:h-4 dark:[color:#99a1ad]';
	export let containerClass = '';
	export let diamondClass = '';
	// Allow disabling the lg:border-t-0 if desired
	export let disableLgBorderTopReset = false;

	const baseContainer = 'border-y border-gray-300 dark:border-gray-700 p-6 relative';
	const lgReset = disableLgBorderTopReset ? '' : 'lg:border-t-0';
	const diamondBase =
		'absolute size-2 z-10 rounded-[1px] rotate-45 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 left-[-4.5px] bottom-[-4.5px]';
</script>

<div class={`${baseContainer} ${lgReset} ${containerClass}`.trim()}>
	{#if title}
		<svelte:element this={tag} class={headingClass}>{title}</svelte:element>
	{/if}
	<!-- Slot content can include custom heading / description paragraphs -->
	<slot />
	<div class={`${diamondBase} ${diamondClass}`.trim()}></div>
</div>

<style>
	/* No component-scoped styles beyond utility classes for now */
</style>
