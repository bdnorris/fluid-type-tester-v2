<template>
	<div class="controls">
		<link v-if="bodyCssUrl" :href="bodyCssUrl" rel="stylesheet" />
		<link v-if="headerCssUrl" :href="headerCssUrl" rel="stylesheet" />
		<fieldset>
			<legend>Header Text</legend>
			<div class="controls__slider">
				<label for="headerSizeMin">Header Size Minimum</label>
				<input
					type="range"
					min="1"
					max="100"
					step="1"
					class="slider"
					id="headerSizeMin"
					v-model="headerSizeMin"
				/>
				{{ headerSizeMin }}px
				<label for="headerSizeFluid">Header Size Fluid</label>
				<input
					type="range"
					min="1"
					max="20"
					step="0.1"
					class="slider"
					id="headerSizeFluid"
					v-model="headerSizeFluid"
				/>
				{{ headerSizeFluid }}vw
				<label for="headerSizeMax">Header Size Maximum</label>
				<input
					type="range"
					min="1"
					max="100"
					step="1"
					class="slider"
					id="headerSizeMax"
					v-model="headerSizeMax"
				/>
				{{ headerSizeMax }}px
				<label for="headerLineHeight">Header Line Height</label>
				<input
					type="range"
					min="0.1"
					max="3"
					step="0.1"
					class="slider"
					id="headerLineHeight"
					v-model="headerLineHeight"
				/>
				{{ headerLineHeight }}
				<label for="headerFont">Header Font: </label>
				<select id="headerFont" value="headerFont" name="headerFont" v-model="selectedHeaderFont">
					<option v-for="(font, index) in top100Fonts" :value="font.family" :key="index">{{ font.family }}</option>
				</select>
			</div>
		</fieldset>
		<fieldset>
			<legend>Body Text</legend>
			<div class="controls__slider">
				<label for="bodySizeMin">Body Size Minimum</label>
				<input
					type="range"
					min="1"
					max="100"
					step="1"
					class="slider"
					id="bodySizeMin"
					v-model="bodySizeMin"
				/>
				{{ bodySizeMin }}px
				<label for="bodySizeFluid">Body Size Fluid</label>
				<input
					type="range"
					min="1"
					max="20"
					step="0.1"
					class="slider"
					id="bodySizeFluid"
					v-model="bodySizeFluid"
				/>
				{{ bodySizeFluid }}vw
				<label for="bodySizeMax">Body Size Maximum</label>
				<input
					type="range"
					min="1"
					max="100"
					step="1"
					class="slider"
					id="bodySizeMax"
					v-model="bodySizeMax"
				/>
				{{ bodySizeMax }}px
				<label for="bodyLineHeight">Body Line Height</label>
				<input
					type="range"
					min="0.1"
					max="3"
					step="0.1"
					class="slider"
					id="bodyLineHeight"
					v-model="bodyLineHeight"
				/>
				{{ bodyLineHeight }}
				<label for="bodyFont">Body Font: </label>
				<select id="bodyFont" value="bodyFont" name="bodyFont" v-model="selectedBodyFont">
					<option v-for="(font, index) in top100Fonts" :value="font.family" :key="index">{{ font.family }}</option>
				</select>
				<label for="bodyCustomFont">
					Body Custom Font (if not in list above)
				</label>
				<input type="text" id="bodyCustomFont" v-model="bodyCustomFont" />
			</div>
		</fieldset>
		<button type="button" @click="addHeading" :disabled="headingsMaxed">
			Add Another Heading Level
		</button>
		<button type="button" @click="removeHeading" v-if="headingLevels > 1">
			Remove a Heading Level
		</button>
		<fieldset v-if="headingLevels > 1">
			<legend>Header Ratio</legend>
			<div class="controls__slider">
				<label for="headerRatio">Header Ratio</label>
				<input
					type="range"
					min="1.001"
					max="2"
					step="0.001"
					class="slider"
					id="headerRatio"
					v-model="headerRatio"
				/>
			</div>
		</fieldset>
	</div>
</template>

<script lang="ts">
import { computed, onMounted, ref, watch } from "@vue/runtime-core";
import { useStore } from "../../store";
export default {
	setup() {
		const store = useStore();
		// console.log(store)
		const bodySizeMin = ref(store.state.bodySizeMin);
		const bodySizeFluid = ref(store.state.bodySizeFluid);
		const bodySizeMax = ref(store.state.bodySizeMax);
		const bodyLineHeight = ref(store.state.bodyLineHeight);
		const headerSizeMin = ref(store.state.headerSizeMin);
		const headerSizeFluid = ref(store.state.headerSizeFluid);
		const headerSizeMax = ref(store.state.headerSizeMax);
		const headerRatio = ref(store.state.headerRatio);
		const headerLineHeight = ref(store.state.headerLineHeight);
		watch(bodySizeMin, (newVal) => {
			store.commit("setBodySizeMin", newVal);
		});
		watch(bodySizeFluid, (newVal) => {
			store.commit("setBodySizeFluid", newVal);
		});
		watch(bodySizeMax, (newVal) => {
			store.commit("setBodySizeMax", newVal);
		});
		watch(headerSizeMin, (newVal) => {
			store.commit("setHeaderSizeMin", newVal);
		});
		watch(headerSizeFluid, (newVal) => {
			store.commit("setHeaderSizeFluid", newVal);
		});
		watch(headerSizeMax, (newVal) => {
			store.commit("setHeaderSizeMax", newVal);
		});
		watch(headerRatio, (newVal) => {
			store.commit("setHeaderRatio", newVal);
		});
		watch(headerLineHeight, (newVal) => {
			store.commit("setHeaderLineHeight", newVal);
		});
		watch(bodyLineHeight, (newVal) => {
			store.commit("setBodyLineHeight", newVal);
		});
		const addHeading = () => {
			store.commit("addHeadingLevel");
		};
		const removeHeading = () => {
			store.commit("removeHeadingLevel");
		};
		const headingLevels = computed(() => store.state.headingLevels);
		const headingsMaxed = computed(() => store.state.headingLevels == 6);
		const gfApiKey = computed(() => import.meta.env.VITE_GF_API_KEY);
		const top100Fonts = ref([]);
		const selectedBodyFont = ref(store.state.bodyFont);
		const bodyCustomFont = ref('');
		const selectedHeaderFontFamily = computed(() => {
			return top100Fonts.value.find((font) => font.family == selectedHeaderFont.value);
		});
		const selectedHeaderFont = ref(store.state.headerFont);
		const selectedBodyFontFamily = computed(() => {
			if (bodyCustomFont.value) {
				return {
					family: bodyCustomFont.value,
				}
			} else {
				return top100Fonts.value.find((font) => font.family == selectedBodyFont.value);
			}
		});
		const bodyCssUrl = computed(() => {
			if (!selectedBodyFontFamily.value) return '';
			if (!bodyCustomFont.value) {
				return `https://fonts.googleapis.com/css2?family=${selectedBodyFontFamily.value.family.replace(' ', '+')}:ital,wght@0,400;0,700;1,400;1,700&display=swap`
			} else {
				return false;
			}
		})
		const headerCssUrl = computed(() => {
			if (!selectedBodyFontFamily.value) return '';
			if (!bodyCustomFont.value) {
				return `https://fonts.googleapis.com/css2?family=${selectedHeaderFontFamily.value.family.replace(' ', '+')}:ital,wght@0,400;0,700;1,400;1,700&display=swap`
			} else {
				return false;
			}
		})
		watch(selectedBodyFont, (newVal) => {
			store.commit('setBodyFont', newVal);
			bodyCustomFont.value = '';
		})
		watch(selectedHeaderFont, (newVal) => {
			store.commit('setHeaderFont', newVal);
		})
		watch(bodyCustomFont, (newVal) => {
			if (newVal) {
				store.commit('setBodyFont', newVal);
			}
		})
		onMounted(() => {
			fetch(
				`https://www.googleapis.com/webfonts/v1/webfonts?key=${gfApiKey.value}&sort=popularity`
			)
				.then((response) => response.json())
				.then((data) => {
					top100Fonts.value = data.items.slice(0, 100);
					console.log('fonts', top100Fonts.value)
				});
		});
		return {
			bodySizeMin,
			bodySizeFluid,
			bodySizeMax,
			bodyLineHeight,
			bodyCustomFont,
			headerSizeMin,
			headerSizeFluid,
			headerSizeMax,
			headings: computed(() => store.state.headingLevels),
			addHeading,
			removeHeading,
			headingLevels,
			headingsMaxed,
			headerRatio,
			headerLineHeight,
			top100Fonts,
			selectedBodyFont,
			selectedHeaderFont,
			selectedBodyFontFamily,
			selectedHeaderFontFamily,
			bodyCssUrl,
			headerCssUrl,
		};
	},
};
</script>

<style>
.controls {
	display: flex;
	flex-direction: column;
}
.controls__slider {
	display: flex;
	flex-direction: column;
}
</style>