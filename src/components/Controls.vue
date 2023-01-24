<template>
	<div class="controls">
		<link v-if="bodyCssUrl" :href="bodyCssUrl" rel="stylesheet" />
		<link v-if="headerCssUrl" :href="headerCssUrl" rel="stylesheet" />
		<div :class="{ 'controls__panel': true, 'controls__panel--open': controlsVisible }" aria-expanded="true">
			<button type="button" class="toggle controls__toggle" @click="toggleControls">Controls <span v-if="controlsVisible">&times;</span><span v-else>+</span></button>
			<fieldset>
				<legend>Header Text</legend>
				<div class="controls__slider">
					<div>
						<label for="headerSizeMin">Header Size Minimum</label>
						<span>{{ headerSizeMin }}px</span>
						<input
							type="range"
							min="1"
							max="100"
							step="1"
							class="slider"
							id="headerSizeMin"
							v-model="headerSizeMin"
						/>
					</div>
					<div>
						<label for="headerSizeFluid">Header Size Fluid</label>
						<span>{{ headerSizeFluid }}vw</span>
						<input
							type="range"
							min="1"
							max="20"
							step="0.1"
							class="slider"
							id="headerSizeFluid"
							v-model="headerSizeFluid"
						/>
					</div>
					<div>
						<label for="headerSizeMax">Header Size Maximum</label>
						<span>{{ headerSizeMax }}px</span>
						<input
							type="range"
							min="1"
							max="100"
							step="1"
							class="slider"
							id="headerSizeMax"
							v-model="headerSizeMax"
						/>
					</div>
					<div>
						<label for="headerLineHeight">Header Line Height</label>
						<span>{{ headerLineHeight }}</span>
						<input
							type="range"
							min="0.1"
							max="3"
							step="0.1"
							class="slider"
							id="headerLineHeight"
							v-model="headerLineHeight"
						/>
					</div>
					<label for="headerFont">Header Font: </label>
					<select id="headerFont" value="headerFont" name="headerFont" @change="setHeaderFont">
						<option v-for="(font, index) in top100Fonts" :value="font['family']" :key="index">{{ font['family'] }}</option>
					</select>
					<label for="headerCustomFont">
						Header Custom Font <br>(if not listed above)
					</label>
					<input type="text" id="headerCustomFont" v-model="headerCustomFont" />
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
					<select id="bodyFont" value="bodyFont" name="bodyFont" @change="setBodyFont">
						<option v-for="(font, index) in top100Fonts" :value="font['family']" :key="index">{{ font['family'] }}</option>
					</select>
					<label for="bodyCustomFont">
						Body Custom Font <br>(if not listed above)
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
		const headerCustomFont = ref('');
		const selectedHeaderFont = ref(store.state.headerFont);
		const selectedHeaderFontFamily = computed(() => {
			return top100Fonts.value.find((font) => font['family'] == selectedHeaderFont.value);
		});
		const selectedBodyFontFamily = computed(() => {
			if (bodyCustomFont.value) {
				return {
					family: bodyCustomFont.value,
				}
			} else {
				return top100Fonts.value.find((font) => font['family'] == selectedBodyFont.value);
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
			if (!headerCustomFont.value) {
				return (selectedHeaderFontFamily.value) ? `https://fonts.googleapis.com/css2?family=${selectedHeaderFontFamily.value.family.replace(' ', '+')}:ital,wght@0,400;0,700;1,400;1,700&display=swap` : false;
			} else {
				return '';
			}
		})
		watch(selectedBodyFont, (newVal) => {
			store.commit('setBodyFont', newVal);
			bodyCustomFont.value = '';
		})
		watch(selectedHeaderFont, (newVal) => {
			store.commit('setHeaderFont', newVal);
			headerCustomFont.value = '';
		})
		watch(bodyCustomFont, (newVal) => {
			if (newVal !== '') {
				store.commit('setBodyFont', newVal);
			} else {
				store.commit('setBodyFont', selectedBodyFont.value);
			}
		})
		watch(headerCustomFont, (newVal) => {
			if (newVal !== '') {
				store.commit('setHeaderFont', newVal);
			} else {
				store.commit('setHeaderFont', selectedHeaderFont.value);
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
		const controlsVisible = ref(false);
		const toggleControls = () => {
			controlsVisible.value = !controlsVisible.value;
		};
		const setHeaderFont = (e: Event) => {
			const target = e.target as HTMLSelectElement;
			selectedHeaderFont.value = target.value
		}
		const setBodyFont = (e: Event) => {
			const target = e.target as HTMLSelectElement;
			selectedBodyFont.value = target.value
		}
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
			headerCustomFont,
			top100Fonts,
			selectedBodyFont,
			selectedHeaderFont,
			selectedBodyFontFamily,
			selectedHeaderFontFamily,
			bodyCssUrl,
			headerCssUrl,
			controlsVisible,
			toggleControls,
			setHeaderFont,
			setBodyFont,
		};
	},
};
</script>

<style>
.controls {
}
.controls__slider {
	display: flex;
	flex-direction: column;
}
.controls__slider > div {
	margin-bottom: 1em;
}
.controls__slider > div > span {
	font-weight: 500;
	font-style: italic;
	margin-left: 1ch;
	display: inline-block;
}
.controls__panel {
	/* background-color: var(--color-lapis); */
	display: flex;
	flex-direction: column;
	position: relative;
	padding: 1em;
	transform: translateX(calc(-100% + 1em));
	transition: transform 0.3s ease-in-out;
	border-left: 0;
	border-top: 0;
	/* height: 100%; */
}
.controls__panel--open {
	/* position: relative; */
	transform: translateX(0);
}
.controls__toggle {
	position: fixed;
	top: 6em;
	right: calc(-7em + 2px);
	height: 3em;
	transform: rotate(90deg);
	border-bottom: 0;
	border-radius: var(--border-radius) var(--border-radius) 0 0;
	padding: 0 1em;
	/* box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2); */
}
.controls__toggle span {
	font-size: 1.5em;	
	position: relative;
	top: 0.125em;
}

fieldset {
	margin-bottom: 1em;
	box-shadow: none;
}
legend {
	font-size: 1.5em;
	margin-bottom: 0.5em;
	font-weight: 500;
}
label {
	font-size: 0.875rem;
}
</style>