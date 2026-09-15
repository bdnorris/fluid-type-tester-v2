<template>
  <div class="lab">
    <a class="skip" href="#type-stage">Skip to sample</a>
    <div class="lab__bench">
      <header class="lab__chrome">
        <div class="lab__identity">
          <p class="lab__title">Fluid Type Tester</p>
          <p class="lab__prompt">Set min, fluid, and max, then copy the CSS.</p>
        </div>
        <CSS />
      </header>
      <div class="lab__workspace">
        <aside class="lab__dock" aria-label="Type controls">
          <Controls />
        </aside>
        <section class="lab__stage" id="type-stage" tabindex="-1">
          <Text />
        </section>
      </div>
    </div>
    <footer class="lab__notes">
      <Notes />
    </footer>
  </div>
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
.lab {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.lab__bench {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  min-height: 32rem;
}
.lab__chrome {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-3) var(--space-5);
  padding: max(var(--space-4), env(safe-area-inset-top)) max(var(--space-5), env(safe-area-inset-right)) var(--space-4) max(var(--space-5), env(safe-area-inset-left));
  border-block-end: 1px solid var(--color-lapis);
  flex: 0 0 auto;
}
.lab__identity {
  min-width: 0;
}
.lab__title {
  margin: 0;
  font-size: var(--text-identity);
  font-weight: var(--weight-semibold);
  letter-spacing: -0.015em;
  line-height: 1.2;
}
.lab__prompt {
  margin: var(--space-2) 0 0;
  font-size: var(--text-prompt);
  font-weight: var(--weight-regular);
  line-height: 1.45;
  max-width: 46ch;
}
.lab__workspace {
  display: grid;
  grid-template-columns: minmax(17.5rem, 20rem) minmax(0, 1fr);
  grid-template-areas: "dock stage";
  flex: 1 1 auto;
  min-height: 0;
}
.lab__dock {
  grid-area: dock;
  min-width: 0;
  overflow: auto;
  border-inline-end: 1px solid var(--color-lapis);
}
.lab__stage {
  grid-area: stage;
  min-width: 0;
  overflow: auto;
  padding: var(--space-5) max(var(--space-6), env(safe-area-inset-right)) var(--space-8) var(--space-6);
}
.lab__notes {
  flex: 0 0 auto;
  border-block-start: 1px solid var(--color-lapis);
}
.skip {
  position: absolute;
  inset-inline-start: var(--space-4);
  inset-block-start: var(--space-2);
  z-index: 2;
  transform: translateY(-200%);
  padding: var(--space-2) var(--space-3);
}
.skip:focus {
  transform: none;
}

@media (max-width: 52rem) {
  .lab__chrome {
    position: sticky;
    top: 0;
    z-index: 3;
  }
  .lab__bench {
    height: auto;
    min-height: 0;
  }
  .lab__workspace {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto;
    grid-template-areas:
      "stage"
      "dock";
  }
  .lab__dock {
    overflow: visible;
    border-inline-end: 0;
  }
  .lab__stage {
    overflow: visible;
    min-height: 22rem;
    padding: var(--space-4) max(var(--space-4), env(safe-area-inset-right)) var(--space-5) max(var(--space-4), env(safe-area-inset-left));
    border-block-end: 1px solid var(--color-lapis);
  }
}

@media (max-width: 52rem) and (orientation: landscape) {
  .lab__chrome {
    position: static;
    padding-block: var(--space-2);
    align-items: center;
  }
  .lab__prompt {
    display: none;
  }
  .lab__bench {
    height: 100dvh;
    min-height: 20rem;
  }
  .lab__workspace {
    grid-template-columns: minmax(14rem, 38%) minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
    grid-template-areas: "dock stage";
  }
  .lab__dock {
    overflow: auto;
    border-inline-end: 1px solid var(--color-lapis);
  }
  .lab__stage {
    overflow: auto;
    min-height: 0;
    border-block-end: 0;
    padding: var(--space-4);
  }
}

@media (prefers-color-scheme: dark) {
  .lab__title {
    letter-spacing: -0.008em;
  }
  .lab__prompt {
    font-weight: var(--weight-medium);
    letter-spacing: 0.01em;
    line-height: 1.5;
  }
}
</style>
