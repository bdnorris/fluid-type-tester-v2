<template>
	<div class="controls">
		<fieldset>
			<legend>Body Text</legend>
			<div class="controls__slider">
				<input type="range" min="10" max="100" class="slider" id="bodySize" v-model="bodySize">
			</div>
		</fieldset>
	</div>
</template>

<script lang="ts">
import { ref, watch } from '@vue/runtime-core'
import { useStore } from '../../store'
export default {
	setup () {
		const store = useStore()
		// console.log(store)
		const bodySize = ref(store.state.bodySize)
		watch (bodySize, (newVal) => {
			store.commit('setBodySize', newVal)
		})
		return {
			bodySize: bodySize
		}
	},
}
</script>

<style>

</style>