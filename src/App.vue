<template>
  <main>
    <Controls />
    <div>
      <CSS />
      <Text />
    </div>
    <div>
    </div>
  </main>
  <footer>
    <Notes />
  </footer>
</template>

<script lang="ts">
import Controls from './components/Controls.vue'
import Text from './components/Text.vue'
import CSS from './components/CSS.vue'
import Notes from './components/Notes.vue'

export default {
  setup() {
    return {}
  },
  components: {
    Controls,
    Text,
    CSS,
    Notes
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
