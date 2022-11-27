<script lang="ts">
import RegionCell from './RegionCell.vue'

export default {
  components: { RegionCell },
  props: {
    w: { type: Number, required: true },
    h: { type: Number, required: true },
  },
  computed: {
    cells() {
      return Array(this.w * this.h).fill(0)
    },
  },
}
</script>

<template>
  <div
    class="region"
    :style="{
      width: `calc(var(--cell-size)*${w})`,
      height: `calc(var(--cell-size)*${h})`,
    }"
  >
    <RegionCell v-for="(c, i) in cells" :key="i" />
  </div>
</template>

<style scoped>
.region {
  display: flex;
  flex-wrap: wrap;
}
</style>
