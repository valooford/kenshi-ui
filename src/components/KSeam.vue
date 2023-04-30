<script lang="ts">
import type { PropType } from 'vue'
import { SeamInventoryTypes } from '@/constants'

import CharacterInventory from './CharacterInventory.vue'

export default {
  components: { CharacterInventory },
  props: {
    data: { type: Object as PropType<ISeam>, required: true },
  },
  emits: ['items-change', 'close'],
  data() {
    return { SeamInventoryTypes }
  },
}
</script>

<template>
  <div class="seam" :key="data.related?.id">
    <CharacterInventory
      v-if="data.main?.type === SeamInventoryTypes.Character"
      :data="data.main.data"
      @items-change="(...args: any[]) => $emit('items-change', ...args)"
      @close="(...args: any[]) => $emit('close', ...args)"
      :key="data.main.id"
    />
    <CharacterInventory
      v-if="data.related?.type === SeamInventoryTypes.Character"
      :data="data.related.data"
      @items-change="(...args: any[]) => $emit('items-change', ...args)"
      @close="(...args: any[]) => $emit('close', ...args)"
      :key="data.related.id"
    />
  </div>
</template>

<style scoped>
.seam {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: flex-start;
  gap: 4px;
  padding: 56px;
}
</style>
