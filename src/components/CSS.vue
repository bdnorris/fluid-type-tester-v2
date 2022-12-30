<template>
	<div class="code-wrap">
		<div class="code">
			<h2>Headline</h2>
			<pre>
font-size: clamp({{ headerSizeMin }}px, calc(1rem + {{
					headerSizeFluid
				}}vw), {{ headerSizeMax }}px);</pre
			>
		</div>
		<div class="code">
			<h2>Paragraphs</h2>
			<pre>
font-size: clamp({{ bodySizeMin }}px, calc(1rem + {{
					bodySizeFluid
				}}vw), {{ bodySizeMax }}px);</pre
			>
		</div>
	</div>
</template>

<script lang="ts">
import { computed } from '@vue/runtime-core';
import { useStore } from "../../store";
export default {
	setup() {
		const store = useStore();
		return {
			bodySizeMin: computed(() => store.state.bodySizeMin),
			bodySizeFluid: computed(() => store.state.bodySizeFluid),
			bodySizeMax: computed(() => store.state.bodySizeMax),
			headerSizeMin: computed(() => store.state.headerSizeMin),
			headerSizeFluid: computed(() => store.state.headerSizeFluid),
			headerSizeMax: computed(() => store.state.headerSizeMax),
		}
	}
};
</script>

<style>
</style>