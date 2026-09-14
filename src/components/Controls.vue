<template>
	<div class="controls">
		<link v-if="bodyCssUrl" :href="bodyCssUrl" rel="stylesheet" />
		<link v-if="headerCssUrl" :href="headerCssUrl" rel="stylesheet" />
		<div
			id="controls-panel"
			:class="{ 'controls__panel': true, 'controls__panel--open': controlsVisible }"
			:aria-expanded="controlsVisible"
		>
			<button
				type="button"
				class="toggle controls__toggle"
				:aria-expanded="controlsVisible"
				aria-controls="controls-panel"
				@click="toggleControls"
			>
				Controls <span aria-hidden="true" v-if="controlsVisible">&times;</span><span aria-hidden="true" v-else>+</span>
			</button>
			<p class="controls__status" :class="statusClass" role="status">{{ fontStatusMessage }}</p>
			<p v-if="clampNotice" class="controls__status controls__status--notice" role="status">{{ clampNotice }}</p>
			<button
				v-if="fontsStatus === 'error'"
				type="button"
				class="controls__retry"
				@click="loadCatalog"
			>
				Retry catalog
			</button>
			<label for="fontFilter">Filter fonts</label>
			<input
				type="search"
				id="fontFilter"
				v-model="fontQuery"
				autocomplete="off"
				placeholder="Type to narrow the list"
			/>
			<fieldset :class="{'collapse': collapsed.includes('header')}" :aria-expanded="!collapsed.includes('header')">
				<legend>Header Text</legend>
				<button type="button" class="button--toggle" @click="collapseFieldset('header')">
					Header Text<span aria-hidden="true" v-if="collapsed.includes('header')">+</span><span aria-hidden="true" v-else>&minus;</span>
				</button>
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
						v-model.number="headerSizeMin"
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
						v-model.number="headerSizeFluid"
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
						v-model.number="headerSizeMax"
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
						v-model.number="headerLineHeight"
						/>
					</div>
					<label for="headerFont">Header Font</label>
					<select id="headerFont" name="headerFont" v-model="selectedHeaderFont" :disabled="visibleFonts.length === 0">
						<option v-for="(font, index) in visibleFonts" :value="font.family" :key="'h-' + index">{{ font.family }}</option>
					</select>
					<label for="headerCustomFont">
						Header Custom Font <span class="controls__hint">(if not listed above)</span>
					</label>
					<input
						type="text"
						id="headerCustomFont"
						maxlength="80"
						autocomplete="off"
						spellcheck="false"
						placeholder="Family name on this machine or Google Fonts"
						v-model="headerCustomFont"
					/>
				</div>
			</fieldset>
			<fieldset :class="{'collapse': collapsed.includes('body')}" :aria-expanded="!collapsed.includes('body')">
				<legend>Body Text</legend>
				<button type="button" class="button--toggle" @click="collapseFieldset('body')">
					Body Text<span aria-hidden="true" v-if="collapsed.includes('body')">+</span><span aria-hidden="true" v-else>&minus;</span>
				</button>
				<div class="controls__slider">
					<div>
						<label for="bodySizeMin">Body Size Minimum</label>
						<span>{{ bodySizeMin }}px</span>
						<input
							type="range"
							min="1"
							max="100"
							step="1"
							class="slider"
							id="bodySizeMin"
							v-model.number="bodySizeMin"
						/>
					</div>
					<div>
						<label for="bodySizeFluid">Body Size Fluid</label>
						<span>{{ bodySizeFluid }}vw</span>
						<input
							type="range"
							min="1"
							max="20"
							step="0.1"
							class="slider"
							id="bodySizeFluid"
							v-model.number="bodySizeFluid"
						/>
					</div>
					<div>
						<label for="bodySizeMax">Body Size Maximum</label>
						<span>{{ bodySizeMax }}px</span>
						<input
							type="range"
							min="1"
							max="100"
							step="1"
							class="slider"
							id="bodySizeMax"
							v-model.number="bodySizeMax"
						/>
					</div>
					<div>
						<label for="bodyLineHeight">Body Line Height</label>
						<span>{{ bodyLineHeight }}</span>
						<input
							type="range"
							min="0.1"
							max="3"
							step="0.1"
							class="slider"
							id="bodyLineHeight"
							v-model.number="bodyLineHeight"
						/>
					</div>
					<label for="bodyFont">Body Font</label>
					<select id="bodyFont" name="bodyFont" v-model="selectedBodyFont" :disabled="visibleFonts.length === 0">
						<option v-for="(font, index) in visibleFonts" :value="font.family" :key="'b-' + index">{{ font.family }}</option>
					</select>
					<label for="bodyCustomFont">
						Body Custom Font <span class="controls__hint">(if not listed above)</span>
					</label>
					<input
						type="text"
						id="bodyCustomFont"
						maxlength="80"
						autocomplete="off"
						spellcheck="false"
						placeholder="Family name on this machine or Google Fonts"
						v-model="bodyCustomFont"
					/>
				</div>
			</fieldset>
			<button type="button" @click="addHeading" :disabled="headingsMaxed">
				Add Another Heading Level
			</button>
			<button type="button" @click="removeHeading" v-if="headingLevels > 1">
				Remove a Heading Level
			</button>
			<fieldset v-if="headingLevels > 1" :class="{'collapse': collapsed.includes('headerRatio')}" :aria-expanded="!collapsed.includes('headerRatio')">
				<legend>Header Ratio</legend>
				<button type="button" class="button--toggle" @click="collapseFieldset('headerRatio')">
					Header Ratio<span aria-hidden="true" v-if="collapsed.includes('headerRatio')">+</span><span aria-hidden="true" v-else>&minus;</span>
				</button>
				<div class="controls__slider">
					<label for="headerRatio">Header Ratio</label>
					<span>{{ headerRatio }}</span>
					<input
						type="range"
						min="1.001"
						max="2"
						step="0.001"
						class="slider"
						id="headerRatio"
						v-model.number="headerRatio"
					/>
				</div>
			</fieldset>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, onMounted, onUnmounted, Ref, ref, watch } from "@vue/runtime-core";
import { useStore } from "../../store";
import {
	FALLBACK_FONTS,
	FontChoice,
	ensureFamily,
	fontStylesheetUrl,
	sanitizeFamilyName,
} from "../fonts";

export default {
	setup() {
		const store = useStore();
		const bodySizeMin = ref(store.state.bodySizeMin);
		const bodySizeFluid = ref(store.state.bodySizeFluid);
		const bodySizeMax = ref(store.state.bodySizeMax);
		const bodyLineHeight = ref(store.state.bodyLineHeight);
		const headerSizeMin = ref(store.state.headerSizeMin);
		const headerSizeFluid = ref(store.state.headerSizeFluid);
		const headerSizeMax = ref(store.state.headerSizeMax);
		const headerRatio = ref(store.state.headerRatio);
		const headerLineHeight = ref(store.state.headerLineHeight);
		const clampNotice = ref("");
		let clampNoticeTimer: ReturnType<typeof setTimeout> | undefined;

		const announceClamp = (message: string) => {
			clampNotice.value = message;
			if (clampNoticeTimer) clearTimeout(clampNoticeTimer);
			clampNoticeTimer = setTimeout(() => {
				clampNotice.value = "";
			}, 4000);
		};

		watch(bodySizeMin, (newVal) => {
			const before = store.state.bodySizeMax;
			store.commit("setBodySizeMin", newVal);
			bodySizeMax.value = store.state.bodySizeMax;
			if (store.state.bodySizeMax !== before) {
				announceClamp(`Body maximum raised to ${store.state.bodySizeMax}px so it stays at or above the minimum.`);
			}
		});
		watch(bodySizeFluid, (newVal) => {
			store.commit("setBodySizeFluid", newVal);
		});
		watch(bodySizeMax, (newVal) => {
			const before = store.state.bodySizeMin;
			store.commit("setBodySizeMax", newVal);
			bodySizeMin.value = store.state.bodySizeMin;
			if (store.state.bodySizeMin !== before) {
				announceClamp(`Body minimum lowered to ${store.state.bodySizeMin}px so it stays at or below the maximum.`);
			}
		});
		watch(headerSizeMin, (newVal) => {
			const before = store.state.headerSizeMax;
			store.commit("setHeaderSizeMin", newVal);
			headerSizeMax.value = store.state.headerSizeMax;
			if (store.state.headerSizeMax !== before) {
				announceClamp(`Header maximum raised to ${store.state.headerSizeMax}px so it stays at or above the minimum.`);
			}
		});
		watch(headerSizeFluid, (newVal) => {
			store.commit("setHeaderSizeFluid", newVal);
		});
		watch(headerSizeMax, (newVal) => {
			const before = store.state.headerSizeMin;
			store.commit("setHeaderSizeMax", newVal);
			headerSizeMin.value = store.state.headerSizeMin;
			if (store.state.headerSizeMin !== before) {
				announceClamp(`Header minimum lowered to ${store.state.headerSizeMin}px so it stays at or below the maximum.`);
			}
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
		const gfApiKey = computed(() => import.meta.env.VITE_GF_API_KEY as string | undefined);
		const catalogFonts = ref<FontChoice[]>([...FALLBACK_FONTS]);
		const fontsStatus = ref<"loading" | "ready" | "fallback" | "error">("fallback");
		const selectedBodyFont = ref(store.state.bodyFont);
		const bodyCustomFont = ref("");
		const headerCustomFont = ref("");
		const selectedHeaderFont = ref(store.state.headerFont);
		const fontQuery = ref("");
		let catalogAbort: AbortController | undefined;

		const fontOptions = computed(() => {
			let list = catalogFonts.value.slice();
			list = ensureFamily(list, selectedHeaderFont.value);
			list = ensureFamily(list, selectedBodyFont.value);
			return list;
		});
		const visibleFonts = computed(() => {
			const q = fontQuery.value.trim().toLowerCase();
			let list = q
				? fontOptions.value.filter((font) => font.family.toLowerCase().includes(q))
				: fontOptions.value.slice();
			list = ensureFamily(list, selectedHeaderFont.value);
			list = ensureFamily(list, selectedBodyFont.value);
			return list;
		});
		const collapsed: Ref<string[]> = ref(["header", "body"]);
		const collapseFieldset = function (fieldset: string) {
			if (collapsed.value.includes(fieldset)) {
				collapsed.value.splice(collapsed.value.indexOf(fieldset), 1);
			} else {
				collapsed.value.push(fieldset);
			}
		};
		const activeHeaderFamily = computed(() =>
			headerCustomFont.value.trim() || selectedHeaderFont.value
		);
		const activeBodyFamily = computed(() =>
			bodyCustomFont.value.trim() || selectedBodyFont.value
		);
		const bodyCssUrl = computed(() => fontStylesheetUrl(activeBodyFamily.value));
		const headerCssUrl = computed(() => {
			const family = activeHeaderFamily.value;
			if (family === activeBodyFamily.value) return "";
			return fontStylesheetUrl(family);
		});
		const fontStatusMessage = computed(() => {
			if (fontsStatus.value === "loading") return "Loading Google Fonts catalog…";
			if (fontsStatus.value === "ready") return `Catalog loaded: ${catalogFonts.value.length} families.`;
			if (fontsStatus.value === "error") {
				return "Couldn’t load Google Fonts. Using a built-in list. Check the network, then retry.";
			}
			if (!gfApiKey.value) {
				return "Using a built-in font list. Add a Google Fonts API key as VITE_GF_API_KEY to load the full catalog.";
			}
			return "Using a built-in font list.";
		});
		const statusClass = computed(() => ({
			"controls__status--error": fontsStatus.value === "error",
			"controls__status--loading": fontsStatus.value === "loading",
		}));
		watch(selectedBodyFont, (newVal) => {
			store.commit("setBodyFont", newVal);
			bodyCustomFont.value = "";
		});
		watch(selectedHeaderFont, (newVal) => {
			store.commit("setHeaderFont", newVal);
			headerCustomFont.value = "";
		});
		watch(bodyCustomFont, (newVal) => {
			const clean = sanitizeFamilyName(newVal);
			if (clean !== newVal) {
				bodyCustomFont.value = clean;
				return;
			}
			if (clean !== "") {
				store.commit("setBodyFont", clean);
			} else {
				store.commit("setBodyFont", selectedBodyFont.value);
			}
		});
		watch(headerCustomFont, (newVal) => {
			const clean = sanitizeFamilyName(newVal);
			if (clean !== newVal) {
				headerCustomFont.value = clean;
				return;
			}
			if (clean !== "") {
				store.commit("setHeaderFont", clean);
			} else {
				store.commit("setHeaderFont", selectedHeaderFont.value);
			}
		});

		const loadCatalog = () => {
			catalogAbort?.abort();
			const key = gfApiKey.value;
			if (!key) {
				catalogFonts.value = [...FALLBACK_FONTS];
				fontsStatus.value = "fallback";
				return;
			}
			fontsStatus.value = "loading";
			catalogAbort = new AbortController();
			fetch(
				`https://www.googleapis.com/webfonts/v1/webfonts?key=${encodeURIComponent(key)}&sort=popularity`,
				{ signal: catalogAbort.signal }
			)
				.then((response) => {
					if (!response.ok) {
						throw new Error(`Google Fonts HTTP ${response.status}`);
					}
					return response.json();
				})
				.then((data) => {
					const items = Array.isArray(data?.items) ? data.items : [];
					if (items.length === 0) {
						throw new Error("Google Fonts returned no families");
					}
					catalogFonts.value = items.slice(0, 100).map((item: { family: string }) => ({
						family: item.family,
					}));
					fontsStatus.value = "ready";
				})
				.catch((err: unknown) => {
					if (err instanceof DOMException && err.name === "AbortError") return;
					catalogFonts.value = [...FALLBACK_FONTS];
					fontsStatus.value = "error";
				});
		};

		onMounted(() => {
			loadCatalog();
		});
		onUnmounted(() => {
			catalogAbort?.abort();
			if (clampNoticeTimer) clearTimeout(clampNoticeTimer);
		});
		const controlsVisible = ref(false);
		const toggleControls = () => {
			controlsVisible.value = !controlsVisible.value;
		};
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
			fontQuery,
			visibleFonts,
			selectedBodyFont,
			selectedHeaderFont,
			bodyCssUrl,
			headerCssUrl,
			controlsVisible,
			toggleControls,
			collapsed,
			collapseFieldset,
			fontsStatus,
			fontStatusMessage,
			statusClass,
			loadCatalog,
			clampNotice,
		};
	},
};
</script>

<style>
.controls__slider {
	display: flex;
	flex-direction: column;
	min-width: 0;
}
.controls__slider > div {
	margin-bottom: 1em;
	min-width: 0;
}
.controls__slider > div > span {
	font-weight: 500;
	font-style: italic;
	margin-left: 1ch;
	display: inline-block;
}
.controls__panel {
	display: flex;
	flex-direction: column;
	position: relative;
	padding: 1em;
	transform: translateX(calc(-100% + 1em));
	transition: transform 0.3s ease-in-out;
	border-left: 0;
	border-top: 0;
	min-width: 0;
}
.controls__panel--open {
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
}
.controls__toggle span {
	font-size: 1.5em;
	position: relative;
	top: 0.125em;
}
.controls__status {
	font-size: 0.875rem;
	line-height: 1.4;
	margin: 0 0 0.75em 0;
	overflow-wrap: anywhere;
}
.controls__status--error {
	color: var(--color-coral);
}
.controls__status--notice {
	color: var(--color-munsel);
}
.controls__hint {
	font-weight: 400;
}
.controls__retry {
	align-self: flex-start;
}
.controls__panel > input[type="search"] {
	width: 100%;
	max-width: 100%;
	min-width: 0;
	box-sizing: border-box;
	margin-bottom: 1em;
}
.controls__slider input[type="text"],
.controls__slider input[type="search"] {
	max-width: 100%;
	min-width: 0;
	overflow-wrap: anywhere;
}

fieldset {
	margin-bottom: 1em;
	box-shadow: none;
	position: relative;
	padding-top: 2em;
	margin-bottom: 2em;
	margin-top: 1em;
	min-width: 0;
}
fieldset.collapse > div {
	display: none;
}
legend {
	position: absolute;
	top: -9999px;
	left: -9999px;
	pointer-events: none;
	visibility: hidden;
	opacity: 0;
}
label {
	font-size: 0.875rem;
}

.button--toggle {
	position: absolute;
	top: -0.666em;
	right: 0;
	padding: 0 0.25em 0 0.5em;
	color: var(--default-light);
	font-size: 1.5em;
	margin-bottom: 0.5em;
	font-weight: 500;
	text-transform: none;
	letter-spacing: 0;
	max-width: 100%;
	overflow-wrap: anywhere;
}
.button--toggle > span {
	padding-left: 0.5em;
}
</style>
