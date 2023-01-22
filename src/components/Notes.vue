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
footer > div {
	padding: 2em;
	max-width: 76ch;
	/* margin: 0 auto; */
}
</style>