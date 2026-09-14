<template>
	<details class="notes">
		<summary>Further reading</summary>
		<p>
			Inspired by some other online tools, this attempts to combine some basic
			font and size testing with some new fluid type techniques.
		</p>
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
	</details>
</template>

<script lang="ts">
export default {
	name: 'Notes',
};
</script>

<style>
.lab__notes .notes {
	padding: var(--space-4) max(var(--space-6), env(safe-area-inset-right)) max(var(--space-4), env(safe-area-inset-bottom)) max(var(--space-6), env(safe-area-inset-left));
	max-width: 69ch;
}
.lab__notes summary {
	font-size: 0.875rem;
	font-weight: 650;
	cursor: pointer;
	min-height: 44px;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: var(--space-3);
	width: fit-content;
	list-style: none;
}
.lab__notes summary::-webkit-details-marker,
.lab__notes summary::marker {
	display: none;
	content: "";
}
.lab__notes summary::after {
	content: "";
	flex: 0 0 auto;
	width: 0.4rem;
	height: 0.4rem;
	border-inline-end: 2px solid currentColor;
	border-block-end: 2px solid currentColor;
	transform: rotate(45deg);
	transition: transform 160ms ease-out;
}
.lab__notes details[open] summary::after {
	transform: rotate(225deg);
}
.lab__notes p,
.lab__notes li {
	font-size: 0.875rem;
}
.lab__notes p {
	margin: var(--space-3) 0 var(--space-4);
}
.lab__notes ul {
	margin: 0;
	padding-inline-start: 1.25em;
}
</style>
