<template>
	<div class="controls">
		<link v-if="bodyCssUrl" :href="bodyCssUrl" rel="stylesheet" />
		<link v-if="headerCssUrl" :href="headerCssUrl" rel="stylesheet" />
		<div id="controls-panel" class="controls__panel">
			<p v-if="clampNotice" class="controls__status controls__status--notice" role="status">{{ clampNotice }}</p>
			<p class="controls__hint">Fluid is vw: it grows with the preview width.</p>

			<fieldset class="controls__section">
				<legend>Heading</legend>
				<div class="clamp-trio">
					<div>
						<div class="controls__pair">
							<label for="headerSizeMin">Minimum</label>
							<span>{{ headerSizeMin }}px</span>
						</div>
						<input type="range" min="1" max="100" step="1" id="headerSizeMin" v-model.number="headerSizeMin" />
					</div>
					<div>
						<div class="controls__pair">
							<label for="headerSizeFluid">Fluid</label>
							<span>{{ headerSizeFluid }}vw</span>
						</div>
						<input type="range" min="1" max="20" step="0.1" id="headerSizeFluid" v-model.number="headerSizeFluid" />
					</div>
					<div>
						<div class="controls__pair">
							<label for="headerSizeMax">Maximum</label>
							<span>{{ headerSizeMax }}px</span>
						</div>
						<input type="range" min="1" max="100" step="1" id="headerSizeMax" v-model.number="headerSizeMax" />
					</div>
				</div>
				<div class="controls__row">
					<div class="controls__pair">
						<label for="headerLineHeight">Line height</label>
						<span>{{ headerLineHeight }}</span>
					</div>
					<input type="range" min="0.1" max="3" step="0.1" id="headerLineHeight" v-model.number="headerLineHeight" />
				</div>
			</fieldset>

			<fieldset class="controls__section">
				<legend>Body</legend>
				<div class="clamp-trio">
					<div>
						<div class="controls__pair">
							<label for="bodySizeMin">Minimum</label>
							<span>{{ bodySizeMin }}px</span>
						</div>
						<input type="range" min="1" max="100" step="1" id="bodySizeMin" v-model.number="bodySizeMin" />
					</div>
					<div>
						<div class="controls__pair">
							<label for="bodySizeFluid">Fluid</label>
							<span>{{ bodySizeFluid }}vw</span>
						</div>
						<input type="range" min="1" max="20" step="0.1" id="bodySizeFluid" v-model.number="bodySizeFluid" />
					</div>
					<div>
						<div class="controls__pair">
							<label for="bodySizeMax">Maximum</label>
							<span>{{ bodySizeMax }}px</span>
						</div>
						<input type="range" min="1" max="100" step="1" id="bodySizeMax" v-model.number="bodySizeMax" />
					</div>
				</div>
				<div class="controls__row">
					<div class="controls__pair">
						<label for="bodyLineHeight">Line height</label>
						<span>{{ bodyLineHeight }}</span>
					</div>
					<input type="range" min="0.1" max="3" step="0.1" id="bodyLineHeight" v-model.number="bodyLineHeight" />
				</div>
			</fieldset>

			<details class="controls__section controls__disclosure">
				<summary>Typefaces</summary>
				<p class="controls__hint">Pick from the list, or type a family that’s installed or on Google Fonts.</p>
				<label for="fontFilter">Filter fonts</label>
				<input
					type="search"
					id="fontFilter"
					v-model="fontQuery"
					autocomplete="off"
					placeholder="e.g. Roboto"
				/>
				<label for="headerFont">Heading font</label>
				<select id="headerFont" name="headerFont" v-model="selectedHeaderFont" :disabled="visibleFonts.length === 0">
					<option v-for="(font, index) in visibleFonts" :value="font.family" :key="'h-' + index">{{ font.family }}</option>
				</select>
				<label for="headerCustomFont">Heading custom font</label>
				<input
					type="text"
					id="headerCustomFont"
					maxlength="80"
					autocomplete="off"
					spellcheck="false"
					placeholder="e.g. Iowan Old Style"
					v-model="headerCustomFont"
				/>
				<label for="bodyFont">Body font</label>
				<select id="bodyFont" name="bodyFont" v-model="selectedBodyFont" :disabled="visibleFonts.length === 0">
					<option v-for="(font, index) in visibleFonts" :value="font.family" :key="'b-' + index">{{ font.family }}</option>
				</select>
				<label for="bodyCustomFont">Body custom font</label>
				<input
					type="text"
					id="bodyCustomFont"
					maxlength="80"
					autocomplete="off"
					spellcheck="false"
					placeholder="e.g. Iowan Old Style"
					v-model="bodyCustomFont"
				/>
			</details>

			<details class="controls__section controls__disclosure">
				<summary>Scale</summary>
				<p class="controls__hint">Adds h2–h6 to the sample. Each level is smaller by the heading ratio.</p>
				<div class="controls__actions">
					<button type="button" @click="addHeading" :disabled="headingsMaxed">
						Add a heading level
					</button>
					<button type="button" @click="removeHeading" v-if="headingLevels > 1">
						Remove the smallest heading
					</button>
				</div>
				<div v-if="headingLevels > 1" class="controls__row">
					<div class="controls__pair">
						<label for="headerRatio">Heading ratio</label>
						<span>{{ headerRatio }}</span>
					</div>
					<input
						type="range"
						min="1.001"
						max="2"
						step="0.001"
						id="headerRatio"
						v-model.number="headerRatio"
					/>
				</div>
			</details>

			<p v-if="fontStatusMessage" class="controls__status" :class="statusClass" role="status">{{ fontStatusMessage }}</p>
			<button
				v-if="fontsStatus === 'error'"
				type="button"
				class="controls__retry"
				@click="loadCatalog"
			>
				Retry catalog
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "@vue/runtime-core";
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
				announceClamp(`Heading maximum raised to ${store.state.headerSizeMax}px so it stays at or above the minimum.`);
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
				announceClamp(`Heading minimum lowered to ${store.state.headerSizeMin}px so it stays at or below the maximum.`);
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
			if (fontsStatus.value === "ready") return "";
			if (fontsStatus.value === "error") {
				return "Couldn’t load Google Fonts. Using a built-in list. Check the network, then retry.";
			}
			if (!gfApiKey.value) {
				return "Using a built-in font list. Add VITE_GF_API_KEY for the full catalog.";
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
		return {
			bodySizeMin,
			bodySizeFluid,
			bodySizeMax,
			bodyLineHeight,
			bodyCustomFont,
			headerSizeMin,
			headerSizeFluid,
			headerSizeMax,
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
.controls {
	min-width: 0;
	height: 100%;
}
.controls__panel {
	display: flex;
	flex-direction: column;
	gap: var(--space-5);
	padding: var(--space-4) var(--space-4) max(var(--space-6), env(safe-area-inset-bottom)) max(var(--space-4), env(safe-area-inset-left));
	min-width: 0;
	min-height: 100%;
	box-sizing: border-box;
}
.controls__section {
	margin: 0;
	padding: 0;
	border: 0;
	min-width: 0;
}
.controls__section legend,
.controls__disclosure summary {
	position: static;
	float: none;
	width: 100%;
	padding: 0;
	margin: 0 0 var(--space-3);
	font-size: 0.75rem;
	font-weight: 650;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	line-height: 1.3;
	cursor: pointer;
	min-height: 44px;
	display: flex;
	align-items: center;
}
.controls__section legend {
	cursor: default;
	min-height: 0;
	display: block;
}
.clamp-trio,
.controls__row {
	display: flex;
	flex-direction: column;
	gap: var(--space-3);
	min-width: 0;
}
.clamp-trio {
	gap: var(--space-2);
}
.clamp-trio > div,
.controls__row {
	min-width: 0;
}
.clamp-trio label,
.controls__row label,
.controls__section > label {
	font-size: 0.8125rem;
	margin: 0;
}
.controls__pair {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: var(--space-2);
}
.controls__pair span {
	font-weight: 500;
	font-variant-numeric: tabular-nums;
}
.clamp-trio input[type="range"],
.controls__row input[type="range"] {
	width: 100%;
	margin: 0;
}
.controls__section > label {
	margin-block-start: var(--space-3);
}
.controls__section > label:first-of-type {
	margin-block-start: 0;
}
.controls__section input[type="text"],
.controls__section input[type="search"],
.controls__section select {
	width: 100%;
	max-width: 100%;
	min-width: 0;
	box-sizing: border-box;
	margin-bottom: 0;
}
.controls__section select {
	margin-block-end: 0;
}
.controls__actions {
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
}
.controls__actions button {
	margin: 0;
	padding: var(--space-3) var(--space-4);
}
.controls__status {
	font-size: 0.8125rem;
	line-height: 1.4;
	margin: 0;
	overflow-wrap: anywhere;
}
.controls__status--error {
	color: var(--color-coral);
}
.controls__status--notice {
	color: var(--color-munsel);
}
.controls__hint {
	font-size: 0.8125rem;
	line-height: 1.4;
	margin: 0;
}
.controls__hint code {
	font-size: 0.875em;
	font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
.controls__retry {
	align-self: flex-start;
	margin: 0;
	padding: var(--space-3) var(--space-4);
}
</style>
