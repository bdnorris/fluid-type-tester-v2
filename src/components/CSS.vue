<template>
	<div class="code-wrap__chrome">
		<button type="button" class="code-wrap__copy" ref="openButton" @click="copyCss">
			{{ copyLabel }}
		</button>
		<button type="button" class="code-wrap__view" @click="openDialog">View CSS</button>
		<p v-if="copyStatus && !codeWrapVisible" class="code-wrap__status" role="status">{{ copyStatus }}</p>
	</div>
	<Teleport to="body">
		<div class="code-wrap__wrapper" v-if="codeWrapVisible">
			<div class="code-wrap__screen" @click="closeDialog"></div>
			<div
				class="code-wrap code-wrap--visible"
				role="dialog"
				aria-modal="true"
				aria-labelledby="css-dialog-title"
				ref="dialogEl"
				tabindex="-1"
				@keydown="onDialogKeydown"
			>
				<div class="code-wrap__toolbar">
					<h2 id="css-dialog-title">CSS to copy</h2>
					<button type="button" ref="dialogCopyButton" @click="copyCss">{{ copyLabel }}</button>
					<button type="button" ref="closeButton" class="code-wrap__close" @click="closeDialog">
						Close
					</button>
				</div>
				<p v-if="copyStatus" class="code-wrap__status" role="status">{{ copyStatus }}</p>
				<pre>{{ cssText }}</pre>
			</div>
		</div>
	</Teleport>
</template>

<script lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from "@vue/runtime-core";
import { useStore } from "../../store";
import { quoteCssFamily } from "../fonts";

export default {
	setup() {
		const store = useStore();
		const codeWrapVisible = ref(false);
		const copyStatus = ref("");
		const copyLabel = ref("Copy CSS");
		const dialogEl = ref<HTMLElement | null>(null);
		const openButton = ref<HTMLButtonElement | null>(null);
		const dialogCopyButton = ref<HTMLButtonElement | null>(null);
		const closeButton = ref<HTMLButtonElement | null>(null);
		let copyTimer: ReturnType<typeof setTimeout> | undefined;

		const headerFont = computed(() => quoteCssFamily(store.state.headerFont));
		const bodyFont = computed(() => quoteCssFamily(store.state.bodyFont));
		const bodySizeMin = computed(() => store.state.bodySizeMin);
		const bodySizeFluid = computed(() => store.state.bodySizeFluid);
		const bodySizeMax = computed(() => store.state.bodySizeMax);
		const bodyLineHeight = computed(() => store.state.bodyLineHeight);
		const headerSizeMin = computed(() => store.state.headerSizeMin);
		const headerSizeFluid = computed(() => store.state.headerSizeFluid);
		const headerSizeMax = computed(() => store.state.headerSizeMax);
		const headerLineHeight = computed(() => store.state.headerLineHeight);
		const headingLevels = computed(() => store.state.headingLevels);
		const h2Size = computed(() => store.getters.headingSize("h2"));
		const h3Size = computed(() => store.getters.headingSize("h3"));
		const h4Size = computed(() => store.getters.headingSize("h4"));
		const h5Size = computed(() => store.getters.headingSize("h5"));
		const h6Size = computed(() => store.getters.headingSize("h6"));

		const headingBlock = (selector: string, min: number, fluid: number, max: number) =>
			`${selector} {
	font-family: ${headerFont.value};
	font-size: clamp(${min}px, calc(1rem + ${fluid}vw), ${max}px);
	line-height: ${headerLineHeight.value};
}`;

		const headingCss = computed(() => {
			const blocks = [
				headingBlock("h1", headerSizeMin.value, headerSizeFluid.value, headerSizeMax.value),
			];
			if (headingLevels.value > 1) {
				blocks.push(headingBlock("h2", h2Size.value[0], h2Size.value[1], h2Size.value[2]));
			}
			if (headingLevels.value > 2) {
				blocks.push(headingBlock("h3", h3Size.value[0], h3Size.value[1], h3Size.value[2]));
			}
			if (headingLevels.value > 3) {
				blocks.push(headingBlock("h4", h4Size.value[0], h4Size.value[1], h4Size.value[2]));
			}
			if (headingLevels.value > 4) {
				blocks.push(headingBlock("h5", h5Size.value[0], h5Size.value[1], h5Size.value[2]));
			}
			if (headingLevels.value > 5) {
				blocks.push(headingBlock("h6", h6Size.value[0], h6Size.value[1], h6Size.value[2]));
			}
			return blocks.join("\n\n");
		});

		const paragraphCss = computed(
			() => `p {
	font-family: ${bodyFont.value};
	font-size: clamp(${bodySizeMin.value}px, calc(1rem + ${bodySizeFluid.value}vw), ${bodySizeMax.value}px);
	line-height: ${bodyLineHeight.value};
}`
		);

		const cssText = computed(() => `${headingCss.value}\n\n${paragraphCss.value}\n`);

		const focusable = () => {
			const root = dialogEl.value;
			if (!root) return [];
			return Array.from(
				root.querySelectorAll<HTMLElement>(
					'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
				)
			).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
		};

		const openDialog = () => {
			codeWrapVisible.value = true;
			nextTick(() => {
				dialogCopyButton.value?.focus();
			});
		};

		const closeDialog = () => {
			codeWrapVisible.value = false;
			copyStatus.value = "";
			nextTick(() => {
				openButton.value?.focus();
			});
		};

		const onDialogKeydown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				closeDialog();
				return;
			}
			if (event.key !== "Tab") return;
			const nodes = focusable();
			if (nodes.length === 0) return;
			const first = nodes[0];
			const last = nodes[nodes.length - 1];
			const active = document.activeElement as HTMLElement | null;
			if (event.shiftKey && active === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && active === last) {
				event.preventDefault();
				first.focus();
			}
		};

		const copyCss = async () => {
			try {
				await navigator.clipboard.writeText(cssText.value);
				copyStatus.value = "Copied.";
				copyLabel.value = "Copied";
			} catch {
				copyStatus.value = "Couldn’t copy automatically — select the CSS and copy it yourself.";
				copyLabel.value = "Copy CSS";
				if (!codeWrapVisible.value) {
					openDialog();
				}
			}
			if (copyTimer) clearTimeout(copyTimer);
			copyTimer = setTimeout(() => {
				copyLabel.value = "Copy CSS";
			}, 2500);
		};

		watch(codeWrapVisible, (open) => {
			document.body.style.overflow = open ? "hidden" : "";
		});

		onUnmounted(() => {
			document.body.style.overflow = "";
			if (copyTimer) clearTimeout(copyTimer);
		});

		return {
			codeWrapVisible,
			cssText,
			copyStatus,
			copyLabel,
			dialogEl,
			openButton,
			dialogCopyButton,
			closeButton,
			openDialog,
			closeDialog,
			onDialogKeydown,
			copyCss,
		};
	},
};
</script>

<style>
.code-wrap__chrome {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-end;
	gap: var(--space-2) var(--space-3);
	max-width: 22rem;
}
.code-wrap__copy,
.code-wrap__view,
.code-wrap__toolbar button {
	margin: 0;
	min-height: 44px;
	padding: var(--space-3) var(--space-4);
}
.code-wrap__view:hover,
.code-wrap__close:hover {
	border-color: var(--color-munsel);
}
.code-wrap__wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	inset: 0;
	z-index: 100;
	padding: max(1em, env(safe-area-inset-top)) max(1em, env(safe-area-inset-right)) max(1em, env(safe-area-inset-bottom)) max(1em, env(safe-area-inset-left));
}
.code-wrap {
	position: relative;
	max-width: min(42rem, 100%);
	max-height: min(90dvh, 100%);
	overflow: auto;
	min-width: 0;
	padding: var(--space-5);
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
	transform: none;
}
.code-wrap__toolbar {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--space-2) var(--space-3);
	margin-bottom: var(--space-4);
}
.code-wrap__toolbar h2 {
	flex: 1 1 8rem;
	margin: 0;
	min-width: 0;
	overflow-wrap: anywhere;
	font-size: 1.125rem;
}
.code-wrap__close {
	background-color: transparent;
	border: 1px solid var(--color-lapis);
	color: inherit;
}
.code-wrap__status {
	font-size: 0.875rem;
	margin: 0;
	flex: 1 1 100%;
	overflow-wrap: anywhere;
	color: var(--color-munsel);
}
.code-wrap pre {
	overflow-x: auto;
	max-width: 100%;
	margin: 0;
	white-space: pre-wrap;
	overflow-wrap: anywhere;
}
</style>
