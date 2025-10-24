<script lang="ts">
	const { bleed = 'var(--content-pad-x, 1.5rem)', class: className = '' } = $props<{
		bleed?: string;
		class?: string;
	}>();
</script>

<div
	class={`not-prose ${className}`}
	style="
		--bleed: {bleed};
		width: calc(100% + (var(--bleed) * 2));
		margin-left: calc(var(--bleed) * -1);
		margin-right: calc(var(--bleed) * -1);
	"
>
	<hr class="my-0 border-grid dark:border-grid" />
</div>
