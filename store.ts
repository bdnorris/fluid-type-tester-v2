import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

export interface State {
  bodySizeMin: number,
  bodySizeFluid: number,
  bodySizeMax: number,
	bodyLineHeight: number,
	bodyFont: string,
  headerSizeMin: number,
  headerSizeFluid: number,
  headerSizeMax: number,
	headingLevels: number,
	headerRatio: number,
	headerFont: string,
	headerLineHeight: number,
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    bodySizeMin: 16,
    bodySizeFluid: 1,
    bodySizeMax: 20,
		bodyLineHeight: 1.5,
    headerSizeMin: 24,
    headerSizeFluid: 1.4,
    headerSizeMax: 96,
		headingLevels: 1,
		headerRatio: 1.2,
		headerLineHeight: 1.2,
		bodyFont: 'Roboto',
		headerFont: 'Roboto'
  },
	mutations: {
		setBodySizeMin(state, size) {
			state.bodySizeMin = size;
		},
		setBodySizeFluid(state, size) {
			state.bodySizeFluid = size;
		},
		setBodySizeMax(state, size) {
			state.bodySizeMax = size;
		},
		setBodyLineHeight(state, lineHeight) {
			state.bodyLineHeight = lineHeight;
		},
		setHeaderSizeMin(state, size) {
			state.headerSizeMin = size;
		},
		setHeaderSizeFluid(state, size) {
			state.headerSizeFluid = size;
		},
		setHeaderSizeMax(state, size) {
			state.headerSizeMax = size;
		},
		addHeadingLevel(state) {
			if (state.headingLevels < 6) {
				state.headingLevels++;
			}
		},
		removeHeadingLevel(state) {
			if (state.headingLevels > 1) {
				state.headingLevels--;
			}
		},
		setHeaderRatio(state, ratio) {
			state.headerRatio = ratio;
		},
		setHeaderLineHeight(state, lineHeight) {
			state.headerLineHeight = lineHeight;
		},
		setBodyFont(state, font) {
			state.bodyFont = font;
		},
		setHeaderFont(state, font) {
			state.headerFont = font;
		}
	},
	getters: {
		headingSize: (state) => (level: string) => {
			// console.log('headingSize', level)
			let sizes = [];
			if (level === 'h2') {
			sizes = [
				(state.headerSizeMin / state.headerRatio),
				(state.headerSizeFluid / state.headerRatio),
				(state.headerSizeMax / state.headerRatio),
			];
			} else if (level === 'h3') {
			sizes = [
				(state.headerSizeMin / Math.pow(state.headerRatio, 2)),
				(state.headerSizeFluid / Math.pow(state.headerRatio, 2)),
				(state.headerSizeMax / Math.pow(state.headerRatio, 2)),
			];
			} else if (level === 'h4') {
			sizes = [
				(state.headerSizeMin / Math.pow(state.headerRatio, 3)),
				(state.headerSizeFluid / Math.pow(state.headerRatio, 3)),
				(state.headerSizeMax / Math.pow(state.headerRatio, 3)),
			];
			} else if (level === 'h5') {
			sizes = [
				(state.headerSizeMin / Math.pow(state.headerRatio, 4)),
				(state.headerSizeFluid / Math.pow(state.headerRatio, 4)),
				(state.headerSizeMax / Math.pow(state.headerRatio, 4)),
			];
			} else if (level === 'h6') {
			sizes = [
				(state.headerSizeMin / Math.pow(state.headerRatio, 5)),
				(state.headerSizeFluid / Math.pow(state.headerRatio, 5)),
				(state.headerSizeMax / Math.pow(state.headerRatio, 5)),
			];
			}
			let rounded = sizes.map((size, index) => {
				return Math.round((size + Number.EPSILON) * 1000) / 1000;
			});
			return rounded;
		},
	}
})

// define your own `useStore` composition function
export function useStore () {
  return baseUseStore(key)
}