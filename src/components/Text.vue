<template>
	<div>
		<select name="articles" id="articles" v-model="selectedArticle">
			<option v-for="(article, index) in articles" :value="article.key" :key="index">{{ article.key }}</option>
		</select>
		<div class="text" :style="`--body-size-min: ${bodySizeMin}px; --body-size-fluid: ${bodySizeFluid}vw; --body-size-max: ${bodySizeMax}px; --header-size-min: ${headerSizeMin}px; --header-size-fluid: ${headerSizeFluid}vw; --header-size-max: ${headerSizeMax}px;`" contenteditable="true">
			<h1>{{ article.mainHeading }}</h1>
			<h2 v-if="headingCount > 1">Lorem ipsum dolor sit amet</h2>
			<h3 v-if="headingCount > 2">Consectetur adipiscing elit, sed do</h3>
			<h4 v-if="headingCount > 3">Eiusmod tempor incididunt ut</h4>
			<h5 v-if="headingCount > 4">Labore et dolore magna aliqua</h5>
			<h6 v-if="headingCount > 5">Leo vel fringilla est ullamcorper eget</h6>
			<p v-for="(paragraph, index) in article.paragraphs" :key="index">
				{{ paragraph }}
			</p>
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
		const headerSizeMin = computed(() => store.state.headerSizeMin);
		const headerSizeFluid = computed(() => store.state.headerSizeFluid);
		const headerSizeMax = computed(() => store.state.headerSizeMax);
		const headingCount = computed(() => store.state.headingLevels);
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
			headerSizeMin,
			headerSizeFluid,
			headerSizeMax,
			headingCount,
			article,
			articles,
			selectedArticle
		};
	},
};
</script>

<style>
.text {
	max-width: 69ch;
	padding: 2em;
}
.text p {
	font-size: clamp(var(--body-size-min), calc(1rem + var(--body-size-fluid)), var(--body-size-max));
}
.text h1 {
	font-size: clamp(var(--header-size-min), calc(1rem + var(--header-size-fluid)), var(--header-size-max));
}
</style>