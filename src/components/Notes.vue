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
					>Type Scale</a
				>
			</li>
			<li>
				<a
					href="https://www.smashingmagazine.com/2016/05/fluid-typography/"
					target="_blank"
					>Fluid Typography</a
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
					href="https://www.modularscale.com/"
					target="_blank"
					>Modular Scale</a
					>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'Notes',
};
</script>

<style>
footer {
	background-color: var(--color-blue);
}
footer > div {
	padding: 2em;
	max-width: 76ch;
	/* margin: 0 auto; */
}
</style>