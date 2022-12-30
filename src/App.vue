<script setup lang="ts">
import Controls from './components/Controls.vue'
import Text from './components/Text.vue'
</script>

<template>
  <main>
    <Controls />
    <div>
      <div class="code-wrap">
        <div class="code">
          <h2>Headline</h2>
          <pre>font-size: clamp({{ minHeadlineSizeRem }}rem, calc(1rem + {{ fluidHeadlineSize }}vw), {{ maxHeadlineSizeRem }}rem);</pre>
        </div>
        <div class="code">
          <h2>Paragraphs</h2>
          <pre>font-size: clamp({{ minParagraphSizeRem }}rem, calc(1rem + {{ fluidParagraphSize }}vw), {{ maxParagraphSizeRem }}rem);</pre>
        </div>
      </div>
      <Text />
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
}
</style>
