import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

export interface State {
  bodySize: number
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    bodySize: 16,
  },
	mutations: {
		setBodySize(state, size) {
			state.bodySize = size;
		}
	},
})

// define your own `useStore` composition function
export function useStore () {
  return baseUseStore(key)
}