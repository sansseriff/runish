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
	export let headingClass =
		'font-serif font-medium text-lg lg:text-xl lg:mb-0 lg:mt-22 dark:text-gray-400';
	export let headingAddition = '';
	export let containerClass = '';

	const baseContainer =
		'block lg:h-42 border-grid border-b lg:border-t-0 p-0 px-6 lg:p-6 lg:px-8 lg:pb-0 relative mb-0 bg-linear-to-t from-blue-100/20 dark:from-blue-900/5 overflow-visible';
</script>

<div class={`${baseContainer} ${containerClass}`.trim()}>
	<div class="corner-diamond corner-diamond-bl simple-noise" aria-hidden="true"></div>
	<div class="corner-diamond corner-diamond-br simple-noise" aria-hidden="true"></div>
	{#if title}
		<svelte:element this={tag} class={headingClass + headingAddition}>{title}</svelte:element>
	{/if}
	<!-- Slot content can include custom heading / description paragraphs -->
	<slot />
	<svg
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 [z-index:-1] size-full fill-blue-500/50 stroke-blue-500/50 [mask-image:linear-gradient(to_top,_#ffffffad,_transparent)] z-2 opacity-[.15]"
	>
		<defs>
			<pattern id=":S3:" width="14" height="14.1" patternUnits="userSpaceOnUse" x="-1" y="-1">
				<path d="M.5 14V.5H14" fill="none" stroke-dasharray="0"></path>
			</pattern>
		</defs>
		<rect width="100%" height="100%" stroke-width="0" fill="url(#:S3:)"></rect>
	</svg>
</div>
