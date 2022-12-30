import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

export interface State {
  bodySizeMin: number,
  bodySizeFluid: number,
  bodySizeMax: number
  headerSizeMin: number,
  headerSizeFluid: number,
  headerSizeMax: number,
	headingLevels: number,
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    bodySizeMin: 16,
    bodySizeFluid: 1,
    bodySizeMax: 20,
    headerSizeMin: 24,
    headerSizeFluid: 1.4,
    headerSizeMax: 96,
		headingLevels: 1,
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
		}
	},
})

// define your own `useStore` composition function
export function useStore () {
  return baseUseStore(key)
}