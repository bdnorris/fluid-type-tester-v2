<template>
  <main>
    <Controls />
    <div>
      <CSS />
      <Text />
    </div>
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
  display: flex;
}
</style>
