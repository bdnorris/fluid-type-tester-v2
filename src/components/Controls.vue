<template>
	<div class="controls">
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
			</div>
		</fieldset>
		<button type="button" @click="addHeading" :disabled="headingsMaxed">
			Add Another Heading Level
		</button>
		<button type="button" @click="removeHeading" v-if="headingLevels > 1">
			Remove a Heading Level
		</button>
		<fieldset>
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
import { computed, ref, watch } from "@vue/runtime-core";
import { useStore } from "../../store";
export default {
	setup() {
		const store = useStore();
		// console.log(store)
		const bodySizeMin = ref(store.state.bodySizeMin);
		const bodySizeFluid = ref(store.state.bodySizeFluid);
		const bodySizeMax = ref(store.state.bodySizeMax);
		const headerSizeMin = ref(store.state.headerSizeMin);
		const headerSizeFluid = ref(store.state.headerSizeFluid);
		const headerSizeMax = ref(store.state.headerSizeMax);
		const headerRatio = ref(store.state.headerRatio);
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
		const addHeading = () => {
			store.commit("addHeadingLevel");
		};
		const removeHeading = () => {
			store.commit("removeHeadingLevel");
		};
		const headingLevels = computed(() => store.state.headingLevels);
		const headingsMaxed = computed(() => store.state.headingLevels == 6);
		return {
			bodySizeMin: bodySizeMin,
			bodySizeFluid: bodySizeFluid,
			bodySizeMax: bodySizeMax,
			headerSizeMin: headerSizeMin,
			headerSizeFluid: headerSizeFluid,
			headerSizeMax: headerSizeMax,
			headings: computed(() => store.state.headingLevels),
			addHeading,
			removeHeading,
			headingLevels,
			headingsMaxed,
			headerRatio,
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