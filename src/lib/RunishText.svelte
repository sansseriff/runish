<script lang="ts">
	import { onMount } from 'svelte';

	// Size prop to adjust spacing for different font sizes
	let {
		size = 'default',
		rememberVisitor = false
	}: { size?: 'sm' | 'default'; rememberVisitor?: boolean } = $props();

	// Split "Runi.sh" into individual characters
	const runishText = ['R', 'u', 'n', 'i', '.', 's', 'h'];

	/**
	 * Per-character configuration for runic font positioning and sizing
	 *
	 * Adjust these values to match the runic font appearance to the default font:
	 * - letterSpacing: Adjust horizontal spacing (e.g., '0.1em', '-0.02rem')
	 * - verticalOffset: Adjust vertical position (e.g., '0.05em', '-2px')
	 * - fontSize: Scale the runic font size (e.g., '1.1em', '0.95em')
	 *
	 * Characters are indexed: ['R', 'u', 'n', 'i', '.', 's', 'h']
	 */
	const characterConfig: Array<{
		letterSpacing?: string;
		verticalOffset?: string;
		fontSize?: string;
		width?: string;
	}> = [
		{ letterSpacing: '0', verticalOffset: '0.3rem', fontSize: '1em' }, // R
		{ letterSpacing: '0', verticalOffset: '0.3rem', fontSize: '1em' }, // u
		{ letterSpacing: '0', verticalOffset: '0.3rem', fontSize: '1em' }, // n
		{ letterSpacing: '0', verticalOffset: '0.3rem', fontSize: '1em' }, // i
		{ letterSpacing: '-0.02rem', verticalOffset: '0.3rem', fontSize: '1em' }, // .
		{ letterSpacing: '0', verticalOffset: '0.3rem', fontSize: '1em' }, // s
		{ letterSpacing: '0', verticalOffset: '0.3rem', fontSize: '1em' } // h
	];

	// State for each letter's runic font status
	let runicFlourish = $state<boolean[]>(Array(runishText.length).fill(false));
	let runicHover = $state<boolean[]>(Array(runishText.length).fill(false));

	// Track timeout IDs for cleanup
	const flourishTimeouts: (number | null)[][] = Array.from({ length: runishText.length }, () => [
		null,
		null
	]);

	// Store character widths to prevent layout shift
	let characterWidths = $state<number[]>(Array(runishText.length).fill(0));
	let characterRefs = $state<(HTMLSpanElement | null)[]>(Array(runishText.length).fill(null));
	let containerRef = $state<HTMLSpanElement | null>(null);

	// Check if this is the first visit
	onMount(() => {
		if (typeof window !== 'undefined') {
			// Measure character widths when in default font using a more reliable method
			const measureWidths = () => {
				if (!containerRef) return;

				// Get computed styles from the actual container
				const computedStyle = getComputedStyle(containerRef);

				// Create a hidden measurement container with same styles
				const measurementContainer = document.createElement('span');
				measurementContainer.style.visibility = 'hidden';
				measurementContainer.style.position = 'absolute';
				measurementContainer.style.top = '0';
				measurementContainer.style.left = '0';
				measurementContainer.style.whiteSpace = 'nowrap';
				measurementContainer.style.fontSize = computedStyle.fontSize;
				measurementContainer.style.fontFamily = computedStyle.fontFamily;
				measurementContainer.style.fontWeight = computedStyle.fontWeight;
				measurementContainer.style.fontStyle = computedStyle.fontStyle;
				measurementContainer.style.lineHeight = computedStyle.lineHeight;

				document.body.appendChild(measurementContainer);

				// Measure each character with its specific letter spacing
				runishText.forEach((letter, index) => {
					const measurementSpan = document.createElement('span');
					measurementSpan.textContent = letter;
					measurementSpan.style.display = 'inline-block';
					measurementSpan.style.letterSpacing = characterConfig[index]?.letterSpacing ?? '0';
					measurementSpan.style.fontSize = characterConfig[index]?.fontSize ?? '1em';

					if (letter === '.') {
						measurementSpan.style.marginLeft = '-0.02rem';
						measurementSpan.style.marginRight = '-0.02rem';
					}

					measurementContainer.appendChild(measurementSpan);

					// Force a reflow to get accurate measurements
					void measurementSpan.offsetWidth;

					characterWidths[index] = measurementSpan.offsetWidth;
				});

				document.body.removeChild(measurementContainer);
			};

			// Wait for fonts to be loaded, then measure
			if (document.fonts && document.fonts.ready) {
				document.fonts.ready.then(() => {
					setTimeout(measureWidths, 50);
				});
			} else {
				// Fallback if font loading API not available
				setTimeout(measureWidths, 200);
			}

			// Determine if we should trigger the flourish
			let shouldFlourish = false;
			if (rememberVisitor) {
				// Check localStorage if rememberVisitor is enabled
				const hasVisited = localStorage.getItem('runish_has_visited');
				if (!hasVisited) {
					// Mark as visited
					localStorage.setItem('runish_has_visited', 'true');
					shouldFlourish = true;
				}
			} else {
				// If rememberVisitor is disabled, always trigger flourish
				shouldFlourish = true;
			}

			const startFlourish = () => {
				if (!shouldFlourish) return;
				// Trigger flourish effect for each letter
				runishText.forEach((_, index) => {
					// Random delay between 0 and 1 second
					const delay = Math.random() * 1000;
					const startTimeoutId = setTimeout(() => {
						// Activate runic font
						runicFlourish[index] = true;
						// Duration between 0.3 and 2 seconds
						const duration = 300 + Math.random() * 1700;
						const endTimeoutId = setTimeout(() => {
							// Only deactivate if not being hovered
							if (!runicHover[index]) {
								runicFlourish[index] = false;
							}
							flourishTimeouts[index][1] = null;
						}, duration);
						flourishTimeouts[index][1] = endTimeoutId as unknown as number;
					}, delay);
					flourishTimeouts[index][0] = startTimeoutId as unknown as number;
				});
			};

			// Start flourish only after fonts are ready; fallback with small delay
			if (document.fonts && document.fonts.ready) {
				document.fonts.ready.then(() => {
					startFlourish();
				});
			} else {
				setTimeout(() => {
					startFlourish();
				}, 200);
			}
		}

		// Cleanup function
		return () => {
			flourishTimeouts.forEach((timeouts) => {
				timeouts.forEach((timeout) => {
					if (timeout !== null) {
						clearTimeout(timeout);
					}
				});
			});
		};
	});

	function handleMouseEnter(index: number) {
		runicHover[index] = true;
	}

	function handleMouseLeave(index: number) {
		runicHover[index] = false;
	}

	// Computed: letter shows runic if either hovered or in flourish
	let runicActive = $derived(
		runishText.map((_, index) => runicFlourish[index] || runicHover[index])
	);
</script>

<span class="runish-container" class:runish-sm={size === 'sm'} bind:this={containerRef}>
	{#each runishText as letter, index}
		<span
			bind:this={characterRefs[index]}
			class="runish-letter"
			class:runic={runicActive[index]}
			class:dot={letter === '.'}
			class:dot-color={letter === '.'}
			class:measured={characterWidths[index] > 0}
			role="presentation"
			onmouseenter={() => handleMouseEnter(index)}
			onmouseleave={() => handleMouseLeave(index)}
			style="
				--letter-spacing: {characterConfig[index]?.letterSpacing ?? '0'};
				--vertical-offset: {characterConfig[index]?.verticalOffset ?? '0'};
				--font-size: {characterConfig[index]?.fontSize ?? '1em'};
				--char-width: {characterWidths[index] > 0 ? `${characterWidths[index]}px` : 'auto'};
			"
		>
			{letter}
		</span>
	{/each}
</span>

<style>
	.runish-container {
		display: inline-block;
		position: relative;
		/* Fixed line height to prevent vertical shifting */
		line-height: 1.2;
		height: 1.2em;
		vertical-align: baseline;
		/* Reset letter spacing to ensure consistency across screen sizes */
		letter-spacing: normal;
	}

	/* Small size variant - tighter spacing for smaller text */
	.runish-container.runish-sm {
		letter-spacing: -0.02em;
	}

	.runish-letter {
		display: inline-block;
		position: relative;
		letter-spacing: var(--letter-spacing);
		font-size: var(--font-size);
		/* Fixed line height */
		line-height: 1.2;
		height: 1em;
		vertical-align: baseline;
		transition:
			font-family 0s ease-in-out,
			transform 0s ease-in-out;
		text-align: center;
		padding-top: 1px;
	}

	/* Once measured, lock the width to prevent shifting */
	.runish-letter.measured {
		width: var(--char-width);
		min-width: var(--char-width);
		max-width: var(--char-width);
		overflow: hidden;
	}

	.runish-letter.runic {
		font-family: 'Moonrune', serif;
		/* Apply vertical offset for runic font */
		transform: translateY(var(--vertical-offset));
	}

	.runish-letter.dot {
		margin-left: -0.02rem;
		margin-right: -0.02rem;
	}

	.runish-letter.dot-color {
		color: rgb(147, 197, 253);
	}

	:global(html.dark) .runish-letter.dot-color {
		color: rgb(59, 130, 246);
	}
</style>

