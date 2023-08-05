<script lang="ts">
import { GAMEDATA_ITEMS } from '@/shared/gamedata'

export default {
  props: {
    stringId: { type: String, required: true },
  },
  computed: {
    data() {
      return GAMEDATA_ITEMS[this.stringId]!
    },
  },
}
</script>

<template>
  <div class="info">
    <div class="text name">{{ data.Name }}</div>
    <div class="text text__pair" v-if="data.Values['weight kg']">
      <span>-Weight</span>
      <span>{{ data.Values['weight kg'] }} kg</span>
    </div>
    <div class="text" v-if="data.Values.description">----------------</div>
    <div class="text">{{ data.Values.description }}</div>
  </div>
</template>

<style scoped>
.info {
  width: 315px;
  padding: 16px 7px;
}
.text {
  display: block;
  color: var(--color-main);
  font-family: Exo2, sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.02em;
}
.text__pair {
  display: flex;
  justify-content: space-between;
}
.name {
  color: var(--color-title);
}
</style>
