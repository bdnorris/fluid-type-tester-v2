<template>
	<div>
		<h2>Notes</h2>
		<p>
			Inspired by some other online tools, this attempts to combine some basic
			font and size testing with some new fluid type techniques.
		</p>
		<h3>You might also want to check out:</h3>
		<ul>
			<li>
				<a
					href="https://m2.material.io/design/typography/the-type-system.html#type-scale"
					target="_blank"
					>Material Design Type Scale</a
				>
			</li>
			<li>
				<a
					href="https://type-scale.com/"
					target="_blank"
					>Type Scale (by Jeremy Church)</a
				>
			</li>
			<li>
				<a
					href="https://www.modularscale.com/"
					target="_blank"
					>Modular Scale (by Scott Kellum and Tim Brown.)</a
					>
			</li>
			<li>
				<a
					href="https://modern-fluid-typography.vercel.app/"
					target="_blank"
					>Modern fluid typography editor (by Adrian Bece)</a
					>
			</li>
			<li>
				<a
					href="https://css-tricks.com/snippets/css/fluid-typography/"
					target="_blank"
					>Fluid Typography (CSS Tricks)</a
				>
			</li>
			<li>
				<a
					href="https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/"
					target="_blank"
					>Fluid Typography with Clamp (Smashing Magazine)</a
				>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
export default {
	name: 'Notes',
};
</script>

<style>
.lab__notes > div {
	padding: var(--space-5) max(var(--space-6), env(safe-area-inset-right)) max(var(--space-5), env(safe-area-inset-bottom)) max(var(--space-6), env(safe-area-inset-left));
	max-width: 69ch;
}
.lab__notes h2 {
	margin: 0 0 var(--space-3);
	font-size: 1rem;
}
.lab__notes h3 {
	margin: var(--space-5) 0 var(--space-3);
	font-size: 0.875rem;
}
.lab__notes p,
.lab__notes li {
	font-size: 0.875rem;
}
.lab__notes ul {
	margin: 0;
	padding-inline-start: 1.25em;
}
</style>