<template>
	<div class="stage">
		<div class="stage__chrome">
			<div class="stage__sample">
				<label for="articles">Sample text</label>
				<select name="articles" id="articles" v-model="selectedArticle">
					<option
						v-for="(article, index) in articles"
						:value="article.key"
						:key="index"
					>
						{{ article.key }}
					</option>
				</select>
			</div>
			<label class="stage__edit" for="edit-content">
				<input type="checkbox" value="edit-content" id="edit-content" v-model="contentEditable" />
				Edit content
			</label>
		</div>
		<p v-if="contentEditable" class="text__edit-hint" role="status">
			Editing. Turn off Edit content to restore the sample.
		</p>
		<div class="viewport-bar">
			<p class="viewport-bar__readout">
				<span class="viewport-bar__width">{{ measuredWidth }}px</span>
				<span class="viewport-bar__sep" aria-hidden="true">·</span>
				<span>heading {{ headingPx }}px</span>
				<span class="viewport-bar__sep" aria-hidden="true">·</span>
				<span>body {{ bodyPx }}px</span>
			</p>
			<div class="viewport-bar__presets" role="group" aria-label="Preview width">
				<button
					type="button"
					:aria-pressed="mode === 'fit'"
					@click="setMode('fit')"
				>
					Fit
				</button>
				<button
					v-for="preset in presets"
					:key="preset"
					type="button"
					:aria-pressed="mode === preset"
					@click="setMode(preset)"
				>
					{{ preset }}
				</button>
			</div>
		</div>
		<p v-if="capNotice" class="viewport-bar__note" role="status">{{ capNotice }}</p>
		<div class="viewport-shell" ref="shellEl">
			<div
				class="viewport"
				:class="{ 'viewport--fit': mode === 'fit' }"
				:style="frameStyle"
				ref="frameEl"
			>
				<div
					class="text"
					:class="{ 'text--editing': contentEditable }"
					role="article"
					aria-label="Type preview"
					:style="textVars"
					:contenteditable="contentEditable"
				>
					<h1>{{ article.mainHeading }}</h1>
					<h2 v-if="sampleHeadings[0]">{{ sampleHeadings[0] }}</h2>
					<h3 v-if="sampleHeadings[1]">{{ sampleHeadings[1] }}</h3>
					<h4 v-if="sampleHeadings[2]">{{ sampleHeadings[2] }}</h4>
					<h5 v-if="sampleHeadings[3]">{{ sampleHeadings[3] }}</h5>
					<h6 v-if="sampleHeadings[4]">{{ sampleHeadings[4] }}</h6>
					<p v-for="(paragraph, index) in article.paragraphs" :key="index" v-html="paragraph" />
				</div>
			</div>
			<button
				type="button"
				class="viewport__handle"
				aria-label="Resize preview width"
				@pointerdown="onDragStart"
				@keydown="onHandleKey"
			>
				<span class="viewport__handle-mark" aria-hidden="true"></span>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { useStore } from "../../store";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import texts from "../../texts.json";
import { quoteCssFamily } from "../fonts";

const PRESETS = [320, 375, 768, 1024, 1440] as const;
const MIN_FRAME = 280;

const plainText = (html: string) =>
	html
		.replace(/<[^>]+>/g, "")
		.replace(/&mdash;/g, "—")
		.replace(/&[^;]+;/g, " ")
		.replace(/\s+/g, " ")
		.trim();

const clipHeading = (source: string, skip = 0) => {
	const words = plainText(source).split(" ").filter(Boolean);
	const take = 7;
	let slice = words.slice(skip, skip + take);
	if (slice.length < 3) slice = words.slice(0, take);
	return slice.join(" ").replace(/^["“”']+/, "").replace(/[.,;:"”']+$/, "");
};

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
		const selectedArticle = ref(articles[0].key);
		const article = ref(JSON.parse(JSON.stringify(articles[0])));
		const contentEditable = ref(false);
		const mode = ref<"fit" | number>("fit");
		const measuredWidth = ref(0);
		const headingPx = ref(0);
		const bodyPx = ref(0);
		const availableWidth = ref(0);
		const capNotice = ref("");
		const shellEl = ref<HTMLElement | null>(null);
		const frameEl = ref<HTMLElement | null>(null);
		let capTimer: ReturnType<typeof setTimeout> | undefined;
		let observers: ResizeObserver | undefined;

		const cloneArticle = (key: string) => {
			const found = articles.find((item: { key: string }) => item.key === key);
			return JSON.parse(JSON.stringify(found ?? articles[0]));
		};
		watch(selectedArticle, (newVal) => {
			article.value = cloneArticle(newVal);
			contentEditable.value = false;
		});
		watch(contentEditable, (editing) => {
			if (!editing) {
				article.value = cloneArticle(selectedArticle.value);
			}
		});

		const sampleHeadings = computed(() => {
			const paras: string[] = article.value.paragraphs ?? [];
			const extras = Math.max(0, headingCount.value - 1);
			const out: string[] = [];
			for (let i = 0; i < extras; i++) {
				const para =
					paras[i + 1] ?? paras[paras.length - 1] ?? article.value.mainHeading;
				const reuse = i + 1 >= paras.length;
				out.push(clipHeading(para, reuse ? (i - paras.length + 2) * 6 : 0));
			}
			return out;
		});

		const announceCap = (message: string) => {
			capNotice.value = message;
			if (capTimer) clearTimeout(capTimer);
			capTimer = setTimeout(() => {
				capNotice.value = "";
			}, 4000);
		};

		const handleWidth = () => {
			const handle = shellEl.value?.querySelector(".viewport__handle") as HTMLElement | null;
			return handle ? handle.getBoundingClientRect().width : 20;
		};

		const measureAvailable = () => {
			if (!shellEl.value) return;
			availableWidth.value = Math.max(
				MIN_FRAME,
				Math.floor(shellEl.value.clientWidth - handleWidth())
			);
		};

		const measureFrame = () => {
			const frame = frameEl.value;
			if (!frame) return;
			measuredWidth.value = Math.round(frame.getBoundingClientRect().width);
			const h1 = frame.querySelector("h1");
			const p = frame.querySelector("p");
			headingPx.value = h1 ? Math.round(parseFloat(getComputedStyle(h1).fontSize)) : 0;
			bodyPx.value = p ? Math.round(parseFloat(getComputedStyle(p).fontSize)) : 0;
		};

		const appliedWidth = computed(() => {
			if (mode.value === "fit") return availableWidth.value;
			return Math.min(mode.value, availableWidth.value);
		});

		const frameStyle = computed(() => {
			if (mode.value === "fit") return {};
			return { width: `${appliedWidth.value}px` };
		});

		const h2Size = computed(() => store.getters.headingSize("h2"));
		const h3Size = computed(() => store.getters.headingSize("h3"));
		const h4Size = computed(() => store.getters.headingSize("h4"));
		const h5Size = computed(() => store.getters.headingSize("h5"));
		const h6Size = computed(() => store.getters.headingSize("h6"));

		const textVars = computed(
			() =>
				`--body-size-min: ${bodySizeMin.value}px; --body-size-fluid: ${bodySizeFluid.value}cqw; --body-size-max: ${bodySizeMax.value}px; --body-line-height: ${bodyLineHeight.value}; --header-size-min: ${headerSizeMin.value}px; --header-size-fluid: ${headerSizeFluid.value}cqw; --header-size-max: ${headerSizeMax.value}px; --header-ratio: ${headerRatio.value}; --h2-size-min: ${h2Size.value[0]}px; --h2-size-fluid: ${h2Size.value[1]}cqw; --h2-size-max: ${h2Size.value[2]}px; --h3-size-min: ${h3Size.value[0]}px; --h3-size-fluid: ${h3Size.value[1]}cqw; --h3-size-max: ${h3Size.value[2]}px; --h4-size-min: ${h4Size.value[0]}px; --h4-size-fluid: ${h4Size.value[1]}cqw; --h4-size-max: ${h4Size.value[2]}px; --h5-size-min: ${h5Size.value[0]}px; --h5-size-fluid: ${h5Size.value[1]}cqw; --h5-size-max: ${h5Size.value[2]}px; --h6-size-min: ${h6Size.value[0]}px; --h6-size-fluid: ${h6Size.value[1]}cqw; --h6-size-max: ${h6Size.value[2]}px; --header-line-height: ${headerLineHeight.value}; --body-font: ${quoteCssFamily(bodyFont.value)}; --header-font: ${quoteCssFamily(headerFont.value)}`
		);

		const setMode = (next: "fit" | number) => {
			if (next === "fit") {
				mode.value = "fit";
				capNotice.value = "";
				return;
			}
			mode.value = next;
			nextTick(() => {
				measureAvailable();
				if (next > availableWidth.value) {
					announceCap(
						`${next}px is wider than the preview area — showing ${availableWidth.value}px.`
					);
				} else {
					capNotice.value = "";
				}
			});
		};

		const nudge = (delta: number) => {
			measureAvailable();
			const start = mode.value === "fit" ? measuredWidth.value : appliedWidth.value;
			const next = Math.min(
				availableWidth.value,
				Math.max(MIN_FRAME, Math.round(start + delta))
			);
			mode.value = next;
		};

		const onHandleKey = (event: KeyboardEvent) => {
			if (event.key === "ArrowLeft") {
				event.preventDefault();
				nudge(event.shiftKey ? -32 : -8);
			} else if (event.key === "ArrowRight") {
				event.preventDefault();
				nudge(event.shiftKey ? 32 : 8);
			}
		};

		const onDragStart = (event: PointerEvent) => {
			const handle = event.currentTarget as HTMLButtonElement;
			handle.setPointerCapture(event.pointerId);
			measureAvailable();
			const startX = event.clientX;
			const startW = measuredWidth.value;
			const move = (ev: PointerEvent) => {
				const next = Math.min(
					availableWidth.value,
					Math.max(MIN_FRAME, Math.round(startW + ev.clientX - startX))
				);
				mode.value = next;
			};
			const up = () => {
				handle.removeEventListener("pointermove", move);
				handle.removeEventListener("pointerup", up);
				handle.removeEventListener("pointercancel", up);
			};
			handle.addEventListener("pointermove", move);
			handle.addEventListener("pointerup", up);
			handle.addEventListener("pointercancel", up);
		};

		watch(
			() => [
				mode.value,
				bodySizeMin.value,
				bodySizeFluid.value,
				bodySizeMax.value,
				headerSizeMin.value,
				headerSizeFluid.value,
				headerSizeMax.value,
				headerRatio.value,
				headingCount.value,
			],
			() => nextTick(measureFrame)
		);

		onMounted(() => {
			observers = new ResizeObserver(() => {
				measureAvailable();
				measureFrame();
			});
			if (shellEl.value) observers.observe(shellEl.value);
			if (frameEl.value) observers.observe(frameEl.value);
			measureAvailable();
			measureFrame();
		});
		onUnmounted(() => {
			observers?.disconnect();
			if (capTimer) clearTimeout(capTimer);
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
			sampleHeadings,
			h2Size,
			h3Size,
			h4Size,
			h5Size,
			h6Size,
			headerLineHeight,
			contentEditable,
			presets: PRESETS,
			mode,
			measuredWidth,
			headingPx,
			bodyPx,
			capNotice,
			shellEl,
			frameEl,
			frameStyle,
			textVars,
			setMode,
			onDragStart,
			onHandleKey,
		};
	},
};
</script>

<style>
.stage {
	min-width: 0;
	height: 100%;
	min-height: 20rem;
	display: flex;
	flex-direction: column;
}
.stage__chrome {
	display: flex;
	flex-wrap: wrap;
	align-items: flex-end;
	gap: var(--space-3) var(--space-5);
	margin-bottom: var(--space-4);
}
.stage__sample {
	flex: 1 1 12rem;
	min-width: 0;
	max-width: 24rem;
}
.stage__sample label {
	display: block;
	margin-bottom: var(--space-2);
	font-size: var(--text-label);
	font-weight: var(--weight-medium);
}
.stage__sample select {
	margin: 0;
}
.stage__edit {
	display: inline-flex;
	align-items: center;
	gap: var(--space-2);
	min-height: 44px;
	font-size: var(--text-label);
	font-weight: var(--weight-medium);
}
.stage__edit input {
	width: 1.25rem;
	height: 1.25rem;
	margin: 0;
	flex: 0 0 auto;
}
.viewport-bar {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: var(--space-3);
	margin-bottom: var(--space-3);
}
.viewport-bar__readout {
	margin: 0;
	font-size: var(--text-label);
	font-variant-numeric: tabular-nums lining-nums;
	line-height: 1.35;
}
.viewport-bar__width {
	font-weight: var(--weight-semibold);
}
.viewport-bar__sep {
	margin-inline: 0.4em;
	opacity: 0.55;
}
.viewport-bar__presets {
	display: flex;
	flex-wrap: wrap;
	gap: var(--space-1);
}
.viewport-bar__presets button {
	margin: 0;
	padding: var(--space-2) var(--space-3);
	min-height: 44px;
	letter-spacing: 0.06em;
	font-size: var(--text-meta);
}
.viewport-bar__presets button[aria-pressed="true"] {
	box-shadow: inset 0 0 0 2px var(--color-coral);
}
.viewport-bar__note {
	margin: 0 0 var(--space-3);
	font-size: var(--text-label);
	line-height: 1.45;
	color: var(--color-munsel);
}
.viewport-shell {
	display: flex;
	align-items: stretch;
	width: 100%;
	min-width: 0;
	flex: 1 1 auto;
	min-height: 12rem;
}
.viewport {
	container-type: inline-size;
	container-name: type-preview;
	flex: 0 0 auto;
	min-width: 280px;
	max-width: calc(100% - 1.25rem);
	overflow: auto;
	box-sizing: border-box;
	padding: var(--space-5);
	border: 1px solid var(--color-lapis);
	border-radius: var(--border-radius);
	box-shadow: 0 1px 4px rgba(27, 41, 55, 0.18);
}
.viewport--fit {
	flex: 1 1 auto;
	width: auto;
}
.viewport__handle {
	flex: 0 0 1.25rem;
	margin: 0;
	padding: 0;
	min-height: 44px;
	border: 0;
	background: transparent;
	cursor: ew-resize;
	touch-action: none;
	display: flex;
	align-items: center;
	justify-content: center;
	letter-spacing: 0;
	text-transform: none;
}
.viewport__handle-mark {
	display: block;
	width: 4px;
	height: 2.5rem;
	border-radius: 2px;
	background: var(--color-lapis);
}
.viewport__handle:focus-visible .viewport__handle-mark {
	background: var(--color-coral);
}
@media (pointer: coarse) {
	.viewport {
		max-width: calc(100% - 2.75rem);
	}
	.viewport__handle {
		flex-basis: 2.75rem;
	}
}
@media (max-width: 52rem) {
	.viewport-shell {
		flex: 0 1 auto;
	}
	.viewport {
		overflow: visible;
	}
}
@media (max-width: 52rem) and (orientation: landscape) {
	.stage__chrome {
		margin-bottom: var(--space-2);
	}
	.viewport-bar {
		margin-bottom: var(--space-2);
	}
	.viewport-shell {
		flex: 1 1 auto;
		min-height: 8rem;
	}
	.viewport {
		overflow: auto;
		padding: var(--space-3);
	}
}
.text {
	max-width: 69ch;
	min-width: 0;
	overflow-wrap: anywhere;
	line-height: var(--body-line-height);
	font-family: var(--body-font);
	letter-spacing: normal;
	font-weight: var(--weight-regular);
}
.text--editing {
	outline: 2px solid var(--color-coral);
	outline-offset: 0.25em;
}
.text__edit-hint {
	font-size: var(--text-prompt);
	line-height: 1.45;
	margin: 0 0 0.75em 0;
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
