<template>
	<div>
		<select name="articles" id="articles" v-model="selectedArticle">
			<option
				v-for="(article, index) in articles"
				:value="article.key"
				:key="index"
			>
				{{ article.key }}
			</option>
		</select>
		<input type="checkbox" value="edit-content" id="edit-content" v-model="contentEditable" />
		<label for="edit-content">Edit Content</label>
		<div
			class="text"
			:style="`--body-size-min: ${bodySizeMin}px; --body-size-fluid: ${bodySizeFluid}vw; --body-size-max: ${bodySizeMax}px; --body-line-height: ${bodyLineHeight}; --header-size-min: ${headerSizeMin}px; --header-size-fluid: ${headerSizeFluid}vw; --header-size-max: ${headerSizeMax}px; --header-ratio: ${headerRatio}; --h2-size-min: ${h2Size[0]}px; --h2-size-fluid: ${h2Size[1]}vw; --h2-size-max: ${h2Size[2]}px; --h3-size-min: ${h3Size[0]}px; --h3-size-fluid: ${h3Size[1]}vw; --h3-size-max: ${h3Size[2]}px; --h4-size-min: ${h4Size[0]}px; --h4-size-fluid: ${h4Size[1]}vw; --h4-size-max: ${h4Size[2]}px; --h5-size-min: ${h5Size[0]}px; --h5-size-fluid: ${h5Size[1]}vw; --h5-size-max: ${h5Size[2]}px; --h6-size-min: ${h6Size[0]}px; --h6-size-fluid: ${h6Size[1]}vw; --h6-size-max: ${h6Size[2]}px; --header-line-height: ${headerLineHeight}; --body-font: ${bodyFont}; --header-font: ${headerFont}`"
			:contenteditable="contentEditable"
		>
			<h1>{{ article.mainHeading }}</h1>
			<h2 v-if="headingCount > 1">Lorem ipsum dolor sit amet</h2>
			<h3 v-if="headingCount > 2">Consectetur adipiscing elit, sed do</h3>
			<h4 v-if="headingCount > 3">Eiusmod tempor incididunt ut</h4>
			<h5 v-if="headingCount > 4">Labore et dolore magna aliqua</h5>
			<h6 v-if="headingCount > 5">Leo vel fringilla est ullamcorper eget</h6>
			<p v-for="(paragraph, index) in article.paragraphs" :key="index" v-html="paragraph" />
		</div>
	</div>
</template>

<script lang="ts">
import { useStore } from "../../store";
import { computed, ref, watch } from "vue";
import texts from "../../texts.json";

export default {
	setup() {
		const store = useStore();
		const bodySizeMin = computed(() => store.state.bodySizeMin);
		const bodySizeFluid = computed(() => store.state.bodySizeFluid);
		const bodySizeMax = computed(() => store.state.bodySizeMax);
		const bodyLineHeight = computed(() => store.state.bodyLineHeight);
		const bodyFont = computed(() => store.state.bodyFont);
		const headerSizeMin = computed(() => store.state.headerSizeMin);
		const headerSizeFluid = computed(() => store.state.headerSizeFluid);
		const headerSizeMax = computed(() => store.state.headerSizeMax);
		const headingCount = computed(() => store.state.headingLevels);
		const headerRatio = computed(() => store.state.headerRatio);
		const headerLineHeight = computed(() => store.state.headerLineHeight);
		const headerFont = computed(() => store.state.headerFont);
		const articles = JSON.parse(JSON.stringify(texts)).texts;
		// console.log('articles', articles)
		const selectedArticle = ref(articles[0].key);
		const article = ref(articles[0]);
		watch(selectedArticle, (newVal) => {
			// console.log('newVal', newVal)
			article.value = articles.find((article) => article.key === newVal);
		});
		return {
			bodySizeMin,
			bodySizeFluid,
			bodySizeMax,
			bodyLineHeight,
			bodyFont,
			headerSizeMin,
			headerSizeFluid,
			headerSizeMax,
			headingCount,
			headerRatio,
			headerFont,
			article,
			articles,
			selectedArticle,
			h2Size: computed(() => store.getters.headingSize('h2')),
			h3Size: computed(() => store.getters.headingSize('h3')),
			h4Size: computed(() => store.getters.headingSize('h4')),
			h5Size: computed(() => store.getters.headingSize('h5')),
			h6Size: computed(() => store.getters.headingSize('h6')),
			headerLineHeight,
			contentEditable: ref(false),
		};
	},
};
</script>

<style>
.text {
	max-width: 69ch;
	/* padding: 2em; */
	line-height: var(--body-line-height);
	font-family: var(--body-font);
	padding-top: 6em;
}
.text h1, .text h2, .text h3, .text h4, .text h5, .text h6 {
	line-height: var(--header-line-height);
	font-family: var(--header-font);
}
.text p {
	font-size: clamp(
		var(--body-size-min),
		calc(1rem + var(--body-size-fluid)),
		var(--body-size-max)
	);
}
.text h1 {
	font-size: clamp(
		var(--header-size-min),
		calc(1rem + var(--header-size-fluid)),
		var(--header-size-max)
	);
}
.text h2 {
	font-size: clamp(
		var(--h2-size-min),
		calc(1rem + var(--h2-size-fluid)),
		var(--h2-size-max)
	);
}
.text h3 {
	font-size: clamp(
		var(--h3-size-min),
		calc(1rem + var(--h3-size-fluid)),
		var(--h3-size-max)
	);
}
.text h4 {
	font-size: clamp(
		var(--h4-size-min),
		calc(1rem + var(--h4-size-fluid)),
		var(--h4-size-max)
	);
}
.text h5 {
	font-size: clamp(
		var(--h5-size-min),
		calc(1rem + var(--h5-size-fluid)),
		var(--h5-size-max)
	);
}
.text h6 {
	font-size: clamp(
		var(--h6-size-min),
		calc(1rem + var(--h6-size-fluid)),
		var(--h6-size-max)
	);
}

</style>