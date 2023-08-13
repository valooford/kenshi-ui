<script lang="ts">
import KButton from './KButton.vue'

export default {
  extends: KButton,
  components: { KButton },
  data() {
    return { isChecked: false }
  },
  computed: {
    itemProps() {
      return this.$props
    },
  },
  methods: {
    onClick() {
      this.isChecked = !this.isChecked
    },
  },
}
</script>

<template>
  <label class="radio-container" @click="onClick">
    <input type="radio" :value="true" class="radio" />
    <KButton v-bind="itemProps" full-width :is-selected="isChecked" class="button">
      <template #before><div :class="['mark', isChecked && 'mark_selected']" /></template>
      <slot />
    </KButton>
  </label>
</template>

<style scoped>
.radio-container {
  display: flex;
}
.radio {
  display: none;
}
.button {
  line-height: 19rem;
}
.button:not(:disabled):hover .mark {
  background-color: var(--color-title);
}
.button:not(:disabled):active .mark {
  background-color: #66502b;
}
.mark {
  width: 6rem;
  height: 6rem;
  margin: 6rem;
  background-color: #666666;
  border-radius: 3rem;
}
.mark_selected {
  background-color: #b0ad98;
}
</style>
