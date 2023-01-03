<template>
	<div class="code-wrap">
		<div class="code">
			<h2>Headline</h2>
<pre>
h1 {
	font-size: clamp({{ headerSizeMin }}px, calc(1rem + {{ headerSizeFluid }}vw), {{ headerSizeMax }}px);
	line-height: {{ headerLineHeight }};
}
</pre>
<pre v-if="headingLevels > 1">
h2 {
	font-size: clamp({{ h2Size[0] }}px, calc(1rem + {{ h2Size[1] }}vw), {{ h2Size[2] }}px);
	line-height: {{ headerLineHeight }};
}
</pre>
<pre v-if="headingLevels > 2">
h3 {
	font-size: clamp({{ h3Size[0] }}px, calc(1rem + {{ h3Size[1] }}vw), {{ h3Size[2] }}px);
	line-height: {{ headerLineHeight }};
}
</pre>
<pre v-if="headingLevels > 3">
h4 {
	font-size: clamp({{ h4Size[0] }}px, calc(1rem + {{ h4Size[1] }}vw), {{ h4Size[2] }}px);
	line-height: {{ headerLineHeight }};
}
</pre>
<pre v-if="headingLevels > 4">
h5 {
	font-size: clamp({{ h5Size[0] }}px, calc(1rem + {{ h5Size[1] }}vw), {{ h5Size[2] }}px);
	line-height: {{ headerLineHeight }};
}
</pre>
<pre v-if="headingLevels > 5">
h6 {
	font-size: clamp({{ h6Size[0] }}px, calc(1rem + {{ h6Size[1] }}vw), {{ h6Size[2] }}px);
	line-height: {{ headerLineHeight }};
}
</pre>
		</div>
		<div class="code">
			<h2>Paragraphs</h2>
			<pre>
p {
	font-size: clamp({{ bodySizeMin }}px, calc(1rem + {{ bodySizeFluid }}vw), {{ bodySizeMax }}px);
	line-height: {{ bodyLineHeight }};
}
			</pre>
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
			bodyLineHeight: computed(() => store.state.bodyLineHeight),
			headerSizeMin: computed(() => store.state.headerSizeMin),
			headerSizeFluid: computed(() => store.state.headerSizeFluid),
			headerSizeMax: computed(() => store.state.headerSizeMax),
			headerLineHeight: computed(() => store.state.headerLineHeight),
			headingLevels: computed(() => store.state.headingLevels),
			h2Size: computed(() => store.getters.headingSize('h2')),
			h3Size: computed(() => store.getters.headingSize('h3')),
			h4Size: computed(() => store.getters.headingSize('h4')),
			h5Size: computed(() => store.getters.headingSize('h5')),
			h6Size: computed(() => store.getters.headingSize('h6')),
		}
	}
};
</script>

<style>
</style>