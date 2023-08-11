<script lang="ts">
import KText from '@/ui/KText.vue'
import RhombusSelector from '@/ui/RhombusSelector.vue'

export default {
  components: { RhombusSelector, KText },
  data() {
    return { value: 0 }
  },
  methods: {
    onChange(value: number) {
      this.value = value
    },
  },
}
</script>

<template>
  <RhombusSelector direction="vertical" :value="value" :count="4" @change="onChange">
    <KText>Floor {{ value }}</KText>
  </RhombusSelector>
</template>

<style scoped>
.mode-icon {
  transform: scale(0.7);
}
</style>
