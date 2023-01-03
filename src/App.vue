<template>
  <main>
    <Controls />
    <div>
      <CSS />
      <Text />
    </div>
    <div></div>
  </main>
</template>

<script lang="ts">
import Controls from './components/Controls.vue'
import Text from './components/Text.vue'
import CSS from './components/CSS.vue'

export default {
  setup() {
    return {}
  },
  components: {
    Controls,
    Text,
    CSS,
  },
}
</script>

<style scoped>
main {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  gap: 2em;
}
</style>
