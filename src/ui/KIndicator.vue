<script lang="ts">
import KText from './KText.vue'

export default {
  props: {
    label: { type: String, required: true },
    value: { type: Number, required: true },
  },
  components: { KText },
}
</script>

<template>
  <div class="indicator">
    <div class="bar">
      <KText>{{ label }}</KText>
    </div>
    <div class="value">
      <KText>{{ value }}</KText>
    </div>
  </div>
</template>

<style scoped>
.indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}
.bar {
  flex: 1;
  text-align: center;
  background: linear-gradient(to bottom, #004f00 50%, #003806 50%);
}
.value {
  width: 24px;
}
</style>
