<template>
	<div class="code-wrap__buton-wrapper">
		<button type="button" @click="toggleCodeWrap" id="close-popup">Show CSS</button>
	</div>
	<div class="code-wrap__wrapper" v-if="codeWrapVisible">
		<div :class="{ 'code-wrap': true, 'code-wrap--visible': codeWrapVisible }">
			<button type="button" @click="toggleCodeWrap" class="code-wrap__close">Close <span>&times;</span></button>
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
}</pre>
			</div>
		</div>
		<div class="code-wrap__screen" aria-hidden="true" v-if="codeWrapVisible" @click="toggleCodeWrap"></div>
	</div>

</template>

<script lang="ts">
import { computed, ref } from '@vue/runtime-core';
import { useStore } from "../../store";
export default {
	setup() {
		const store = useStore();
		const codeWrapVisible = ref(false);
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
			codeWrapVisible,
			toggleCodeWrap() {
				codeWrapVisible.value = !codeWrapVisible.value;
				let closeButton = document.getElementById('close-popup');
				if (closeButton) {
					closeButton.focus();
				}
			}
		}
	}
};
</script>

<style>
.code-wrap__wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	inset: 0;
}
.code-wrap {
	transform: scale(0);
	transition: transform 0.3s ease-in-out;
	border: 1px solid var(--color-white);
	/* border-top: 0; */
	padding: 1em;
	z-index: 101;
}
.code-wrap__screen {
	background-color: var(--color-gunmetal);
	opacity: 0.5;
	position: fixed;
	inset: 0;
	width: 100%;
	height: 100%;
	z-index: 100;
}
.code-wrap--visible {
	transform: scale(1);
}
.code-wrap--toggle {
	position: absolute;
	bottom: calc(-3em + 2px);
	left: 3em;
	padding: 0 1em;
	height: 3em;
	border-top: 0;
	border-radius: 0 0 var(--border-radius) var(--border-radius);
}
.code-wrap__buton-wrapper {
	padding: 2em 0;
}
</style>